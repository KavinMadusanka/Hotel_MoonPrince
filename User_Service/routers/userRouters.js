import express from "express";
import { getUserDetails, login, register, updateUserDetails } from "../controllers/authController.js";
import { createDiskUploader } from "../middlewares/uploadMiddleware.js";
import path from "path";
import { requiredSignIn } from "../middlewares/authMiddelware.js";

const router = express.Router();

const upload = createDiskUploader({
  getDestination: () => path.join(process.cwd(), "user_photos"),
});

router.post("/register", upload.single("photo"), register);
router.post("/login", login);
router.get("/get-user-details", requiredSignIn, getUserDetails);
router.patch("/update-profile", requiredSignIn, upload.single("photo"), updateUserDetails);

export default router;;