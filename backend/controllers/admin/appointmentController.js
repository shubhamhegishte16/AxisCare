import Appointment from "../../models/Appointment.js";

const shapeAppointment = (a) => ({
  id: a.appointmentId,
  _id: a._id,
  patient: a.fullName,
  doctor: a.doctor,
  department: a.department,
  date: a.preferredDate,
  time: a.preferredTime,
  type: a.appointmentType,
  status: a.status,
});

// @desc    Get all appointments system-wide (search + status filter)
// @route   GET /api/admin/appointments
export const getAppointments = async (req, res) => {
  try {
    const { search, status, department } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { doctor: { $regex: search, $options: "i" } },
        { appointmentId: { $regex: search, $options: "i" } },
      ];
    }
    if (status && status !== "All") {
      filter.status = status;
    }
    if (department && department !== "All") {
      filter.department = department;
    }

    const appointments = await Appointment.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: appointments.length, data: appointments.map(shapeAppointment) });
  } catch (error) {
    console.error("Error in getAppointments:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get appointment stats
// @route   GET /api/admin/appointments/stats
export const getAppointmentStats = async (req, res) => {
  try {
    const [total, scheduled, completed, cancelled, pending] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: "Scheduled" }),
      Appointment.countDocuments({ status: "Completed" }),
      Appointment.countDocuments({ status: "Cancelled" }),
      Appointment.countDocuments({ status: "Pending" }),
    ]);
    res.status(200).json({ success: true, data: { total, scheduled, completed, cancelled, pending } });
  } catch (error) {
    console.error("Error in getAppointmentStats:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get appointment counts grouped by department (for dashboard chart)
// @route   GET /api/admin/appointments/by-department
export const getAppointmentsByDepartment = async (req, res) => {
  try {
    const grouped = await Appointment.aggregate([
      { $group: { _id: "$department", appointments: { $sum: 1 } } },
      { $project: { _id: 0, department: "$_id", appointments: 1 } },
      { $sort: { appointments: -1 } },
    ]);
    res.status(200).json({ success: true, data: grouped });
  } catch (error) {
    console.error("Error in getAppointmentsByDepartment:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get a single appointment's full detail
// @route   GET /api/admin/appointments/:id
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    res.status(200).json({ success: true, data: shapeAppointment(appointment) });
  } catch (error) {
    console.error("Error in getAppointmentById:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Intentionally no create/update/delete here — appointments are owned by the
// Patient/Receptionist/Doctor Panels. Admin has read-only oversight.
