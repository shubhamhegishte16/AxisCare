import express from "express";
import { protect, authorizeRole } from "../../middleware/authMiddleware.js";
import {
  getUsers,
  getUserStats,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
} from "../../controllers/admin/userController.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRole("admin"));

router.get("/stats", getUserStats);

router.route("/").get(getUsers).post(createUser);

router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);
router.put("/:id/status", toggleUserStatus);

export default router;
