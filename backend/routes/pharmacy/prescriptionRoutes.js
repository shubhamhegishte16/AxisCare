import express from "express";
import { protect, authorizeRole } from "../../middleware/authMiddleware.js";
import {
  getPharmacyPrescriptions,
  getPharmacyPrescriptionStats,
  getPharmacyPrescriptionById,
  updatePharmacyStatus,
} from "../../controllers/pharmacy/prescriptionController.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRole("pharmacist"));

router.get("/stats", getPharmacyPrescriptionStats);

router.get("/", getPharmacyPrescriptions);

router.get("/:id", getPharmacyPrescriptionById);
router.put("/:id/status", updatePharmacyStatus);

export default router;