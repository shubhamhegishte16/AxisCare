import Medicine from "../../models/PharmacyPanel/Medicine.js";
import Prescription from "../../models/Prescription.js";
import Bill from "../../models/PharmacyPanel/Bill.js";

// This deliberately queries the SAME collections the Pharmacist Panel uses —
// it does not duplicate pharmacy data into an admin-owned copy. Admin gets a
// read-only snapshot; all actual pharmacy management stays in the Pharmacy Panel.

// @desc    Get a read-only snapshot of pharmacy operations
// @route   GET /api/admin/pharmacy/overview
export const getPharmacyOverview = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    const totalMedicines = medicines.length;
    const lowStock = medicines.filter((m) => m.status === "Low Stock" || m.status === "Out of Stock").length;

    const pendingPrescriptions = await Prescription.countDocuments({
      status: "Generated",
      pharmacyStatus: "Pending",
    });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const bills = await Bill.find({ createdAt: { $gte: startOfDay } });
    const salesToday = bills.reduce((sum, b) => sum + b.amount, 0);

    res.status(200).json({
      success: true,
      data: { totalMedicines, lowStock, pendingPrescriptions, salesToday },
    });
  } catch (error) {
    console.error("Error in getPharmacyOverview:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
