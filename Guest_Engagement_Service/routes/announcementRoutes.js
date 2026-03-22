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
import { isAdmin, requiredSignIn } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create Announcement
router.post("/", requiredSignIn, isAdmin, upload.single('image'), createAnnouncement);

// Filter Announcements
router.get("/filter", filterAnnouncements);

// Get Single Announcement
router.get("/active", getActiveAnnouncements);

// Get Single Announcement
router.get("/:id", getAnnouncement);
// Get All Announcements
router.get("/", getAllAnnouncements);

// Update Announcement
router.put("/:id", requiredSignIn, isAdmin, upload.single('image'), updateAnnouncement);

// Delete Announcement
router.delete("/:id", requiredSignIn, isAdmin, deleteAnnouncement);

// Pin Announcement
router.put("/pin/:id", requiredSignIn, isAdmin, pinAnnouncement);

// Publish Announcement
router.put("/publish/:id", requiredSignIn, isAdmin, publishAnnouncement);

export default router;