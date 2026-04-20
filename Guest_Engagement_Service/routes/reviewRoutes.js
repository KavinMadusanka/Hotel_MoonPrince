import express from 'express';
import { createReview,
    getSingleReview, 
    updateReview,
    getReviewsByRoomId,
    deleteReview,
    pinReview,
    unpinReview,
    getReviewsByUser,
    getAllReviews} from '../controllers/reviewController.js';
import { isAdmin, requiredSignIn } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create Review
router.post("/", requiredSignIn, createReview);

// Get All Reviews
router.get("/all", getAllReviews);

// Get Reviews by Room Type ID
router.get("/room/:roomTypeId", getReviewsByRoomId);

// Get Reviews by User ID (protected). Provide either `/reviews/user` (uses token) or `/reviews/user/:userId`.
router.get("/user/:userId", requiredSignIn, getReviewsByUser);
router.get("/user", requiredSignIn, getReviewsByUser);

// Pin Review (MORE SPECIFIC - MUST BE BEFORE /:id)
router.put("/pin/:id", requiredSignIn, isAdmin, pinReview);

// Unpin Review (MORE SPECIFIC - MUST BE BEFORE /:id)
router.put("/unpin/:id", requiredSignIn, isAdmin, unpinReview);

// Get Single Review
router.get("/:id", getSingleReview);

// Update Review
router.put("/:id", requiredSignIn, updateReview);

// Delete Review
router.delete("/:id", requiredSignIn, deleteReview);



export default router;