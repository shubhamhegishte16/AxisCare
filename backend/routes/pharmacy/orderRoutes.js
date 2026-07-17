import express from "express";
import { protect, authorizeRole } from "../../middleware/authMiddleware.js";
import {
  getOrders,
  getOrderStats,
  getOrderById,
  createOrder,
  updateOrderStatus,
  createOrderFromPrescription,
  getPatientOrders
} from "../../controllers/pharmacy/orderController.js";

const router = express.Router();

router.use(protect);

// Routes accessible by patients (for creating orders)
router.post("/patient/create", createOrderFromPrescription);
router.get("/patient/orders", getPatientOrders);

router.use(authorizeRole("pharmacist", "patient"));

router.get("/stats", getOrderStats);

router.route("/").get(getOrders).post(createOrder);

router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);

export default router;