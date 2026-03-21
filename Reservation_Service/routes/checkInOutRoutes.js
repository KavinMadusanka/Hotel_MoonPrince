import express from "express";
import {
  checkInReservation,
  checkOutReservation
} from "../controllers/checkInOutController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/checkinout/{id}/check-in:
 *   post:
 *     summary: Check in a guest for a confirmed reservation
 *     tags: [CheckInOut]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Guest checked in successfully
 */
router.post("/:id/check-in", checkInReservation);

/**
 * @swagger
 * /api/v1/checkinout/{id}/check-out:
 *   post:
 *     summary: Check out a guest and complete reservation
 *     tags: [CheckInOut]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Guest checked out successfully
 */
router.post("/:id/check-out", checkOutReservation);

export default router;