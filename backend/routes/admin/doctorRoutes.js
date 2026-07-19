import express from "express";
import { protect, authorizeRole } from "../../middleware/authMiddleware.js";
import {
  getDoctors,
  getDoctorStats,
  getDoctorById,
  createDoctor,
  updateDoctor,
  removeDoctor,
} from "../../controllers/admin/doctorController.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRole("admin"));

router.get("/stats", getDoctorStats);

router.route("/").get(getDoctors).post(createDoctor);

router.route("/:id").get(getDoctorById).put(updateDoctor).delete(removeDoctor);

export default router;
