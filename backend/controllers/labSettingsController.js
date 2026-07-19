import bcrypt from "bcryptjs";
import LabProfile from "../models/LabProfile.js";
import User from "../models/user.js";

const profileDefaults = (userId) => ({
  user: userId,
  empId: `LAB-${String(userId).slice(-6).toUpperCase()}`,
});

const getOrCreateProfile = async (userId) => {
  let profile = await LabProfile.findOne({ user: userId });
  if (!profile) profile = await LabProfile.create(profileDefaults(userId));
  return profile;
};

const formatSettings = (user, profile) => ({
  ...profile.toObject(),
  user: {
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    department: user.department,
    role: user.role,
  },
});

export const getLabSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const profile = await getOrCreateProfile(req.user._id);
    res.status(200).json({ success: true, data: formatSettings(user, profile) });
  } catch (error) {
    console.error("Error in getLabSettings:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateLabProfile = async (req, res) => {
  try {
    const { fullName, email, phone, empId, designation, department } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (email && email !== user.email) {
      const exists = await User.findOne({ email, _id: { $ne: user._id } });
      if (exists) return res.status(400).json({ success: false, message: "Email is already in use" });
      user.email = email;
    }
    if (phone && phone !== user.phone) {
      const exists = await User.findOne({ phone, _id: { $ne: user._id } });
      if (exists) return res.status(400).json({ success: false, message: "Phone number is already in use" });
      user.phone = phone;
    }
    if (fullName) user.fullName = fullName;
    if (department) user.department = department;
    await user.save();

    const profile = await getOrCreateProfile(req.user._id);
    if (empId) profile.empId = empId;
    if (designation) profile.designation = designation;
    if (department) profile.department = department;
    await profile.save();

    res.status(200).json({
      success: true,
      message: "Lab profile updated successfully",
      data: formatSettings(user, profile),
    });
  } catch (error) {
    console.error("Error in updateLabProfile:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateLabNotifications = async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    const allowed = [
      "emailNewRequests",
      "emailResultUpdates",
      "emailSystemAlerts",
      "appNewRequests",
      "appResultUpdates",
      "appSystemAlerts",
    ];

    allowed.forEach((key) => {
      if (typeof req.body[key] === "boolean") profile.notifications[key] = req.body[key];
    });
    await profile.save();

    res.status(200).json({
      success: true,
      message: "Notification preferences updated successfully",
      data: profile.notifications,
    });
  } catch (error) {
    console.error("Error in updateLabNotifications:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateLabPreferences = async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    const allowed = [
      "defaultSampleType",
      "defaultPriority",
      "resultsAutoApprove",
      "workingTimeStart",
      "workingTimeEnd",
    ];

    allowed.forEach((key) => {
      if (req.body[key] !== undefined) profile.preferences[key] = req.body[key];
    });
    await profile.save();

    res.status(200).json({
      success: true,
      message: "Lab preferences updated successfully",
      data: profile.preferences,
    });
  } catch (error) {
    console.error("Error in updateLabPreferences:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const uploadLabAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.avatar = `/${req.file.path.replace(/\\/g, "/")}`;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Error in uploadLabAvatar:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const changeLabPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Please provide current and new password" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Incorrect current password" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Error in changeLabPassword:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
