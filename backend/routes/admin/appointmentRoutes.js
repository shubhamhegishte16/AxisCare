import express from "express";
import { protect, authorizeRole } from "../../middleware/authMiddleware.js";
import {
  getAppointments,
  getAppointmentStats,
  getAppointmentsByDepartment,
  getAppointmentById,
} from "../../controllers/admin/appointmentController.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRole("admin"));

router.get("/stats", getAppointmentStats);
router.get("/by-department", getAppointmentsByDepartment);
router.get("/", getAppointments);
router.get("/:id", getAppointmentById);

export default router;
