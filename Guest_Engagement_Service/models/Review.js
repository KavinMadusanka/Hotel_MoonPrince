import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({

    roomTypeId: {
        type: String,
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    bookingId: {
        type: String,
        required: true,
        unique: true
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    comment: {
        type: String,
        required: true
    },

    isPinned: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);