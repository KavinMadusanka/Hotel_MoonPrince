import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    priority: {
        type: String,
        enum: ["normal", "important", "urgent"],
        default: "normal"
    },

    image: {
        type: String   // Cloudinary URL
    },

    publishDate: Date,
    expiryDate: Date,

    isPinned: {
        type: Boolean,
        default: false
    },

    isDraft: {
        type: Boolean,
        default: false
    },

    createdBy: String

}, { timestamps: true });

export default mongoose.model("Announcement", announcementSchema);