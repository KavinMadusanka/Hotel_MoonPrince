import Reservation from "../models/Reservation.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import calculateNights from "../utils/calculateNights.js";

const generateReservationCode = () => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `RES-${Date.now()}-${random}`;
};

const generateLocalHoldId = () => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `LOCAL-HOLD-${Date.now()}-${random}`;
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

  const holdId = generateLocalHoldId();

  const reservation = await Reservation.create({
    reservationCode: generateReservationCode(),
    userId,
    roomId,
    roomTypeId,
    holdId,
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
    message:
      "Reservation created successfully. Temporary local hold generated because inventory service is not connected yet.",
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

  if (!reservation) {
    throw new ApiError(404, "Reservation not found");
  }

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

  if (!reservation) {
    throw new ApiError(404, "Reservation not found");
  }

  if (reservation.status === "cancelled" || reservation.status === "completed") {
    throw new ApiError(
      400,
      "Cancelled or completed reservations cannot be modified"
    );
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

  if (!reservation) {
    throw new ApiError(404, "Reservation not found");
  }

  if (reservation.status !== "pending") {
    throw new ApiError(400, "Only pending reservations can be confirmed");
  }

  reservation.status = "confirmed";
  reservation.confirmedAt = new Date();
  reservation.paymentStatus = "not_applicable";

  await reservation.save();

  res.status(200).json({
    success: true,
    message:
      "Reservation confirmed successfully. Inventory service confirmation is skipped in current standalone phase.",
    data: reservation
  });
});

export const cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    throw new ApiError(404, "Reservation not found");
  }

  if (reservation.status === "cancelled") {
    throw new ApiError(400, "Reservation is already cancelled");
  }

  if (reservation.status === "completed") {
    throw new ApiError(400, "Completed reservation cannot be cancelled");
  }

  reservation.status = "cancelled";
  reservation.cancelledAt = new Date();
  reservation.cancellationReason =
    req.body?.cancellationReason || "Cancelled by guest/user";
  reservation.paymentStatus = "not_applicable";

  await reservation.save();

  res.status(200).json({
    success: true,
    message:
      "Reservation cancelled successfully. No refund is processed because online payment is not implemented yet.",
    data: reservation
  });
});