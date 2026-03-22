import Hold from "../models/Hold.js";
import RoomType from "../models/RoomType.js";
import Room from "../models/Room.js";
import mongoose from "mongoose";

export const createHold = async (req, res, next) => {
  try {
    const {
      reservationId,
      roomType,
      checkIn,
      checkOut,
      qty = 1,
      createdBy
    } = req.body;

    if (!reservationId) {
      return res.status(400).json({ message: "reservationId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(roomType)) {
      return res.status(400).json({ message: "Invalid roomType id" });
    }

    const roomTypeDoc = await RoomType.findById(roomType);
    if (!roomTypeDoc) {
      return res.status(404).json({ message: "Room type not found" });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        message: "checkOut must be after checkIn"
      });
    }

    const totalRooms = await Room.countDocuments({
      roomType,
      status: { $in: ["ready", "dirty"] }
    });

    const activeHeld = await Hold.aggregate([
      {
        $match: {
          roomType: new mongoose.Types.ObjectId(roomType),
          status: "held",
          expiresAt: { $gt: new Date() },
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

    const confirmed = await Hold.aggregate([
      {
        $match: {
          roomType: new mongoose.Types.ObjectId(roomType),
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

    const heldQty = activeHeld[0]?.totalQty || 0;
    const confirmedQty = confirmed[0]?.totalQty || 0;
    const availableCount = Math.max(0, totalRooms - heldQty - confirmedQty);

    if (availableCount < Number(qty)) {
      return res.status(409).json({
        message: "Not enough rooms available for this hold request"
      });
    }

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const hold = await Hold.create({
      reservationId,
      roomType,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      qty: Number(qty),
      status: "held",
      expiresAt,
      createdBy: createdBy || "reservation-service"
    });

    const populatedHold = await Hold.findById(hold._id).populate("roomType");

    return res.status(201).json({
      success: true,
      message: "Hold created successfully",
      data: populatedHold
    });
  } catch (error) {
    next(error);
  }
};

export const releaseHold = async (req, res, next) => {
  try {
    const { holdId } = req.params;

    const hold = await Hold.findById(holdId).populate("roomType");

    if (!hold) {
      return res.status(404).json({ message: "Hold not found" });
    }

    if (hold.status === "released") {
      return res.status(400).json({ message: "Hold is already released" });
    }

    if (hold.status === "expired") {
      return res.status(400).json({ message: "Expired hold is already inactive" });
    }

    hold.status = "released";
    await hold.save();

    return res.status(200).json({
      success: true,
      message: "Hold released successfully",
      data: hold
    });
  } catch (error) {
    next(error);
  }
};

export const confirmHold = async (req, res, next) => {
  try {
    const { holdId } = req.params;

    const hold = await Hold.findById(holdId).populate("roomType");

    if (!hold) {
      return res.status(404).json({ message: "Hold not found" });
    }

    if (hold.status === "confirmed") {
      return res.status(400).json({ message: "Hold is already confirmed" });
    }

    if (hold.status === "released") {
      return res.status(400).json({ message: "Released hold cannot be confirmed" });
    }

    if (hold.status === "expired") {
      return res.status(400).json({ message: "Expired hold cannot be confirmed" });
    }

    if (hold.expiresAt && new Date(hold.expiresAt) <= new Date()) {
      hold.status = "expired";
      await hold.save();

      return res.status(400).json({ message: "Hold has expired" });
    }

    hold.status = "confirmed";
    await hold.save();

    return res.status(200).json({
      success: true,
      message: "Hold confirmed successfully",
      data: hold
    });
  } catch (error) {
    next(error);
  }
};

export const getAllHolds = async (req, res, next) => {
  try {
    const holds = await Hold.find().populate("roomType").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: holds.length,
      data: holds
    });
  } catch (error) {
    next(error);
  }
};

export const getHoldById = async (req, res, next) => {
  try {
    const hold = await Hold.findById(req.params.id).populate("roomType");

    if (!hold) {
      return res.status(404).json({ message: "Hold not found" });
    }

    return res.status(200).json({
      success: true,
      data: hold
    });
  } catch (error) {
    next(error);
  }
};