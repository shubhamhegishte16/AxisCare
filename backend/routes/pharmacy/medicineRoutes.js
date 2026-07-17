import express from "express";
import { protect, authorizeRole } from "../../middleware/authMiddleware.js";
import {
  getMedicines,
  getMedicineStats,
  getInventoryStats,
  getMedicineById,
  createMedicine,
  updateMedicine,
  adjustStock,
  deleteMedicine,
} from "../../controllers/pharmacy/medicineController.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRole("pharmacist"));

router.get("/stats", getMedicineStats);
router.get("/inventory-stats", getInventoryStats);

router.route("/").get(getMedicines).post(createMedicine);

router
  .route("/:id")
  .get(getMedicineById)
  .put(updateMedicine)
  .delete(deleteMedicine);

router.put("/:id/adjust-stock", adjustStock);

export default router;