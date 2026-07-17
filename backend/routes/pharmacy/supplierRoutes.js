import express from "express";
import { protect, authorizeRole } from "../../middleware/authMiddleware.js";
import {
  getSuppliers,
  getSupplierStats,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../controllers/pharmacy/supplierController.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRole("pharmacist"));

router.get("/stats", getSupplierStats);

router.route("/").get(getSuppliers).post(createSupplier);

router
  .route("/:id")
  .get(getSupplierById)
  .put(updateSupplier)
  .delete(deleteSupplier);

export default router;