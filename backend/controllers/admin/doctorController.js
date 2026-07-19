import User from "../../models/user.js";
import DoctorProfile from "../../models/doctorProfile.js";
import Appointment from "../../models/Appointment.js";
import bcrypt from "bcryptjs";

// NOTE: duty status (On Duty / Off Duty / On Leave) and rating aren't tracked
// anywhere in the current schema. Duty status defaults to "On Duty" and rating
// is returned as null until those fields/features exist. Patient count is
// computed as the number of distinct patients with an appointment referencing
// this doctor's profile.
const shapeDoctor = async (user, profile) => {
  const patientCount = profile
    ? (await Appointment.distinct("patientId", { doctorProfileId: profile._id })).length
    : 0;

  return {
    id: `DOC-${String(user._id).slice(-6).toUpperCase()}`,
    _id: user._id,
    profileId: profile?._id || null,
    name: user.fullName,
    email: user.email,
    phone: user.phone,
    specialization: profile?.specialization || "-",
    department: profile?.department || user.department || "-",
    experience: profile?.experience || "-",
    status: user.isActive ? "On Duty" : "Off Duty",
    patients: patientCount,
    rating: null,
  };
};

// @desc    Get all doctors (search by name/specialization/department)
// @route   GET /api/admin/doctors
export const getDoctors = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = { role: "doctor" };

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ];
    }

    const doctorUsers = await User.find(filter).sort({ createdAt: -1 });
    const profiles = await DoctorProfile.find({ user: { $in: doctorUsers.map((d) => d._id) } });
    const profileByUser = new Map(profiles.map((p) => [String(p.user), p]));

    const data = await Promise.all(
      doctorUsers.map((u) => shapeDoctor(u, profileByUser.get(String(u._id))))
    );

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error("Error in getDoctors:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get doctor stats
// @route   GET /api/admin/doctors/stats
export const getDoctorStats = async (req, res) => {
  try {
    const [total, active, inactive] = await Promise.all([
      User.countDocuments({ role: "doctor" }),
      User.countDocuments({ role: "doctor", isActive: true }),
      User.countDocuments({ role: "doctor", isActive: false }),
    ]);
    res.status(200).json({
      success: true,
      data: { total, onDuty: active, onLeave: inactive },
    });
  } catch (error) {
    console.error("Error in getDoctorStats:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get single doctor's full details
// @route   GET /api/admin/doctors/:id
export const getDoctorById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: "doctor" });
    if (!user) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    const profile = await DoctorProfile.findOne({ user: user._id });
    res.status(200).json({ success: true, data: await shapeDoctor(user, profile) });
  } catch (error) {
    console.error("Error in getDoctorById:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Add a new doctor (creates User + DoctorProfile)
// @route   POST /api/admin/doctors
export const createDoctor = async (req, res) => {
  try {
    const { name, email, phone, specialization, department, experience, password } = req.body;

    if (!name || !email || !phone || !specialization || !department) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone, specialization, and department are required",
      });
    }

    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(400).json({ success: false, message: "A user with this email or phone already exists" });
    }

    const tempPassword = password || Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await User.create({
      fullName: name,
      email,
      phone,
      role: "doctor",
      department,
      password: hashedPassword,
      isActive: true,
    });

    const profile = await DoctorProfile.create({
      user: user._id,
      specialization,
      department,
      experience: experience || "",
    });

    res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      data: await shapeDoctor(user, profile),
      temporaryPassword: password ? undefined : tempPassword,
    });
  } catch (error) {
    console.error("Error in createDoctor:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update a doctor's profile details
// @route   PUT /api/admin/doctors/:id
export const updateDoctor = async (req, res) => {
  try {
    const { name, specialization, department, experience } = req.body;

    const user = await User.findOne({ _id: req.params.id, role: "doctor" });
    if (!user) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    if (name !== undefined) user.fullName = name;
    if (department !== undefined) user.department = department;
    await user.save();

    let profile = await DoctorProfile.findOne({ user: user._id });
    if (!profile) {
      profile = new DoctorProfile({ user: user._id });
    }
    if (specialization !== undefined) profile.specialization = specialization;
    if (department !== undefined) profile.department = department;
    if (experience !== undefined) profile.experience = experience;
    await profile.save();

    res.status(200).json({ success: true, message: "Doctor updated successfully", data: await shapeDoctor(user, profile) });
  } catch (error) {
    console.error("Error in updateDoctor:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Remove a doctor (deactivates the User; does not hard-delete history)
// @route   DELETE /api/admin/doctors/:id
export const removeDoctor = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: "doctor" });
    if (!user) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Soft-delete: deactivate rather than hard-delete, so existing appointments
    // and prescriptions tied to this doctor remain valid historical records.
    user.isActive = false;
    await user.save();

    res.status(200).json({ success: true, message: "Doctor deactivated successfully" });
  } catch (error) {
    console.error("Error in removeDoctor:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
