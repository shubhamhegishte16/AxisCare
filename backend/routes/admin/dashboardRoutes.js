import express from "express";
import { protect, authorizeRole } from "../../middleware/authMiddleware.js";
import { getDashboard } from "../../controllers/admin/dashboardController.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRole("admin"));

router.get("/", getDashboard);

export default router;
