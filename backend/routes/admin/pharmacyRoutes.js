import express from "express";
import { protect, authorizeRole } from "../../middleware/authMiddleware.js";
import { getPharmacyOverview } from "../../controllers/admin/pharmacyOverviewController.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRole("admin"));

router.get("/overview", getPharmacyOverview);

export default router;
