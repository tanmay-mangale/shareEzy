const mongoose = require("mongoose");
const { Schema } = mongoose;

const ParticipantSchema = new Schema(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },
    participantId: {
      type: String,
      required: true,
      index: true,
    },
    socketId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["host", "guest"],
      required: true,
    },
    displayName: {
      type: String,
      default: null,
    },
    connectionStatus: {
      type: String,
      enum: ["connected", "disconnected"],
      default: "connected",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    leftAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

ParticipantSchema.index({ room: 1, participantId: 1 }, { unique: true });

module.exports = mongoose.model("Participant", ParticipantSchema);