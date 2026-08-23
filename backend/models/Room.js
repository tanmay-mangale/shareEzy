const mongoose = require("mongoose");
const { Schema } = mongoose;

const RoomSchema = new Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["waiting", "active", "closed"],
      default: "waiting",
    },
    hostParticipantId: {
      type: Schema.Types.ObjectId,
      ref: "Participant",
      default: null,
    },
    maxParticipants: {
      type: Number,
      default: 2,
    },
    closedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

RoomSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

module.exports = mongoose.model("Room", RoomSchema);