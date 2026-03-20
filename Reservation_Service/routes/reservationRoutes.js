import express from "express";
import {
  createReservation,
  getAllReservations,
  getReservationById,
  getReservationsByUserId,
  updateReservation,
  confirmReservation,
  cancelReservation
} from "../controllers/reservationController.js";
import {
  validateCreateReservation,
  validateUpdateReservation
} from "../validations/reservationValidation.js";

const router = express.Router();

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReservationBody'
 *     responses:
 *       201:
 *         description: Reservation created successfully
 */
router.post("/", validateCreateReservation, createReservation);

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: List of reservations
 */
router.get("/", getAllReservations);

/**
 * @swagger
 * /api/reservations/user/{userId}:
 *   get:
 *     summary: Get reservations by user ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User reservations fetched successfully
 */
router.get("/user/:userId", getReservationsByUserId);

/**
 * @swagger
 * /api/reservations/{id}:
 *   get:
 *     summary: Get reservation by ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation fetched successfully
 */
router.get("/:id", getReservationById);

/**
 * @swagger
 * /api/reservations/{id}:
 *   put:
 *     summary: Update reservation basic details
 *     tags: [Reservations]
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
 *             $ref: '#/components/schemas/UpdateReservationBody'
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 */
router.put("/:id", validateUpdateReservation, updateReservation);

/**
 * @swagger
 * /api/reservations/{id}/confirm:
 *   post:
 *     summary: Confirm a reservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation confirmed successfully
 */
router.post("/:id/confirm", confirmReservation);

/**
 * @swagger
 * /api/reservations/{id}/cancel:
 *   post:
 *     summary: Cancel a reservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelReservationBody'
 *     responses:
 *       200:
 *         description: Reservation cancelled successfully
 */
router.post("/:id/cancel", cancelReservation);

export default router;