import express from "express";
import { getUserDetails, getUserDetailsById, login, logout, register, updateUserDetails, } from "../controllers/authController.js";
import { createDiskUploader } from "../middlewares/uploadMiddleware.js";
import path from "path";
import { isReceptionist, requiredSignIn } from "../middlewares/authMiddelware.js";

const router = express.Router();

const upload = createDiskUploader({
  getDestination: () => path.join(process.cwd(), "user_photos"),
});

router.post("/register", upload.single("photo"), register);
router.post("/login", login);
router.get("/get-user-details", requiredSignIn, getUserDetails);
router.get("/get-details/:id", requiredSignIn, isReceptionist, getUserDetailsById);
router.patch("/update-profile", requiredSignIn, upload.single("photo"), updateUserDetails);
router.post("/logout", requiredSignIn, logout);

export default router;