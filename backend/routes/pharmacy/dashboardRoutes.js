import express from "express";
import { protect, authorizeRole } from "../../middleware/authMiddleware.js";
import { getDashboardData } from "../../controllers/pharmacy/dashboardController.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRole("pharmacist"));

router.get("/", getDashboardData);

export default router;