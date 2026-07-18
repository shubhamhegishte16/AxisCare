import express from "express";
import { protect, authorizeRole } from "../../middleware/authMiddleware.js";
import {
  getOrders,
  getOrderStats,
  getOrderById,
  createOrder,
  updateOrderStatus,
  createOrderFromPrescription,
  getPatientOrders,
  checkMedicineAvailability,
  getDashboard
} from "../../controllers/pharmacy/orderController.js";

const router = express.Router();

router.use(protect);

// Routes accessible by patients (for creating orders) for patient panel
router.post("/patient/check-availability", checkMedicineAvailability);
router.post("/patient/create", createOrderFromPrescription);
router.get("/patient/orders", getPatientOrders);

router.use(authorizeRole("pharmacist", "patient"));

router.get("/dashboard", getDashboard);
router.get("/stats", getOrderStats);

router.get("/orders", getOrders);
router.post("/orders", createOrder);
router.put("/orders/:id/status", updateOrderStatus);

router.route("/").get(getOrders).post(createOrder);


router.put("/:id/status", updateOrderStatus);
router.get("/:id", getOrderById);

export default router;