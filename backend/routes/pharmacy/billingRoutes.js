import express from "express";
import { protect, authorizeRole } from "../../middleware/authMiddleware.js";
import {
  getBills,
  getBillingStats,
  getBillById,
  createBill,
  markBillPaid,
} from "../../controllers/pharmacy/billingController.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRole("pharmacist"));

router.get("/stats", getBillingStats);

router.route("/").get(getBills).post(createBill);

router.get("/:id", getBillById);
router.put("/:id/mark-paid", markBillPaid);

export default router;