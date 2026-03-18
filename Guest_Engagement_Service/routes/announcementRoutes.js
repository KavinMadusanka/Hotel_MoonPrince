import express from 'express';
import upload from '../middleware/upload.js';
import { createAnnouncement } from '../controllers/announcementController.js';

const router = express.Router();

// Create Announcement
router.post("/", upload.single('image'), createAnnouncement);

export default router;