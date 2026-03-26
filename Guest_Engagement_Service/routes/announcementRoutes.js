import express from 'express';
import upload from '../middleware/upload.js';
import { requiredSignIn, isAdmin } from '../middleware/authMiddleware.js';
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

// Create Announcement - Admin only
router.post("/", requiredSignIn, isAdmin, upload.single('image'), createAnnouncement);

// Filter Announcements - Public
router.get("/filter", filterAnnouncements);

// Get Single Announcement - Public
router.get("/active", getActiveAnnouncements);

// Get Single Announcement - Public
router.get("/:id", getAnnouncement);
// Get All Announcements - Public
router.get("/", getAllAnnouncements);

// Update Announcement - Admin only
router.put("/:id", requiredSignIn, isAdmin, upload.single('image'), updateAnnouncement);

// Delete Announcement - Admin only
router.delete("/:id", requiredSignIn, isAdmin, deleteAnnouncement);

// Pin Announcement - Admin only
router.put("/pin/:id", requiredSignIn, isAdmin, pinAnnouncement);

// Publish Announcement - Admin only
router.put("/publish/:id", requiredSignIn, isAdmin, publishAnnouncement);

export default router;