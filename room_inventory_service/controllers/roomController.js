import Room from "../models/Room.js";
import RoomType from "../models/RoomType.js";

export const createRoom = async (req, res, next) => {
  try {
    const roomTypeExists = await RoomType.findById(req.body.roomType);

    if (!roomTypeExists) {
      return res.status(404).json({ message: "Room type not found" });
    }

    const room = await Room.create({
      roomNumber: req.body.roomNumber,
      floor: req.body.floor,
      roomType: req.body.roomType,
      status: req.body.status,
      notes: req.body.notes
    });

    res.status(201).json({
      message: "Room created successfully",
      room
    });
  } catch (error) {
    next(error);
  }
};

export const getRooms = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.roomType) filter.roomType = req.query.roomType;
    if (req.query.status) filter.status = req.query.status;

    const rooms = await Room.find(filter)
      .populate("roomType")
      .sort({ roomNumber: 1 });

    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

export const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate("roomType");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    next(error);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const roomTypeExists = await RoomType.findById(req.body.roomType);
    if (!roomTypeExists) {
      return res.status(404).json({ message: "Room type not found" });
    }

    room.roomNumber = req.body.roomNumber;
    room.floor = req.body.floor;
    room.roomType = req.body.roomType;
    room.status = req.body.status;
    room.notes = req.body.notes;

    const updatedRoom = await room.save();

    const populatedRoom = await Room.findById(updatedRoom._id).populate("roomType");

    res.json({
      message: "Room updated successfully",
      room: populatedRoom
    });
  } catch (error) {
    next(error);
  }
};

export const updateRoomStatus = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    room.status = req.body.status;
    if (req.body.notes !== undefined) room.notes = req.body.notes;

    const updatedRoom = await room.save();
    res.json({
      message: "Room status updated successfully",
      room: updatedRoom
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    await room.deleteOne();

    res.json({
      message: "Room deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};