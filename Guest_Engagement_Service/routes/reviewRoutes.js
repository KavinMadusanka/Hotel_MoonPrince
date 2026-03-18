import express from 'express';
import { createReview,
    getSingleReview, 
    updateReview} from '../controllers/reviewController.js';

const router = express.Router();

// Create Review
router.post("/", createReview);

// Get Single Review
router.get("/:id", getSingleReview);

// Update Review
router.put("/:id", updateReview);

export default router;