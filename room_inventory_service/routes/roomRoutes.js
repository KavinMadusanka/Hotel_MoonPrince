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

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management endpoints
 */

/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoomInput'
 *     responses:
 *       201:
 *         description: Room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoomResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Room type not found
 *
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: roomType
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by room type ID
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [ready, dirty, maintenance, out_of_service]
 *         description: Filter by room status
 *     responses:
 *       200:
 *         description: List of rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router
  .route("/")
  .post(requiredSignIn, isAdmin, validate(createRoomSchema), createRoom)
  .get(requiredSignIn, getRooms);

/**
 * @swagger
 * /rooms/{id}:
 *   get:
 *     summary: Get a room by ID
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Room not found
 *
 *   patch:
 *     summary: Update a room by ID
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoomInput'
 *     responses:
 *       200:
 *         description: Room updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoomResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Room or room type not found
 *
 *   delete:
 *     summary: Delete a room by ID
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Room not found
 */
router
  .route("/:id")
  .get(requiredSignIn, isAdmin, getRoomById)
  .patch(requiredSignIn, isAdmin, validate(updateRoomSchema), updateRoom)
  .delete(requiredSignIn, isAdmin, deleteRoom);

/**
 * @swagger
 * /rooms/{id}/status:
 *   patch:
 *     summary: Update room status
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoomStatusInput'
 *     responses:
 *       200:
 *         description: Room status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoomResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Room not found
 */
router.patch(
  "/:id/status",
  requiredSignIn,
  isAdmin,
  validate(updateRoomStatusSchema),
  updateRoomStatus
);

export default router;