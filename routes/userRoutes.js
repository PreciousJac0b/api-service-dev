import express from "express";
import protect from "../middleware/auth.js";
import { getUserProfile, updateUserProfile } from "../controllers/userController.js";
import { validateProfileUpdate } from "../validators/userValidator.js";

const router = express.Router();

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, validateProfileUpdate, updateUserProfile); 


export default router;