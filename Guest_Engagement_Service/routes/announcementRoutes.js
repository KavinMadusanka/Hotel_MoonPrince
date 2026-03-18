import express from 'express';
import upload from '../middleware/upload.js';
import { createAnnouncement, 
    getAnnouncement, 
    getAllAnnouncements,
    updateAnnouncement,
    deleteAnnouncement } from '../controllers/announcementController.js';

const router = express.Router();

// Create Announcement
router.post("/", upload.single('image'), createAnnouncement);

// Get Single Announcement
router.get("/:id", getAnnouncement);
// Get All Announcements
router.get("/", getAllAnnouncements);

// Update Announcement
router.put("/:id", upload.single('image'), updateAnnouncement);

// Delete Announcement
router.delete("/:id", deleteAnnouncement);

export default router;