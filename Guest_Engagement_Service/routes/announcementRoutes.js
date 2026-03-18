import express from 'express';
import upload from '../middleware/upload.js';
import { createAnnouncement, 
    getAnnouncement, 
    getAllAnnouncements,
    updateAnnouncement,
    deleteAnnouncement, 
    pinAnnouncement,
    publishAnnouncement,
    filterAnnouncements,
    getActiveAnnouncements} from '../controllers/announcementController.js';

const router = express.Router();

// Create Announcement
router.post("/", upload.single('image'), createAnnouncement);

// Filter Announcements
router.get("/filter", filterAnnouncements);

// Get Single Announcement
router.get("/active", getActiveAnnouncements);

// Get Single Announcement
router.get("/:id", getAnnouncement);
// Get All Announcements
router.get("/", getAllAnnouncements);

// Update Announcement
router.put("/:id", upload.single('image'), updateAnnouncement);

// Delete Announcement
router.delete("/:id", deleteAnnouncement);

// Pin Announcement
router.put("/pin/:id", pinAnnouncement);

// Publish Announcement
router.put("/publish/:id", publishAnnouncement);

export default router;