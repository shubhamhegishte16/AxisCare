import express from "express";
import { protect, authorizeRole } from "../../middleware/authMiddleware.js";
import { getReportsData } from "../../controllers/pharmacy/reportsController.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRole("pharmacist"));

router.get("/", getReportsData);

export default router;