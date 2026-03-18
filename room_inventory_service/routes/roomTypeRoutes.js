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

/**
 * @swagger
 * /api/room-types:
 *   post:
 *     summary: Create a new room type
 *     tags: [Room Types]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoomTypeInput'
 *     responses:
 *       201:
 *         description: Room type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoomTypeResponse'
 *       400:
 *         description: Validation error
 *
 *   get:
 *     summary: Get all room types
 *     tags: [Room Types]
 *     responses:
 *       200:
 *         description: List of room types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RoomType'
 */
router
  .route("/")
  .post(
    upload.array("images", 5),
    parseRoomTypeFormData,
    validate(createRoomTypeSchema),
    createRoomType
  )
  .get(getRoomTypes);

/**
 * @swagger
 * /api/room-types/{id}:
 *   get:
 *     summary: Get a room type by ID
 *     tags: [Room Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room type ID
 *     responses:
 *       200:
 *         description: Room type found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoomType'
 *       404:
 *         description: Room type not found
 *
 *   patch:
 *     summary: Update a room type by ID
 *     tags: [Room Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room type ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoomTypeInput'
 *     responses:
 *       200:
 *         description: Room type updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoomTypeResponse'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Room type not found
 *
 *   delete:
 *     summary: Delete a room type by ID
 *     tags: [Room Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room type ID
 *     responses:
 *       200:
 *         description: Room type deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       404:
 *         description: Room type not found
 */
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