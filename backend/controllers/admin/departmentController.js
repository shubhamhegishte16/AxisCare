import Department from "../../models/AdminPanel/Department.js";
import User from "../../models/user.js";

const shapeDepartment = async (dept) => {
  const [doctors, staff] = await Promise.all([
    User.countDocuments({ role: "doctor", department: dept.name }),
    User.countDocuments({
      department: dept.name,
      role: { $in: ["receptionist", "laboratory", "pharmacist"] },
    }),
  ]);

  return {
    id: `DEP-${String(dept._id).slice(-6).toUpperCase()}`,
    _id: dept._id,
    name: dept.name,
    head: dept.head,
    doctors,
    staff,
    status: dept.status,
  };
};

// @desc    Get all departments
// @route   GET /api/admin/departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    const data = await Promise.all(departments.map(shapeDepartment));
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error("Error in getDepartments:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get department stats
// @route   GET /api/admin/departments/stats
export const getDepartmentStats = async (req, res) => {
  try {
    const [total, active, totalDoctors] = await Promise.all([
      Department.countDocuments(),
      Department.countDocuments({ status: "Active" }),
      User.countDocuments({ role: "doctor" }),
    ]);
    res.status(200).json({ success: true, data: { total, active, totalDoctors } });
  } catch (error) {
    console.error("Error in getDepartmentStats:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Create a new department
// @route   POST /api/admin/departments
export const createDepartment = async (req, res) => {
  try {
    const { name, head } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Department name is required" });
    }

    const existing = await Department.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, message: "A department with this name already exists" });
    }

    const department = await Department.create({
      name,
      head: head || "Unassigned",
      status: "Active",
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, message: "Department created successfully", data: await shapeDepartment(department) });
  } catch (error) {
    console.error("Error in createDepartment:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update a department
// @route   PUT /api/admin/departments/:id
export const updateDepartment = async (req, res) => {
  try {
    const { name, head, status } = req.body;

    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    if (name !== undefined) department.name = name;
    if (head !== undefined) department.head = head;
    if (status !== undefined) department.status = status;

    await department.save();

    res.status(200).json({ success: true, message: "Department updated successfully", data: await shapeDepartment(department) });
  } catch (error) {
    console.error("Error in updateDepartment:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Delete a department
// @route   DELETE /api/admin/departments/:id
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    await department.deleteOne();
    res.status(200).json({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error in deleteDepartment:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
