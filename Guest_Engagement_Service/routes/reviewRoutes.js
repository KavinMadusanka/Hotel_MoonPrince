import express from 'express';
import { createReview,
    getSingleReview, 
    updateReview,
    getReviewsByRoomId,
    deleteReview,
    pinReview,
    getReviewsByUser} from '../controllers/reviewController.js';
import { isAdmin, requiredSignIn } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create Review
router.post("/", requiredSignIn, createReview);

// Get Reviews by Room Type ID
router.get("/room/:roomTypeId", getReviewsByRoomId);

// Get Reviews by User ID (protected). Provide either `/reviews/user` (uses token) or `/reviews/user/:userId`.
router.get("/user/:userId", requiredSignIn, getReviewsByUser);
router.get("/user", requiredSignIn, getReviewsByUser);

// Get Single Review
router.get("/:id", getSingleReview);

// Update Review
router.put("/:id", requiredSignIn, updateReview);

// Pin Review
router.put("/pin/:id", requiredSignIn, isAdmin, pinReview);

// Delete Review
router.delete("/:id", requiredSignIn, deleteReview);



export default router;