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
import { requiredSignIn, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(requiredSignIn, isAdmin, validate(createRoomSchema), createRoom)
  .get(requiredSignIn, isAdmin, getRooms);

router
  .route("/:id")
  .get(requiredSignIn, isAdmin, getRoomById)
  .patch(requiredSignIn, isAdmin, validate(updateRoomSchema), updateRoom)
  .delete(requiredSignIn, isAdmin, deleteRoom);

router.patch(
  "/:id/status",
  requiredSignIn,
  isAdmin,
  validate(updateRoomStatusSchema),
  updateRoomStatus
);

export default router;