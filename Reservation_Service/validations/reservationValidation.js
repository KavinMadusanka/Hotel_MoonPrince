import ApiError from "../utils/ApiError.js";
import calculateNights from "../utils/calculateNights.js";

export const validateCreateReservation = (req, res, next) => {
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
    baseAmount
  } = req.body;

  if (
    !userId ||
    !roomId ||
    !roomTypeId ||
    !guestName ||
    !guestEmail ||
    !guestPhone ||
    !checkInDate ||
    !checkOutDate ||
    guestsCount === undefined ||
    baseAmount === undefined
  ) {
    return next(new ApiError(400, "All required fields must be provided"));
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(guestEmail)) {
    return next(new ApiError(400, "Invalid guest email"));
  }

  if (Number(guestsCount) < 1) {
    return next(new ApiError(400, "Guests count must be at least 1"));
  }

  if (Number(baseAmount) < 0) {
    return next(new ApiError(400, "Base amount cannot be negative"));
  }

  const nights = calculateNights(checkInDate, checkOutDate);
  if (nights <= 0) {
    return next(new ApiError(400, "Check-out date must be after check-in date"));
  }

  next();
};

export const validateUpdateReservation = (req, res, next) => {
  const allowedFields = [
    "guestName",
    "guestEmail",
    "guestPhone",
    "specialRequests",
    "notes"
  ];

  const requestKeys = Object.keys(req.body);

  const isValid = requestKeys.every((key) => allowedFields.includes(key));

  if (!isValid) {
    return next(
      new ApiError(
        400,
        "Only guestName, guestEmail, guestPhone, specialRequests, and notes can be updated"
      )
    );
  }

  if (req.body.guestEmail) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(req.body.guestEmail)) {
      return next(new ApiError(400, "Invalid guest email"));
    }
  }

  next();
};