import Room from "../models/Room.js";
import RoomType from "../models/RoomType.js";
import Hold from "../models/Hold.js";
import { computeFinalPricePerNight, calculateNights } from "../utils/pricing.js";

// Controller to check room availabiliy for a given room type and date range
export const getAvailability = async (req, res, next) => {
  try {
    const { roomTypeId, checkIn, checkOut, qty } = req.query;

    const roomType = await RoomType.findById(roomTypeId);
    if (!roomType) {
      return res.status(404).json({ message: "Room type not found" });
    }

    const totalRooms = await Room.countDocuments({
      roomType: roomTypeId,
      status: { $in: ["ready", "dirty"] }
    });

    const overlapQuery = {
      roomType: roomTypeId,
      checkIn: { $lt: new Date(checkOut) },
      checkOut: { $gt: new Date(checkIn) }
    };

    const now = new Date();

    const heldAgg = await Hold.aggregate([
      {
        $match: {
          ...overlapQuery,
          status: "held",
          expiresAt: { $gt: now }
        }
      },
      {
        $group: {
          _id: null,
          totalQty: { $sum: "$qty" }
        }
      }
    ]);

    const confirmedAgg = await Hold.aggregate([
      {
        $match: {
          ...overlapQuery,
          status: "confirmed"
        }
      },
      {
        $group: {
          _id: null,
          totalQty: { $sum: "$qty" }
        }
      }
    ]);

    const heldQty = heldAgg[0]?.totalQty || 0;
    const confirmedQty = confirmedAgg[0]?.totalQty || 0;

    const availableCount = Math.max(0, totalRooms - heldQty - confirmedQty);

    const nights = calculateNights(checkIn, checkOut);
    const priceInfo = computeFinalPricePerNight(roomType);
    const estimatedTotal = priceInfo.finalPricePerNight * nights * Number(qty);

    res.json({
      roomTypeId,
      roomTypeName: roomType.name,
      totalRooms,
      heldQty,
      confirmedQty,
      availableCount,
      requestedQty: Number(qty),
      canFulfill: availableCount >= Number(qty),
      nights,
      basePricePerNight: priceInfo.basePricePerNight,
      discountApplied: priceInfo.discountApplied,
      discount: priceInfo.discount,
      finalPricePerNight: priceInfo.finalPricePerNight,
      estimatedTotal
    });
  } catch (error) {
    next(error);
  }
};