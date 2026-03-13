import express from "express";
import { getAvailability } from "../controllers/availabilityController.js";
import validate from "../middleware/validate.js";
import { availabilityQuerySchema } from "../validations/availabilityValidation.js";

const router = express.Router();

/**
 * @swagger
 * /api/availability:
 *   get:
 *     summary: Check room availability by room type and date range
 *     tags: [Availability]
 *     parameters:
 *       - in: query
 *         name: roomTypeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: checkIn
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-03-20
 *       - in: query
 *         name: checkOut
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-03-22
 *       - in: query
 *         name: qty
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Availability result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AvailabilityResponse'
 *       404:
 *         description: Room type not found
 */

router.get("/", validate(availabilityQuerySchema, "query"), getAvailability);

export default router;