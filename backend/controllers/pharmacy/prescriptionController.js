import Prescription from "../../models/Prescription.js";

const shapePrescription = (p) => ({
  id: p.prescriptionId,
  _id: p._id,
  patient: p.patientName,
  doctor: p.doctorName,
  date: new Date(p.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
  status: p.pharmacyStatus,
  medicines: p.medicines,
  patientAge: p.patientAge,
  patientGender: p.patientGender,
  patientContact: p.patientContact,
  diagnosisPrimary: p.diagnosisPrimary,
});

// @desc    Get all generated prescriptions for pharmacy fulfillment (search + status filter)
// @route   GET /api/pharmacy/prescriptions
export const getPharmacyPrescriptions = async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = { status: "Generated" };

    if (search) {
      filter.$or = [
        { patientName: { $regex: search, $options: "i" } },
        { prescriptionId: { $regex: search, $options: "i" } },
        { doctorName: { $regex: search, $options: "i" } },
      ];
    }
    if (status && status !== "All") {
      filter.pharmacyStatus = status;
    }

    const prescriptions = await Prescription.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: prescriptions.length, data: prescriptions.map(shapePrescription) });
  } catch (error) {
    console.error("Error in getPharmacyPrescriptions:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get pharmacy prescription stats
// @route   GET /api/pharmacy/prescriptions/stats
export const getPharmacyPrescriptionStats = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ status: "Generated" });
    const stats = {
      total: prescriptions.length,
      pending: prescriptions.filter((p) => p.pharmacyStatus === "Pending").length,
      completed: prescriptions.filter((p) => p.pharmacyStatus === "Completed").length,
      cancelled: prescriptions.filter((p) => p.pharmacyStatus === "Cancelled").length,
    };
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Error in getPharmacyPrescriptionStats:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get single prescription (with medicine details) for pharmacy view
// @route   GET /api/pharmacy/prescriptions/:id
export const getPharmacyPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription not found" });
    }
    res.status(200).json({ success: true, data: shapePrescription(prescription) });
  } catch (error) {
    console.error("Error in getPharmacyPrescriptionById:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update pharmacy fulfillment status (Completed/Cancelled)
// @route   PUT /api/pharmacy/prescriptions/:id/status
export const updatePharmacyStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription not found" });
    }

    prescription.pharmacyStatus = status;
    if (status === "Completed") {
      prescription.dispensedBy = req.user._id;
      prescription.dispensedAt = new Date();
    }
    await prescription.save();

    res.status(200).json({ success: true, message: "Prescription status updated", data: shapePrescription(prescription) });
  } catch (error) {
    console.error("Error in updatePharmacyStatus:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};