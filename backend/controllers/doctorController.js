import DoctorProfile from "../models/doctorProfile.js";
import User from "../models/user.js";
import Appointment from "../models/Appointment.js";
import Prescription from "../models/Prescription.js";
import LabAppointment from "../models/LabAppointment.js";
import bcrypt from "bcryptjs";
import { triggerDoctorNotification } from "../utils/triggerDoctorNotification.js";

export const getDoctorLabReports = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const user = await User.findById(doctorId);
    
    const labReports = await LabAppointment.find({
      $or: [
        { referringDoctorId: doctorId },
        { referringDoctor: { $regex: user.fullName, $options: 'i' } },
        { referringDoctor: { $regex: user.fullName.split(' ').pop(), $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: labReports });
  } catch (error) {
    console.error('Error fetching lab reports:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMyPatients = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const user = await User.findById(doctorId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const doctorProfile = await DoctorProfile.findOne({ user: doctorId });

    const doctorNameParts = user.fullName.split(' ');
    const lastName = doctorNameParts[doctorNameParts.length - 1];

    const matchConditions = [];
    if (doctorProfile) matchConditions.push({ doctorProfileId: doctorProfile._id });
    matchConditions.push({ doctor: new RegExp(lastName, 'i') });
    matchConditions.push({ doctor: new RegExp(user.fullName.replace('Dr. ', '').trim(), 'i') });

    const appointments = await Appointment.find({ $or: matchConditions })
      .select('fullName userId patientId age gender email phoneNumber appointmentId preferredDate')
      .sort({ createdAt: -1 });

    // De-duplicate by userId (one patient entry per unique patient)
    const seen = new Set();
    const patients = [];
    for (const appt of appointments) {
      const key = appt.userId?.toString() || appt.fullName;
      if (!seen.has(key)) {
        seen.add(key);
        patients.push({
          userId: appt.userId,
          patientId: appt.patientId,
          fullName: appt.fullName,
          age: appt.age,
          gender: appt.gender,
          email: appt.email,
          phoneNumber: appt.phoneNumber,
          lastAppointmentId: appt.appointmentId,
          lastVisitDate: appt.preferredDate
        });
      }
    }

    res.status(200).json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    console.error('Error in getMyPatients:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getDoctorProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let profile = await DoctorProfile.findOne({ user: req.user._id });

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

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    await user.save();

    let profile = await DoctorProfile.findOne({ user: req.user._id });
    
    if (profile) {
      Object.assign(profile, profileData);
      await profile.save();
    } else {
      profile = await DoctorProfile.create({ user: req.user._id, ...profileData });
    }

    await triggerDoctorNotification(
      req.user._id,
      'System',
      'Profile Updated',
      'Your doctor profile has been updated successfully.',
      'View Profile',
      '/doctordashboard/settings',
      'low'
    );

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

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.avatar = `/${req.file.path.replace(/\\/g, "/")}`;
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

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect current password" });
    }

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

export const getDashboardData = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const user = await User.findById(doctorId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const todayLocal = today.toLocaleDateString('en-CA');

    const doctorProfile = await DoctorProfile.findOne({ user: doctorId });
    // We will query either by the profile ID or by matching the doctor's name loosely.
    const doctorNameParts = user.fullName.split(' ');
    const lastName = doctorNameParts[doctorNameParts.length - 1];

    const matchConditions = [];
    if (doctorProfile) {
      matchConditions.push({ doctorProfileId: doctorProfile._id });
    }
    matchConditions.push({ doctor: new RegExp(lastName, 'i') });
    matchConditions.push({ doctor: new RegExp(user.fullName.replace('Dr. ', '').trim(), 'i') });

    const allAppointments = await Appointment.find({ $or: matchConditions }).sort({ preferredDate: 1, preferredTime: 1 });

    const todaysAppointments = allAppointments.filter(app =>
      app.preferredDate === todayStr || app.preferredDate === todayLocal
    );

    const upcomingAppointmentsCount = allAppointments.filter(app => app.status === 'Scheduled').length;

    const completedAppointments = allAppointments.filter(app => app.status === 'Completed');
    const uniquePatientsSeen = new Set(completedAppointments.map(app => app.patientId.toString()));
    const patientsSeenCount = uniquePatientsSeen.size;

    let newPatientsCount = 0;
    let returningPatientsCount = 0;
    const patientVisitCounts = {};
    completedAppointments.forEach(app => {
      const pid = app.patientId.toString();
      patientVisitCounts[pid] = (patientVisitCounts[pid] || 0) + 1;
    });
    Object.values(patientVisitCounts).forEach(count => {
      if (count === 1) newPatientsCount++;
      else returningPatientsCount++;
    });

    const patientOverviewData = [
      { name: 'New', value: newPatientsCount, color: '#0066FF' },
      { name: 'Returning', value: returningPatientsCount, color: '#00B9D6' },
    ];

    const recentPrescriptionsDocs = await Prescription.find({ doctorId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('appointmentId');

    const recentPrescriptions = recentPrescriptionsDocs.map(rx => ({
      name: rx.appointmentId ? rx.appointmentId.fullName : 'Unknown Patient',
      desc: rx.medicines && rx.medicines.length > 0
        ? rx.medicines.map(m => m.name).join(', ')
        : 'Prescription Document',
      time: rx.createdAt
    }));

    const pendingLabReportsDocs = await LabAppointment.find({
      referringDoctorId: doctorId,
      status: 'Pending'
    }).sort({ appointmentDate: 1 }).limit(5);

    const pendingLabReports = pendingLabReportsDocs.map(lab => ({
      name: lab.patientName,
      desc: lab.labTests && lab.labTests.length > 0
        ? lab.labTests.map(t => t.testName).join(', ')
        : 'Lab Test',
      time: lab.appointmentTime || 'N/A'
    }));

    const todaysSchedule = todaysAppointments.map(app => ({
      time: app.preferredTime,
      name: app.fullName,
      desc: app.reasonForVisit,
      status: app.status === 'Completed' ? 'COMPLETED' : 'IN PROGRESS',
      img: 'https://i.pravatar.cc/150?u=' + app.patientId
    }));

    res.status(200).json({
      success: true,
      data: {
        todaysAppointmentsCount: todaysAppointments.length,
        patientsSeenCount,
        upcomingAppointmentsCount,
        pendingLabReportsCount: pendingLabReportsDocs.length,
        todaysSchedule,
        patientOverviewData,
        recentPrescriptions,
        pendingLabReports
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
