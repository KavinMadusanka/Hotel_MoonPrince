import express from "express";
import {
  createRoomType,
  getRoomTypes,
  getRoomTypeById,
  updateRoomType,
  deleteRoomType
} from "../controllers/roomTypeController.js";
import validate from "../middleware/validate.js";
import upload from "../middleware/upload.js";
import parseRoomTypeFormData from "../middleware/parseRoomTypeFormData.js";
import {
  createRoomTypeSchema,
  updateRoomTypeSchema
} from "../validations/roomTypeValidation.js";
import { requiredSignIn, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getRoomTypes)
  .post(
    requiredSignIn,
    isAdmin,
    upload.array("images", 5),
    parseRoomTypeFormData,
    validate(createRoomTypeSchema),
    createRoomType
  );

router
  .route("/:id")
  .get(getRoomTypeById)
  .patch(
    requiredSignIn,
    isAdmin,
    upload.array("images", 5),
    parseRoomTypeFormData,
    validate(updateRoomTypeSchema),
    updateRoomType
  )
  .delete(requiredSignIn, isAdmin, deleteRoomType);

export default router;