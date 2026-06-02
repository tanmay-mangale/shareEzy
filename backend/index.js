const express = require("express");
const http = require("http");
const app = express();
const { Server } = require("socket.io");
const cors = require("cors");
const { Socket } = require("dgram");

app.use(cors());
app.use(express.urlencoded({ extended: true }));

let server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

let rooms = {};

function createRoomId() {
  let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let code = "";

  for (let i = 0; i < 5; i++) {
    let idx = Math.floor(Math.random() * char.length);
    code += char[idx];
  }
  return code;
}

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("createRoom", () => {
    const roomID = createRoomId();

    socket.join(roomID);
    rooms[roomID] = {
      users: [socket.id],
    };

    console.log("room created");
    socket.emit("room-created", roomID);
  });

  socket.on("join-room", (roomID) => {
    if (rooms[roomID]) {
      socket.join(roomID);
      rooms[roomID].users.push(socket.id);

      console.log(socket.id + "joint the room");

      socket.emit("join-successfully");

      socket.to(roomID).emit("receiver joined");
    } else {
      socket.emit("Room not found", "Room not exist");
    }
  });

  socket.on("offer", ({ roomId, offer }) => {
    console.log("offer received in backend");
    console.log(roomId);
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("ans", ({ roomId, ans }) => {
    console.log("answer received in backend");
    console.log(roomId);
    socket.to(roomId).emit("ans", ans);
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("ice-candidate", candidate);
  });
});

const PORT =
  process.env.PORT || 3000;

server.listen(PORT, () => console.log("server started on port 3000"));
