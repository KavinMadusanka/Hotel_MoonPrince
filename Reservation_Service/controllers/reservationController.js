import Reservation from "../models/Reservation.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import calculateNights from "../utils/calculateNights.js";
import {
  createHold,
  confirmHold,
  releaseHold
} from "../utils/inventoryClient.js";

const generateReservationCode = () => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `RES-${Date.now()}-${random}`;
};

export const createReservation = asyncHandler(async (req, res) => {
  const {
    userId,
    roomId,
    roomTypeId,
    guestName,
    guestEmail,
    guestPhone,
    checkInDate,
    checkOutDate,
    guestsCount,
    baseAmount,
    specialRequests,
    bookingSource
  } = req.body;

  const nights = calculateNights(checkInDate, checkOutDate);
  if (nights <= 0) {
    throw new ApiError(400, "Check-out date must be after check-in date");
  }

  const reservationCode = generateReservationCode();

  const hold = await createHold({
    reservationCode,
    roomTypeId,
    checkIn: checkInDate,
    checkOut: checkOutDate
  });

  if (!hold || !hold._id) {
    throw new ApiError(500, "Inventory service did not return a valid hold");
  }

  const reservation = await Reservation.create({
    reservationCode,
    userId,
    roomId,
    roomTypeId,
    holdId: hold._id.toString(),
    guestName,
    guestEmail,
    guestPhone,
    checkInDate,
    checkOutDate,
    guestsCount: Number(guestsCount),
    nights,
    baseAmount: Number(baseAmount),
    specialRequests: specialRequests || "",
    bookingSource: bookingSource || "guest",
    status: "pending",
    paymentStatus: "not_applicable"
  });

  res.status(201).json({
    success: true,
    message: "Reservation created successfully.",
    data: reservation
  });
});

export const getAllReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reservations.length,
    data: reservations
  });
});

export const getReservationById = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) throw new ApiError(404, "Reservation not found");

  res.status(200).json({
    success: true,
    data: reservation
  });
});

export const getReservationsByUserId = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({
    userId: req.params.userId
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reservations.length,
    data: reservations
  });
});

export const updateReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) throw new ApiError(404, "Reservation not found");

  if (reservation.status === "cancelled" || reservation.status === "completed") {
    throw new ApiError(400, "Cancelled or completed reservations cannot be modified");
  }

  const allowedFields = [
    "guestName",
    "guestEmail",
    "guestPhone",
    "specialRequests",
    "notes"
  ];

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      reservation[field] = req.body[field];
    }
  }

  await reservation.save();

  res.status(200).json({
    success: true,
    message: "Reservation updated successfully",
    data: reservation
  });
});

export const confirmReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) throw new ApiError(404, "Reservation not found");

  if (reservation.status !== "pending") {
    throw new ApiError(400, "Only pending reservations can be confirmed");
  }

  await confirmHold(reservation.holdId);

  reservation.status = "confirmed";
  reservation.confirmedAt = new Date();
  reservation.paymentStatus = "not_applicable";
  await reservation.save();

  res.status(200).json({
    success: true,
    message: "Reservation confirmed successfully.",
    data: reservation
  });
});

export const cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) throw new ApiError(404, "Reservation not found");

  if (reservation.status === "cancelled") {
    throw new ApiError(400, "Reservation is already cancelled");
  }

  if (reservation.status === "completed") {
    throw new ApiError(400, "Completed reservation cannot be cancelled");
  }

  await releaseHold(reservation.holdId);

  reservation.status = "cancelled";
  reservation.cancelledAt = new Date();
  reservation.cancellationReason =
    req.body?.cancellationReason || "Cancelled by guest/user";
  reservation.paymentStatus = "not_applicable";

  await reservation.save();

  res.status(200).json({
    success: true,
    message: "Reservation cancelled successfully.",
    data: reservation
  });
});