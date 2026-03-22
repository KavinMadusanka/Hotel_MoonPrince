import express from "express";
import { addBillingItem, createBilling, getBillingDetails, getUserBill, removeBillingItem } from "../controllers/billingController.js";
import { isReceptionist, isUser, requiredSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", requiredSignIn, createBilling);
router.delete("/remove-item/:billingId/:itemId", requiredSignIn, isReceptionist, removeBillingItem);
router.patch("/addNewItem/:billingId", requiredSignIn, isReceptionist, addBillingItem);
router.get("/get-billing/:userId/:roomId", requiredSignIn, isReceptionist, getBillingDetails);
router.get("/get-bill", requiredSignIn, isUser, getUserBill);

export default router;