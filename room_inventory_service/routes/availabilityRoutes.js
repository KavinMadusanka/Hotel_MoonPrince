import express from "express";
import { getAvailability } from "../controllers/availabilityController.js";
import validate from "../middleware/validate.js";
import { availabilityQuerySchema } from "../validations/availabilityValidation.js";

const router = express.Router();

router.get("/", validate(availabilityQuerySchema, "query"), getAvailability);

export default router;