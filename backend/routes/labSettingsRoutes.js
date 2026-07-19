import express from "express";
import {
  changeLabPassword,
  getLabSettings,
  updateLabNotifications,
  updateLabPreferences,
  updateLabProfile,
  uploadLabAvatar,
} from "../controllers/labSettingsController.js";
import { authorizeRole, protect } from "../middleware/authMiddleware.js";
import upload from "../utils/upload.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRole("lab", "laboratory"));

router.get("/", getLabSettings);
router.put("/profile", updateLabProfile);
router.put("/notifications", updateLabNotifications);
router.put("/preferences", updateLabPreferences);
router.post("/upload-avatar", upload.single("avatar"), uploadLabAvatar);
router.put("/change-password", changeLabPassword);

export default router;
