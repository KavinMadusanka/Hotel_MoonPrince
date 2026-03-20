import Reservation from "../models/Reservation.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const checkInReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    throw new ApiError(404, "Reservation not found");
  }

  if (reservation.status !== "confirmed") {
    throw new ApiError(400, "Only confirmed reservations can be checked in");
  }

  reservation.status = "checked_in";
  reservation.checkedInAt = new Date();

  await reservation.save();

  res.status(200).json({
    success: true,
    message: "Guest checked in successfully",
    data: reservation
  });
});

export const checkOutReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    throw new ApiError(404, "Reservation not found");
  }

  if (reservation.status !== "checked_in") {
    throw new ApiError(400, "Only checked-in reservations can be checked out");
  }

  reservation.status = "completed";
  reservation.checkedOutAt = new Date();

  await reservation.save();

  res.status(200).json({
    success: true,
    message: "Guest checked out successfully. Reservation completed.",
    data: reservation
  });
});