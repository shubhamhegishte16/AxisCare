import express from "express";
import { protect, authorizeRole } from "../../middleware/authMiddleware.js";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../controllers/admin/notificationController.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRole("admin"));

router.get("/", getNotifications);
router.put("/read-all", markAllNotificationsRead);
router.put("/:id/read", markNotificationRead);

export default router;
