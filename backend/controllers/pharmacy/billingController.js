import Bill from "../../models/PharmacyPanel/Bill.js";
import User from "../../models/user.js";

const generateBillId = async () => {
  const count = await Bill.countDocuments();
  return `BILL-${9000 + count + 1}`;
};

const shapeBill = (b) => ({
  id: b.billId,
  _id: b._id,
  patient: b.patientName,
  patientId: b.patient,
  date: new Date(b.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
  amount: b.amount,
  status: b.status,
  items: b.items,
});

// @desc    Get all bills (search + status filter)
// @route   GET /api/pharmacy/billing
export const getBills = async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { patientName: { $regex: search, $options: "i" } },
        { billId: { $regex: search, $options: "i" } },
      ];
    }
    if (status && status !== "All") {
      filter.status = status;
    }

    const bills = await Bill.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bills.length, data: bills.map(shapeBill) });
  } catch (error) {
    console.error("Error in getBills:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get billing stats
// @route   GET /api/pharmacy/billing/stats
export const getBillingStats = async (req, res) => {
  try {
    const bills = await Bill.find();
    const stats = {
      total: bills.length,
      paid: bills.filter((b) => b.status === "Paid").length,
      pending: bills.filter((b) => b.status === "Pending").length,
      revenue: bills.filter((b) => b.status === "Paid").reduce((sum, b) => sum + b.amount, 0),
    };
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Error in getBillingStats:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get single bill
// @route   GET /api/pharmacy/billing/:id
export const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ success: false, message: "Bill not found" });
    }
    res.status(200).json({ success: true, data: shapeBill(bill) });
  } catch (error) {
    console.error("Error in getBillById:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Create a bill
// @route   POST /api/pharmacy/billing
export const createBill = async (req, res) => {
  try {
    const { patient, amount, items, prescription } = req.body;

    if (!patient || amount === undefined) {
      return res.status(400).json({ success: false, message: "Patient name and amount are required" });
    }

    // patient can be a name (walk-in) or an existing User _id
    let patientDoc = null;
    if (patient.match(/^[0-9a-fA-F]{24}$/)) {
      patientDoc = await User.findById(patient);
    }

    const billId = await generateBillId();

    const bill = await Bill.create({
      billId,
      patient: patientDoc ? patientDoc._id : undefined,
      patientName: patientDoc ? patientDoc.fullName : patient,
      prescription: prescription || undefined,
      items: items || [],
      amount: Number(amount) || 0,
      status: "Pending",
      generatedBy: req.user._id,
    });

    res.status(201).json({ success: true, message: "Bill generated successfully", data: shapeBill(bill) });
  } catch (error) {
    console.error("Error in createBill:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Mark a bill as paid
// @route   PUT /api/pharmacy/billing/:id/mark-paid
export const markBillPaid = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ success: false, message: "Bill not found" });
    }

    bill.status = "Paid";
    await bill.save();

    res.status(200).json({ success: true, message: "Bill marked as paid", data: shapeBill(bill) });
  } catch (error) {
    console.error("Error in markBillPaid:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};