import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({

    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true // one review per booking
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