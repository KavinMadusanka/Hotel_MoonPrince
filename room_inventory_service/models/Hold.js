// src/models/Hold.js
import mongoose from "mongoose";

const holdSchema = new mongoose.Schema(
  {
    reservationId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    roomType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
      required: true,
      index: true,
    },

    checkIn: {
      type: Date,
      required: true,
      index: true,
    },

    checkOut: {
      type: Date,
      required: true,
      index: true,
    },

    qty: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["held", "confirmed", "released", "expired"],
      default: "held",
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    createdBy: {
      type: String,
      trim: true,
      default: "reservation-service",
    },
  },
  { timestamps: true }
);

// TTL index for auto-removal after expiry time
holdSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// helpful for availability queries
holdSchema.index({ roomType: 1, status: 1, checkIn: 1, checkOut: 1 });

export default mongoose.model("Hold", holdSchema);