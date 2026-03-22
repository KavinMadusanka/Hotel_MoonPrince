import mongoose from "mongoose";
import Review from "../models/Review.js";

// Create Review
export const createReview = async (req, res) => {
    try {
        const { roomId, bookingId, rating, comment } = req.body;
        const userId = "65f1a2b3c4d5e6f789012345";

        // check duplicate review for the same booking
        const existing = await Review.findOne({ bookingId });

        if (existing) {
            return res.status(400).json({
                message: "You already reviewed this booking"
            });
        }

        // FUTURE ==================================
        // validate booking service here

        const review = await Review.create({
            roomId,
            userId,
            bookingId,
            rating,
            comment
        });

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// Get Single Review
export const getSingleReview = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid review ID"
            });
        }

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        res.status(200).json({
            success: true,
            data: review
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update Review
export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = "65f1a2b3c4d5e6f789012345";

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        // check if the review belongs to the user
        if (review.userId.toString() !== userId) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        // 24h check
        const diff = (Date.now() - review.createdAt) / (1000 * 60 * 60);

        if (diff > 24) {
            return res.status(400).json({
                message: "You can edit review only within 24 hours"
            });
        }

        const updated = await Review.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: updated
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get Reviews by Room ID
export const getReviewsByRoomId = async (req, res) => {
    try {
        const { roomId } = req.params;

        const reviews = await Review.find({ roomId })
            .sort({ isPinned: -1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Delete Review
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = "65f1a2b3c4d5e6f789012345";

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        if (review.userId.toString() !== userId) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        const diff = (Date.now() - review.createdAt) / (1000 * 60 * 60);

        if (diff > 24) {
            return res.status(400).json({
                message: "You can delete review only within 24 hours"
            });
        }

        await Review.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Pin review
export const pinReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        // unpin all reviews for that room
        await Review.updateMany(
            { roomId: review.roomId },
            { isPinned: false }
        );

        const pinned = await Review.findByIdAndUpdate(
            id,
            { isPinned: true },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Review pinned successfully",
            data: pinned
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get Reviews by User
export const getReviewsByUser = async (req, res) => {
    try {
        const userId = "65f1a2b3c4d5e6f789012345";

        // validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const reviews = await Review.find({ userId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};