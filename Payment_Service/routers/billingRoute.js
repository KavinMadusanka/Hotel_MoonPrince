import express from "express";
import { addBillingItem, createBilling, getBillingDetails, getUserBill, removeBillingItem, updateBillingStatus } from "../controllers/billingController.js";
import { isReceptionist, isUser, requiredSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", requiredSignIn, createBilling);
router.delete("/remove-item/:billingId/:itemId", requiredSignIn, isReceptionist, removeBillingItem);
router.patch("/addNewItem/:billingId", requiredSignIn, isReceptionist, addBillingItem);
router.get("/get-billing/:userId/:roomId", requiredSignIn, isReceptionist, getBillingDetails);
router.get("/get-bill", requiredSignIn, isUser, getUserBill);


// update payment status: pending -> paid (receptionist only)
router.patch("/update-status/:billingId", requiredSignIn, isReceptionist, updateBillingStatus);

export default router;