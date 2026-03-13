import express from "express";
import {
  createRoom,
  getRooms,
  getRoomById,
  updateRoomStatus
} from "../controllers/roomController.js";
import validate from "../middleware/validate.js";
import {
  createRoomSchema,
  updateRoomStatusSchema
} from "../validations/roomValidation.js";

const router = express.Router();

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Create a new physical room
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       201:
 *         description: Room created successfully
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: List of rooms
 */

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Get one room by id
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Room found
 *       404:
 *         description: Room not found
 */

/**
 * @swagger
 * /api/rooms/{id}/status:
 *   patch:
 *     summary: Update room status
 *     tags: [Rooms]
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
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: maintenance
 *               notes:
 *                 type: string
 *                 example: AC repair in progress
 *     responses:
 *       200:
 *         description: Room status updated
 *       404:
 *         description: Room not found
 */

router.route("/")
  .post(validate(createRoomSchema), createRoom)
  .get(getRooms);

router.route("/:id")
  .get(getRoomById);

router.patch("/:id/status", validate(updateRoomStatusSchema), updateRoomStatus);

export default router;