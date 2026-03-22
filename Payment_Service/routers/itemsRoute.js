import express from "express";
import { createBillingItem, getBillingItems, removeBillingItem } from './../controllers/itemsController.js';
import { isReceptionist, requiredSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-billing", requiredSignIn, isReceptionist, createBillingItem);
router.delete("/remove-billing/:itemId", requiredSignIn, isReceptionist, removeBillingItem);
router.get("/billing-items", requiredSignIn, isReceptionist, getBillingItems);

export default router;