import Announcement from "../models/Announcement.js";

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