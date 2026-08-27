require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");

const Room = require("./models/Room");
const Participant = require("./models/Participant");

app.use(cors());
app.use(express.urlencoded({ extended: true }));

let server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

function createRoomId() {
  // no 0/O/1/I — avoids codes that are easy to mistype or misread
  let char = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

  let code = "";

  for (let i = 0; i < 5; i++) {
    let idx = Math.floor(Math.random() * char.length);
    code += char[idx];
  }
  return code;
}

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("createRoom", async ({ participantId } = {}) => {
    if (!participantId) {
      socket.emit("error-message", "Missing participantId");
      return;
    }

    try {
      const roomID = createRoomId();

      const room = await Room.create({ roomId: roomID, status: "waiting" });

      const host = await Participant.create({
        room: room._id,
        participantId,
        socketId: socket.id,
        role: "host",
      });

      room.hostParticipantId = host._id;
      await room.save();

      socket.join(roomID);
      socket.data.roomId = roomID;
      socket.data.participantId = participantId;

      console.log("✅ Room created:", roomID);
      socket.emit("room-created", roomID);
    } catch (err) {
      console.error("createRoom error:", err);
      socket.emit("error-message", "Could not create room");
    }
  });

  socket.on("join-room", async ({ roomId, participantId } = {}) => {
    if (!roomId || !participantId) {
      socket.emit("error-message", "Missing roomId or participantId");
      return;
    }

    try {
      const room = await Room.findOne({ roomId });

      if (!room || room.status === "closed") {
        socket.emit("Room not found", "Room not exist");
        return;
      }

      await Participant.create({
        room: room._id,
        participantId,
        socketId: socket.id,
        role: "guest",
      });

      room.status = "active";
      await room.save();

      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.participantId = participantId;

      console.log(`✅ ${socket.id} joined room ${roomId}`);

      socket.emit("join-successfully");

      socket.to(roomId).emit("receiver joined");
    } catch (err) {
      console.error("join-room error:", err);
      socket.emit("error-message", "Could not join room");
    }
  });

  // reconnect after a refresh — same participantId, new socket.id
  socket.on("rejoin-room", async ({ roomId, participantId } = {}) => {
    if (!roomId || !participantId) return;

    try {
      const room = await Room.findOne({ roomId });
      if (!room) {
        socket.emit("Room not found", "Room not exist");
        return;
      }

      const updated = await Participant.findOneAndUpdate(
        { room: room._id, participantId },
        { socketId: socket.id, connectionStatus: "connected", leftAt: null },
        { new: true },
      );

      if (!updated) {
        socket.emit("error-message", "Could not find your prior session in this room");
        return;
      }

      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.participantId = participantId;

      console.log(`🔄 ${socket.id} rejoined room ${roomId}`);
      socket.emit("rejoined", { role: updated.role });
      socket.to(roomId).emit("peer-reconnected");
    } catch (err) {
      console.error("rejoin-room error:", err);
    }
  });

  socket.on("offer", ({ roomId, offer }) => {
    console.log("📨 Offer received for room:", roomId);
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("ans", ({ roomId, ans }) => {
    console.log("📨 Answer received for room:", roomId);
    socket.to(roomId).emit("ans", ans);
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    console.log("🧊 ICE Candidate for room:", roomId);
    socket.to(roomId).emit("ice-candidate", candidate);
  });

  socket.on("disconnect", async () => {
    console.log("❌ user disconnected", socket.id);
    try {
      await Participant.updateOne(
        { socketId: socket.id },
        { connectionStatus: "disconnected", leftAt: new Date() },
      );
      if (socket.data.roomId) {
        socket.to(socket.data.roomId).emit("peer-disconnected");
      }
    } catch (err) {
      console.error("disconnect handler error:", err);
    }
  });
});

server.listen(3000, () => console.log("server started on port 3000"));