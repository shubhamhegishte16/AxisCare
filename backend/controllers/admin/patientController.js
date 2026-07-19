import Patient from "../../models/Patient.js";
import Appointment from "../../models/Appointment.js";

const calculateAge = (dob) => {
  const parts = String(dob).split("/");
  if (parts.length !== 3) return "-";
  const [day, month, year] = parts.map(Number);
  const birthDate = new Date(year, month - 1, day);
  if (Number.isNaN(birthDate.getTime())) return "-";
  const diffMs = Date.now() - birthDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
};

const shapePatient = async (p) => {
  const visits = await Appointment.find({ patientId: p._id }).sort({ createdAt: -1 });
  const lastVisit = visits[0]
    ? new Date(visits[0].createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "-";

  return {
    id: p.patientId,
    _id: p._id,
    userId: p.userId,
    name: `${p.firstName} ${p.lastName}`,
    email: p.email,
    phone: p.phoneNumber,
    age: calculateAge(p.dateOfBirth),
    gender: p.gender,
    lastVisit,
    totalVisits: visits.length,
  };
};

// @desc    Get all patients (search)
// @route   GET /api/admin/patients
export const getPatients = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { patientId: { $regex: search, $options: "i" } },
      ];
    }

    const patients = await Patient.find(filter).sort({ createdAt: -1 });
    const data = await Promise.all(patients.map(shapePatient));

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    console.error("Error in getPatients:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get patient stats
// @route   GET /api/admin/patients/stats
export const getPatientStats = async (req, res) => {
  try {
    const total = await Patient.countDocuments();
    const totalVisits = await Appointment.countDocuments();

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newThisMonth = await Patient.countDocuments({ createdAt: { $gte: startOfMonth } });

    res.status(200).json({ success: true, data: { total, totalVisits, newThisMonth } });
  } catch (error) {
    console.error("Error in getPatientStats:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get a single patient's full detail (admin reference view only)
// @route   GET /api/admin/patients/:id
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
    res.status(200).json({ success: true, data: await shapePatient(patient) });
  } catch (error) {
    console.error("Error in getPatientById:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Intentionally no create/update/delete here — patient records are owned by
// the Patient Panel (self-registration) and Doctor Panel (clinical updates).
// Admin only needs read access for oversight.
