import express from "express";
import { protect, authorizeRole } from "../../middleware/authMiddleware.js";
import { getMonthlyRevenue, getBillingStats } from "../../controllers/admin/billingController.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRole("admin"));

router.get("/revenue", getMonthlyRevenue);
router.get("/stats", getBillingStats);

export default router;
