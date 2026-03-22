import express from "express";
import {
  createHold,
  getAllHolds,
  getHoldById,
  confirmHold,
  releaseHold
} from "../controllers/holdController.js";
import validate from "../middleware/validate.js";
import { createHoldSchema } from "../validations/holdValidation.js";
import { requiredSignIn, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Holds
 *   description: Hold management endpoints
 */

/**
 * @swagger
 * /holds:
 *   post:
 *     summary: Create a new hold
 *     tags: [Holds]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reservationId
 *               - roomType
 *               - checkIn
 *               - checkOut
 *               - qty
 *             properties:
 *               reservationId:
 *                 type: string
 *                 example: "RES-1002"
 *               roomType:
 *                 type: string
 *                 example: "69b399d0c171ed66bee50e15"
 *               checkIn:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-03-20T00:00:00.000Z"
 *               checkOut:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-03-22T00:00:00.000Z"
 *               qty:
 *                 type: integer
 *                 example: 1
 *               createdBy:
 *                 type: string
 *                 example: "reservation-service"
 *     responses:
 *       201:
 *         description: Hold created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hold'
 *       400:
 *         description: Validation error
 *
 *   get:
 *     summary: Get all holds
 *     tags: [Holds]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of holds
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hold'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
// Reservation/integration route
router.route("/").post(validate(createHoldSchema), createHold);

// Admin-only hold viewing
router.route("/").get(requiredSignIn, isAdmin, getAllHolds);

/**
 * @swagger
 * /holds/{id}:
 *   get:
 *     summary: Get a hold by ID
 *     tags: [Holds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hold ID
 *     responses:
 *       200:
 *         description: Hold found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hold'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Hold not found
 */
router.route("/:id").get(requiredSignIn, isAdmin, getHoldById);

/**
 * @swagger
 * /holds/{holdId}/confirm:
 *   post:
 *     summary: Confirm a hold
 *     tags: [Holds]
 *     parameters:
 *       - in: path
 *         name: holdId
 *         required: true
 *         schema:
 *           type: string
 *         description: Hold ID
 *     responses:
 *       200:
 *         description: Hold confirmed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hold'
 *       404:
 *         description: Hold not found
 */
router.post("/:holdId/confirm", confirmHold);

/**
 * @swagger
 * /holds/{holdId}/release:
 *   post:
 *     summary: Release a hold
 *     tags: [Holds]
 *     parameters:
 *       - in: path
 *         name: holdId
 *         required: true
 *         schema:
 *           type: string
 *         description: Hold ID
 *     responses:
 *       200:
 *         description: Hold released successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hold'
 *       404:
 *         description: Hold not found
 */
// Keep these open for reservation-service integration for now
router.post("/:holdId/release", releaseHold);

export default router;