import express from "express";
import { createBillingItem, getBillingItems, removeBillingItem } from './../controllers/itemsController.js';
import { isReceptionist } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-billing", isReceptionist, createBillingItem);
router.delete("/remove-billing/:itemId", isReceptionist, removeBillingItem);
router.get("/billing-items", isReceptionist, getBillingItems);

export default router;