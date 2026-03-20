import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    reservationCode: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    userId: {
      type: String,
      required: true,
      trim: true
    },

    roomId: {
      type: String,
      required: true,
      trim: true
    },

    roomTypeId: {
      type: String,
      required: true,
      trim: true
    },

    holdId: {
      type: String,
      required: true,
      trim: true
    },

    guestName: {
      type: String,
      required: true,
      trim: true
    },

    guestEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    guestPhone: {
      type: String,
      required: true,
      trim: true
    },

    checkInDate: {
      type: Date,
      required: true
    },

    checkOutDate: {
      type: Date,
      required: true
    },

    guestsCount: {
      type: Number,
      required: true,
      min: 1
    },

    nights: {
      type: Number,
      required: true,
      min: 1
    },

    baseAmount: {
      type: Number,
      required: true,
      min: 0
    },

    currency: {
      type: String,
      default: process.env.DEFAULT_CURRENCY || "LKR"
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "checked_in", "completed"],
      default: "pending"
    },

    paymentStatus: {
      type: String,
      enum: ["not_applicable", "pending", "paid", "failed", "refunded"],
      default: "not_applicable"
    },

    bookingSource: {
      type: String,
      enum: ["guest", "receptionist", "admin"],
      default: "guest"
    },

    specialRequests: {
      type: String,
      trim: true,
      default: ""
    },

    cancellationReason: {
      type: String,
      trim: true,
      default: ""
    },

    notes: {
      type: String,
      trim: true,
      default: ""
    },

    confirmedAt: {
      type: Date,
      default: null
    },

    cancelledAt: {
      type: Date,
      default: null
    },

    checkedInAt: {
      type: Date,
      default: null
    },

    checkedOutAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

reservationSchema.index({ userId: 1 });
reservationSchema.index({ roomId: 1 });
reservationSchema.index({ roomTypeId: 1 });
reservationSchema.index({ status: 1 });
reservationSchema.index({ checkInDate: 1, checkOutDate: 1 });

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;