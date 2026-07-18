import express from "express";
import { protect, authorizeRole } from "../middleware/authMiddleware.js";
import {
  getDoctorProfile,
  updateDoctorProfile,
  uploadAvatar,
  changePassword,
  getDashboardData,
  getMyPatients,
} from "../controllers/doctorController.js";
import { getMyNotifications, markAsRead, markAllAsRead, deleteNotification } from '../controllers/DoctorNotificationController.js';
import { createReport, getReports, getReportById, updateReportStatus, updateReport, deleteReport } from '../controllers/reportController.js';
import upload from "../utils/upload.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRole("doctor"));

router.get("/dashboard", getDashboardData);
router.get("/patients", getMyPatients);

router
  .route("/profile")
  .get(getDoctorProfile)
  .put(updateDoctorProfile);

router.post("/upload-avatar", upload.single("avatar"), uploadAvatar);

router.put("/change-password", changePassword);

// Notifications
router.get("/notifications", getMyNotifications);
router.put("/notifications/read-all", markAllAsRead);
router.put("/notifications/:id/read", markAsRead);
router.delete("/notifications/:id", deleteNotification);

// Reports
router.post("/reports", createReport);
router.get("/reports", getReports);
router.get("/reports/:id", getReportById);
router.put("/reports/:id/status", updateReportStatus);
router.put("/reports/:id", updateReport);
router.delete("/reports/:id", deleteReport);

export default router;
