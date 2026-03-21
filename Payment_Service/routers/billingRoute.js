import express from "express";
import { addBillingItem, createBilling, getBillingDetails, removeBillingItem } from "../controllers/billingController.js";
import { isReceptionist } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", isReceptionist, createBilling);
router.delete("/remove-item/:billingId/:itemId", isReceptionist, removeBillingItem);
router.patch("/addNewItem/:billingId", isReceptionist, addBillingItem);
router.get("/get-billing/:userId/:roomId", isReceptionist, getBillingDetails);

export default router;