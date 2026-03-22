import mongoose from "mongoose";
import Room from "../models/Room.js";
import RoomType from "../models/RoomType.js";
import Hold from "../models/Hold.js";
import {
  calculateNights,
  computeFinalPricePerNight
} from "../utils/pricing.js";

const getActiveHeldQty = async ({ roomTypeObjectId, checkInDate, checkOutDate }) => {
  const now = new Date();

  const result = await Hold.aggregate([
    {
      $match: {
        roomType: roomTypeObjectId,
        status: "held",
        expiresAt: { $gt: now },
        checkIn: { $lt: checkOutDate },
        checkOut: { $gt: checkInDate }
      }
    },
    {
      $group: {
        _id: null,
        totalQty: { $sum: "$qty" }
      }
    }
  ]);

  return result[0]?.totalQty || 0;
};

const getConfirmedQty = async ({ roomTypeObjectId, checkInDate, checkOutDate }) => {
  const result = await Hold.aggregate([
    {
      $match: {
        roomType: roomTypeObjectId,
        status: "confirmed",
        checkIn: { $lt: checkOutDate },
        checkOut: { $gt: checkInDate }
      }
    },
    {
      $group: {
        _id: null,
        totalQty: { $sum: "$qty" }
      }
    }
  ]);

  return result[0]?.totalQty || 0;
};

export const getAvailability = async (req, res, next) => {
  try {
    const validatedQuery = req.validated?.query || req.query;

    const roomTypeId = validatedQuery.roomTypeId;
    const checkIn = validatedQuery.checkIn;
    const checkOut = validatedQuery.checkOut;
    const qty = Number(validatedQuery.qty || 1);

    if (!mongoose.Types.ObjectId.isValid(roomTypeId)) {
      return res.status(400).json({
        message: "Invalid roomTypeId"
      });
    }

    const roomType = await RoomType.findById(roomTypeId);

    if (!roomType) {
      return res.status(404).json({
        message: "Room type not found"
      });
    }

    if (roomType.isActive === false) {
      return res.status(400).json({
        message: "This room type is inactive"
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const nights = calculateNights(checkInDate, checkOutDate);

    const roomTypeObjectId = new mongoose.Types.ObjectId(roomTypeId);

    const allUsableRooms = await Room.find({
      roomType: roomTypeObjectId,
      status: { $in: ["ready", "dirty"] }
    })
      .select("_id roomNumber floor status")
      .sort({ roomNumber: 1 });

    const totalRooms = allUsableRooms.length;

    const heldQty = await getActiveHeldQty({
      roomTypeObjectId,
      checkInDate,
      checkOutDate
    });

    const confirmedQty = await getConfirmedQty({
      roomTypeObjectId,
      checkInDate,
      checkOutDate
    });

    const availableCount = Math.max(0, totalRooms - heldQty - confirmedQty);

    const priceInfo = computeFinalPricePerNight(roomType);

    const estimatedTotal = Number(
      (priceInfo.finalPricePerNight * nights * qty).toFixed(2)
    );

    // receptionist-friendly list of currently usable rooms
    // since holds in your model are by qty, not by specific room ids,
    // we expose the first N usable room numbers as assignable candidates
    const availableRooms = allUsableRooms.slice(0, availableCount).map((room) => ({
      _id: room._id,
      roomNumber: room.roomNumber,
      floor: room.floor,
      status: room.status
    }));

    return res.status(200).json({
      roomTypeId: roomType._id,
      roomTypeName: roomType.name,
      totalRooms,
      heldQty,
      confirmedQty,
      availableCount,
      requestedQty: qty,
      canFulfill: availableCount >= qty,
      nights,
      basePricePerNight: priceInfo.basePricePerNight,
      discountApplied: priceInfo.discountApplied,
      discount: priceInfo.discount,
      finalPricePerNight: priceInfo.finalPricePerNight,
      estimatedTotal,
      availableRooms,
      suggestedRoomNumbers: availableRooms.slice(0, qty).map((room) => room.roomNumber)
    });
  } catch (error) {
    next(error);
  }
};