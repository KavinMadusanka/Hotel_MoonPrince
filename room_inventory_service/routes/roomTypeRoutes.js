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

/**
 * @swagger
 * tags:
 *   name: Room Types
 *   description: Room type management endpoints
 */

/**
 * @swagger
 * /room-types:
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
 *
 *   post:
 *     summary: Create a new room type
 *     tags: [Room Types]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
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

/**
 * @swagger
 * /room-types/{id}:
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
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 *   delete:
 *     summary: Delete a room type by ID
 *     tags: [Room Types]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
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