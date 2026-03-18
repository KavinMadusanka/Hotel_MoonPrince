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