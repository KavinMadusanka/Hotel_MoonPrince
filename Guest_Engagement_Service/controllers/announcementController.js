import Announcement from "../models/Announcement.js";
import cloudinary from './../config/cloudinary.js';

// Create Announcement
export const createAnnouncement = async (req, res) => {
    try {
        console.log("req.body:", req.body);
        console.log("req.file:", req.file);
        const { title, content, priority, publishDate, expiryDate, isPinned, isDraft, sendNotification } = req.body;

        const image = req.file ? req.file.path : null;

        const announcement = await Announcement.create({
            title,
            content,
            priority,
            publishDate,
            expiryDate,
            isPinned,
            isDraft,
            image,
            createdBy: req.user?.id || "admin"
        });

        res.status(201).json({
            message: "Announcement created successfully",
            data: announcement
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Single Announcement
export const getAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;

        const announcement = await Announcement.findById(id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }
        
        res.status(200).json({
            success: true,
            data: announcement
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get All Announcements
export const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: announcements.length,
            data: announcements
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update Announcement
export const updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;

        const updateData = { ...req.body };

        if (req.file) {
            updateData.image = req.file.path;
        }

        const updated = await Announcement.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true });

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: "Announcement not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Announcement updated successfully",
                data: updated
            });
            
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Delete Announcement
export const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;

        const announcement = await Announcement.findById(id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }

        // delete image from Cloudinary
        if (announcement.image) {
            const publicId = announcement.image.split("/").pop().split(".")[0];

            await cloudinary.uploader.destroy(`announcements/${publicId}`);
        }

        await Announcement.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Announcement deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Pin Announcement
export const pinAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;

        // Unpin all other announcements
        await Announcement.updateMany({ isPinned: true }, { isPinned: false });

        const pinned = await Announcement.findByIdAndUpdate(
            id, 
            { isPinned: true }, 
            { new: true }
        );

        if (!pinned) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Announcement pinned successfully",
            data: pinned
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Publish Announcement
export const publishAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await Announcement.findByIdAndUpdate(
            id, 
            { isDraft: false }, 
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Announcement published successfully",
            data: updated
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Filter Announcements
export const filterAnnouncements = async (req, res) => {
    try {
        const { priority, isPinned, isDraft } = req.query;

        let filter = {};

        if (priority) filter.priority = priority;
        if (isPinned) filter.isPinned = isPinned === 'true';
        if (isDraft) filter.isDraft = isDraft === 'true';

        const announcements = await Announcement.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: announcements.length,
            data: announcements
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get Active Announcements
export const getActiveAnnouncements = async (req, res) => {
    try {
        const today = new Date();

        const announcements = await Announcement.find({
            isDraft: false,
            publishDate: { $lte: today },
            $or: [
                { expiryDate: { $gte: today } },
                { expiryDate: null }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: announcements.length,
            data: announcements
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};