import express from "express";
import {
  createHold,
  confirmHold,
  releaseHold,
  getAllHolds,
  getHoldById
} from "../controllers/holdController.js";
import validate from "../middleware/validate.js";
import { createHoldSchema } from "../validations/holdValidation.js";

const router = express.Router();

/**
 * @swagger
 * /api/holds:
 *   post:
 *     summary: Create a temporary hold for a room type
 *     tags: [Holds]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservationId:
 *                 type: string
 *                 example: RES-1002
 *               roomType:
 *                 type: string
 *                 example: 69b399d0c171ed66bee50e15
 *               checkIn:
 *                 type: string
 *                 example: 2026-03-20
 *               checkOut:
 *                 type: string
 *                 example: 2026-03-22
 *               qty:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Hold created successfully
 *       409:
 *         description: Not enough rooms available or duplicate active hold
 *   get:
 *     summary: Get all holds
 *     tags: [Holds]
 *     responses:
 *       200:
 *         description: List of holds
 */

/**
 * @swagger
 * /api/holds/{id}:
 *   get:
 *     summary: Get one hold by id
 *     tags: [Holds]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hold found
 *       404:
 *         description: Hold not found
 */

/**
 * @swagger
 * /api/holds/{holdId}/confirm:
 *   post:
 *     summary: Confirm a hold
 *     tags: [Holds]
 *     parameters:
 *       - in: path
 *         name: holdId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hold confirmed successfully
 *       404:
 *         description: Hold not found
 */

/**
 * @swagger
 * /api/holds/{holdId}/release:
 *   post:
 *     summary: Release a hold
 *     tags: [Holds]
 *     parameters:
 *       - in: path
 *         name: holdId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hold released successfully
 *       404:
 *         description: Hold not found
 */

router.route("/")
  .post(validate(createHoldSchema), createHold)
  .get(getAllHolds);

router.route("/:id")
  .get(getHoldById);

router.post("/:holdId/confirm", confirmHold);
router.post("/:holdId/release", releaseHold);

export default router;