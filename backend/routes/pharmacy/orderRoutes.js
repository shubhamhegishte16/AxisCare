import express from "express";
import { protect, authorizeRole } from "../../middleware/authMiddleware.js";
import {
  getOrders,
  getOrderStats,
  getOrderById,
  createOrder,
  updateOrderStatus,
} from "../../controllers/pharmacy/orderController.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRole("pharmacist"));

router.get("/stats", getOrderStats);

router.route("/").get(getOrders).post(createOrder);

router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);

export default router;