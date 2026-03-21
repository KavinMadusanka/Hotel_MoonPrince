import express from "express";
import { getAvailability } from "../controllers/availabilityController.js";
import validate from "../middleware/validate.js";
import { availabilityQuerySchema } from "../validations/availabilityValidation.js";

const router = express.Router();

/**
 * @swagger
 * /availability:
 *   get:
 *     summary: Check room availability by room type and date range
 *     tags: [Availability]
 *     parameters:
 *       - in: query
 *         name: roomTypeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Room type MongoDB ObjectId
 *       - in: query
 *         name: checkIn
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Check-in date
 *       - in: query
 *         name: checkOut
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Check-out date
 *       - in: query
 *         name: qty
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Number of rooms requested
 *     responses:
 *       200:
 *         description: Availability result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AvailabilityResponse'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Room type not found
 */
router.get("/", validate(availabilityQuerySchema, "query"), getAvailability);

export default router;