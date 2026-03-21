import express from "express";
import { getUserDetails, login, logout, register, updateUserDetails, } from "../controllers/authController.js";
import { createDiskUploader } from "../middlewares/uploadMiddleware.js";
import path from "path";
import { requiredSignIn } from "../middlewares/authMiddelware.js";

const router = express.Router();

const upload = createDiskUploader({
  getDestination: () => path.join(process.cwd(), "user_photos"),
});

router.post("/register", upload.single("photo"), register);
router.post("/login", login);
router.get("/get-user-details", getUserDetails);
router.patch("/update-profile", requiredSignIn, upload.single("photo"), updateUserDetails);
router.post("/logout", requiredSignIn, logout);

export default router;