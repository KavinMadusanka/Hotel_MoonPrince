import express from 'express';
import upload from '../middleware/upload.js';
import { createAnnouncement, getAnnouncement } from '../controllers/announcementController.js';

const router = express.Router();

// Create Announcement
router.post("/", upload.single('image'), createAnnouncement);
// Get Single Announcement
router.get("/:id", getAnnouncement);

export default router;