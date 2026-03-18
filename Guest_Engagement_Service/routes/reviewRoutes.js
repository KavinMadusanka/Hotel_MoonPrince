import express from 'express';
import { createReview } from '../controllers/reviewController.js';

const router = express.Router();

// Create Review
router.post("/", createReview);

export default router;