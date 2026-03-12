// src/models/RoomType.js
import mongoose from "mongoose";

const roomTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
    },

    maxGuests: {
      type: Number,
      required: true,
      min: 1,
    },

    bedType: {
      type: String,
      trim: true,
    },

    amenities: [
      {
        type: String,
        trim: true,
      },
    ],

    images: [
      {
        type: String,
        trim: true,
      },
    ],

    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discountActive: {
      type: Boolean,
      default: false,
    },

    discountType: {
      type: String,
      enum: ["PERCENT", "FIXED"],
      default: "PERCENT",
    },

    discountValue: {
      type: Number,
      default: 0,
      min: 0,
    },

    discountValidFrom: {
      type: Date,
    },

    discountValidTo: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("RoomType", roomTypeSchema);