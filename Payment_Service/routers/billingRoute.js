import express from "express";
import { addBillingItem, createBilling, getBillingDetails, removeBillingItem } from "../controllers/billingController.js";
import { isReceptionist, requiredSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", requiredSignIn, isReceptionist, createBilling);
router.delete("/remove-item/:billingId/:itemId", requiredSignIn, isReceptionist, removeBillingItem);
router.patch("/addNewItem/:billingId", requiredSignIn, isReceptionist, addBillingItem);
router.get("/get-billing/:userId/:roomId", requiredSignIn, isReceptionist, getBillingDetails);

export default router;