import DoctorProfile from "../models/doctorProfile.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

// @desc    Get doctor profile
// @route   GET /api/doctor/profile
// @access  Private/Doctor
export const getDoctorProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let profile = await DoctorProfile.findOne({ user: req.user._id });

    // If profile doesn't exist, return empty template
    if (!profile) {
      profile = await DoctorProfile.create({ user: req.user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        ...profile._doc,
        user: {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    console.error("Error in getDoctorProfile:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctor/profile
// @access  Private/Doctor
export const updateDoctorProfile = async (req, res) => {
  try {
    const {
      fullName, email, phone, avatar, _id, user: userField, createdAt, updatedAt, __v,
      ...profileData
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update User model fields
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    await user.save();

    // Update DoctorProfile fields
    let profile = await DoctorProfile.findOne({ user: req.user._id });
    
    if (profile) {
      // Update existing profile
      Object.assign(profile, profileData);
      await profile.save();
    } else {
      // Create new profile (should ideally not happen due to get route creating it)
      profile = await DoctorProfile.create({ user: req.user._id, ...profileData });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        ...profile._doc,
        user: {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    console.error("Error in updateDoctorProfile:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Upload avatar
// @route   POST /api/doctor/upload-avatar
// @access  Private/Doctor
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Save the file path in user's avatar field
    user.avatar = `/${req.file.path.replace(/\\/g, "/")}`; // Normalize windows paths
    await user.save();

    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Error in uploadAvatar:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Change Password
// @route   PUT /api/doctor/change-password
// @access  Private/Doctor
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Please provide both current and new password" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect current password" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error in changePassword:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
