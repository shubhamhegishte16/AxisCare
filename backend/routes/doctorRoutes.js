import express from "express";
import { protect, authorizeRole } from "../middleware/authMiddleware.js";
import {
  getDoctorProfile,
  updateDoctorProfile,
  uploadAvatar,
  changePassword,
} from "../controllers/doctorController.js";
import upload from "../utils/upload.js";

const router = express.Router();

// Apply middleware to all routes in this file
router.use(protect);
router.use(authorizeRole("doctor"));

router
  .route("/profile")
  .get(getDoctorProfile)
  .put(updateDoctorProfile);

router.post("/upload-avatar", upload.single("avatar"), uploadAvatar);

router.put("/change-password", changePassword);

export default router;
