import User from "../../models/user.js";
import bcrypt from "bcryptjs";

const shapeUser = (u) => ({
  id: `USR-${String(u._id).slice(-6).toUpperCase()}`,
  _id: u._id,
  name: u.fullName,
  email: u.email,
  phone: u.phone,
  role: u.role,
  department: u.department || "-",
  status: u.isActive ? "Active" : "Inactive",
  joined: new Date(u.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
});

// @desc    Get all users (search + role filter)
// @route   GET /api/admin/users
export const getUsers = async (req, res) => {
  try {
    const { search, role } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }
    if (role && role !== "All") {
      filter.role = role;
    }

    const users = await User.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users.map(shapeUser) });
  } catch (error) {
    console.error("Error in getUsers:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get user stats
// @route   GET /api/admin/users/stats
export const getUserStats = async (req, res) => {
  try {
    const [total, active, inactive, doctors] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
      User.countDocuments({ role: "doctor" }),
    ]);
    res.status(200).json({ success: true, data: { total, active, inactive, doctors } });
  } catch (error) {
    console.error("Error in getUserStats:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get single user by id
// @route   GET /api/admin/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: shapeUser(user) });
  } catch (error) {
    console.error("Error in getUserById:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Create a new user (any role) as admin
// @route   POST /api/admin/users
export const createUser = async (req, res) => {
  try {
    const { name, email, phone, role, department, password } = req.body;

    if (!name || !email || !phone || !role) {
      return res.status(400).json({ success: false, message: "Name, email, phone, and role are required" });
    }

    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(400).json({ success: false, message: "A user with this email or phone already exists" });
    }

    // Admin-created accounts get a temporary password the user should reset on first login.
    const tempPassword = password || Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await User.create({
      fullName: name,
      email,
      phone,
      role,
      department: department || "",
      password: hashedPassword,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: shapeUser(user),
      // Returned once so the admin can share it — never stored or shown again.
      temporaryPassword: password ? undefined : tempPassword,
    });
  } catch (error) {
    console.error("Error in createUser:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update a user's details/role/department
// @route   PUT /api/admin/users/:id
export const updateUser = async (req, res) => {
  try {
    const { name, email, phone, role, department } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name !== undefined) user.fullName = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (role !== undefined) user.role = role;
    if (department !== undefined) user.department = department;

    await user.save();

    res.status(200).json({ success: true, message: "User updated successfully", data: shapeUser(user) });
  } catch (error) {
    console.error("Error in updateUser:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Toggle a user's active/inactive status
// @route   PUT /api/admin/users/:id/status
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({ success: true, message: "User status updated", data: shapeUser(user) });
  } catch (error) {
    console.error("Error in toggleUserStatus:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (String(user._id) === String(req.user._id)) {
      return res.status(400).json({ success: false, message: "You cannot delete your own account" });
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
