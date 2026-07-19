import express from "express";
import { protect, authorizeRole } from "../../middleware/authMiddleware.js";
import { getReports } from "../../controllers/admin/reportsController.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRole("admin"));

router.get("/", getReports);

export default router;
