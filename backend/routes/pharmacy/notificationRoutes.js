import express from "express";
import { protect, authorizeRole } from "../../middleware/authMiddleware.js";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../controllers/pharmacy/notificationController.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRole("pharmacist"));

router.get("/", getNotifications);
router.put("/mark-all-read", markAllNotificationsRead);
router.put("/:id/read", markNotificationRead);

export default router;