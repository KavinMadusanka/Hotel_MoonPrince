// src/models/Room.js
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    floor: {
      type: Number,
    },

    roomType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["ready", "dirty", "maintenance", "out_of_service"],
      default: "ready",
      index: true,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);