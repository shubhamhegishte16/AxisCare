import express from "express";
import { protect, authorizeRole } from "../../middleware/authMiddleware.js";
import { getPatients, getPatientStats, getPatientById } from "../../controllers/admin/patientController.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRole("admin"));

router.get("/stats", getPatientStats);
router.get("/", getPatients);
router.get("/:id", getPatientById);

export default router;
