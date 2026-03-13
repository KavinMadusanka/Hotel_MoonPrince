// Utility functions for pricing and discounts
export function isDiscountValid(roomType, now = new Date()) {
  if (!roomType.discountActive) return false;

  const from = roomType.discountValidFrom ? new Date(roomType.discountValidFrom) : null;
  const to = roomType.discountValidTo ? new Date(roomType.discountValidTo) : null;

  if (from && now < from) return false;
  if (to && now > to) return false;
  if (!roomType.discountValue || roomType.discountValue <= 0) return false;

  return true;
}

// Computes the final price per night for a room type, considering any active discounts
export function computeFinalPricePerNight(roomType, now = new Date()) {
  const base = Number(roomType.basePrice || 0);

  if (!isDiscountValid(roomType, now)) {
    return {
      basePricePerNight: base,
      discountApplied: false,
      discount: null,
      finalPricePerNight: base
    };
  }

  const type = roomType.discountType;
  const value = Number(roomType.discountValue || 0);

  let final = base;

  if (type === "PERCENT") {
    const pct = Math.max(0, Math.min(100, value));
    final = base - (base * pct) / 100;
  } else if (type === "FIXED") {
    final = base - value;
  }

  final = Math.max(0, final);

  return {
    basePricePerNight: base,
    discountApplied: true,
    discount: { type, value },
    finalPricePerNight: final
  };
}

// Helper to calculate number of nights between two dates
export function calculateNights(checkIn, checkOut) {
  const diffMs = new Date(checkOut) - new Date(checkIn);
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}