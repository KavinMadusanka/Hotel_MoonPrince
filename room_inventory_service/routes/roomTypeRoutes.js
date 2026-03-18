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

const router = express.Router();

router
  .route("/")
  .post(
    upload.array("images", 5),
    parseRoomTypeFormData,
    validate(createRoomTypeSchema),
    createRoomType
  )
  .get(getRoomTypes);

router
  .route("/:id")
  .get(getRoomTypeById)
  .patch(
    upload.array("images", 5),
    parseRoomTypeFormData,
    validate(updateRoomTypeSchema),
    updateRoomType
  )
  .delete(deleteRoomType);

export default router;