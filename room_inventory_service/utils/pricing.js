import dayjs from "dayjs";

export const calculateNights = (checkIn, checkOut) => {
  const start = dayjs(checkIn).startOf("day");
  const end = dayjs(checkOut).startOf("day");

  const nights = end.diff(start, "day");

  if (nights <= 0) {
    throw new Error("Check-out date must be after check-in date");
  }

  return nights;
};

export const isDiscountCurrentlyActive = (roomType) => {
  if (!roomType?.discountActive) return false;

  const now = dayjs();

  const hasValidFrom = !!roomType.discountValidFrom;
  const hasValidTo = !!roomType.discountValidTo;

  if (!hasValidFrom && !hasValidTo) {
    return true;
  }

  if (hasValidFrom && now.isBefore(dayjs(roomType.discountValidFrom))) {
    return false;
  }

  if (hasValidTo && now.isAfter(dayjs(roomType.discountValidTo))) {
    return false;
  }

  return true;
};

export const computeFinalPricePerNight = (roomType) => {
  const basePricePerNight = Number(roomType?.basePrice || 0);

  if (basePricePerNight < 0) {
    throw new Error("Base price cannot be negative");
  }

  const discountApplied = isDiscountCurrentlyActive(roomType);

  if (!discountApplied) {
    return {
      basePricePerNight,
      discountApplied: false,
      discount: null,
      finalPricePerNight: basePricePerNight
    };
  }

  const discountType = roomType.discountType || "PERCENT";
  const discountValue = Number(roomType.discountValue || 0);

  let finalPricePerNight = basePricePerNight;

  if (discountType === "PERCENT") {
    finalPricePerNight =
      basePricePerNight - (basePricePerNight * discountValue) / 100;
  } else if (discountType === "FIXED") {
    finalPricePerNight = basePricePerNight - discountValue;
  }

  finalPricePerNight = Math.max(0, Number(finalPricePerNight.toFixed(2)));

  return {
    basePricePerNight,
    discountApplied: true,
    discount: {
      type: discountType,
      value: discountValue
    },
    finalPricePerNight
  };
};