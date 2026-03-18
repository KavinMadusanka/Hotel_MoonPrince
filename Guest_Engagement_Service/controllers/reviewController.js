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
}