import express from "express";
import { protect, authorizeRole } from "../../middleware/authMiddleware.js";
import {
  getDepartments,
  getDepartmentStats,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../controllers/admin/departmentController.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRole("admin"));

router.get("/stats", getDepartmentStats);

router.route("/").get(getDepartments).post(createDepartment);

router.route("/:id").put(updateDepartment).delete(deleteDepartment);

export default router;
