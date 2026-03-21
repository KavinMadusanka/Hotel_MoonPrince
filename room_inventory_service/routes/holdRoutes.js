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

// Reservation/integration route
router.route("/").post(validate(createHoldSchema), createHold);

// Admin-only hold viewing
router.route("/").get(requiredSignIn, isAdmin, getAllHolds);
router.route("/:id").get(requiredSignIn, isAdmin, getHoldById);

// Keep these open for reservation-service integration for now
router.post("/:holdId/confirm", confirmHold);
router.post("/:holdId/release", releaseHold);

export default router;