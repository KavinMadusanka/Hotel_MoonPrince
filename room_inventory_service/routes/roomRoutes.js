import express from "express";
import {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  updateRoomStatus,
  deleteRoom
} from "../controllers/roomController.js";
import validate from "../middleware/validate.js";
import {
  createRoomSchema,
  updateRoomSchema,
  updateRoomStatusSchema
} from "../validations/roomValidation.js";

const router = express.Router();

router
  .route("/")
  .post(validate(createRoomSchema), createRoom)
  .get(getRooms);

router
  .route("/:id")
  .get(getRoomById)
  .patch(validate(updateRoomSchema), updateRoom)
  .delete(deleteRoom);

router.patch("/:id/status", validate(updateRoomStatusSchema), updateRoomStatus);

export default router;