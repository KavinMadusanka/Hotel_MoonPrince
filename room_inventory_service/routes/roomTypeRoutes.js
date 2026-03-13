import express from "express";
import {
  createRoomType,
  getRoomTypes,
  getRoomTypeById,
  updateRoomType
} from "../controllers/roomTypeController.js";
import validate from "../middleware/validate.js";
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
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoomType'
 *     responses:
 *       201:
 *         description: Room type created successfully
 *       400:
 *         description: Validation failed
 *   get:
 *     summary: Get all room types
 *     tags: [Room Types]
 *     responses:
 *       200:
 *         description: List of room types
 */

/**
 * @swagger
 * /api/room-types/{id}:
 *   get:
 *     summary: Get a room type by id
 *     tags: [Room Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Room type found
 *       404:
 *         description: Room type not found
 *   patch:
 *     summary: Update a room type
 *     tags: [Room Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoomType'
 *     responses:
 *       200:
 *         description: Room type updated successfully
 *       404:
 *         description: Room type not found
 */

router.route("/")
  .post(validate(createRoomTypeSchema), createRoomType)
  .get(getRoomTypes);

router.route("/:id")
  .get(getRoomTypeById)
  .patch(validate(updateRoomTypeSchema), updateRoomType);

export default router;