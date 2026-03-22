import Hold from "../models/Hold.js";
import RoomType from "../models/RoomType.js";
import Room from "../models/Room.js";
import mongoose from "mongoose";

export const createHold = async (req, res, next) => {
  try {
    const { roomType, checkIn, checkOut, qty, guestName, guestEmail, notes } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(roomType)) {
      return res.status(400).json({ message: "Invalid roomType id" });
    }

    const roomTypeDoc = await RoomType.findById(roomType);
    if (!roomTypeDoc) {
      return res.status(404).json({ message: "Room type not found" });
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
          checkIn: { $lt: new Date(checkOut) },
          checkOut: { $gt: new Date(checkIn) }
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
          checkIn: { $lt: new Date(checkOut) },
          checkOut: { $gt: new Date(checkIn) }
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

    if (availableCount < qty) {
      return res.status(409).json({
        message: "Not enough rooms available for this hold request"
      });
    }

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const hold = await Hold.create({
      roomType,
      checkIn,
      checkOut,
      qty,
      guestName,
      guestEmail,
      notes,
      status: "held",
      expiresAt
    });

    const populatedHold = await Hold.findById(hold._id).populate("roomType");

    return res.status(201).json({
      message: "Hold created successfully",
      hold: populatedHold
    });
  } catch (error) {
    next(error);
  }
};

export const getAllHolds = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { guestName: { $regex: search, $options: "i" } },
        { guestEmail: { $regex: search, $options: "i" } }
      ];
    }

    let holds = await Hold.find(query)
      .populate("roomType")
      .sort({ createdAt: -1 });

    const now = new Date();
    let hasExpiredUpdates = false;

    for (const hold of holds) {
      if (
        hold.status === "held" &&
        hold.expiresAt &&
        new Date(hold.expiresAt) <= now
      ) {
        hold.status = "expired";
        await hold.save();
        hasExpiredUpdates = true;
      }
    }

    if (hasExpiredUpdates) {
      holds = await Hold.find(query)
        .populate("roomType")
        .sort({ createdAt: -1 });
    }

    return res.status(200).json(holds);
  } catch (error) {
    next(error);
  }
};

export const getHoldById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const hold = await Hold.findById(id).populate("roomType");

    if (!hold) {
      return res.status(404).json({ message: "Hold not found" });
    }

    if (
      hold.status === "held" &&
      hold.expiresAt &&
      new Date(hold.expiresAt) <= new Date()
    ) {
      hold.status = "expired";
      await hold.save();
    }

    return res.status(200).json(hold);
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
      message: "Hold confirmed successfully",
      hold
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

    if (hold.status === "confirmed") {
      return res.status(400).json({
        message: "Confirmed hold cannot be released from inventory directly"
      });
    }

    if (hold.status === "expired") {
      return res.status(400).json({ message: "Expired hold is already inactive" });
    }

    hold.status = "released";
    await hold.save();

    return res.status(200).json({
      message: "Hold released successfully",
      hold
    });
  } catch (error) {
    next(error);
  }
};