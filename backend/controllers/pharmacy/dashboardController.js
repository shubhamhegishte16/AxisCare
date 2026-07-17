import Medicine from "../../models/PharmacyPanel/Medicine.js";
import Bill from "../../models/PharmacyPanel/Bill.js";
import Notification from "../../models/PharmacyPanel/Notification.js";
import Prescription from "../../models/Prescription.js";

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const units = [
    ["year", 31536000], ["month", 2592000], ["day", 86400],
    ["hr", 3600], ["min", 60],
  ];
  for (const [label, secs] of units) {
    const val = Math.floor(seconds / secs);
    if (val >= 1) return `${val} ${label}${val > 1 ? "s" : ""} ago`;
  }
  return "just now";
};

const CATEGORY_COLORS = ["#3B82F6", "#00B9D6", "#F59E0B", "#10B981", "#D1D5DB"];

// @desc    Get pharmacy dashboard data (stats, weekly sales, category split, etc.)
// @route   GET /api/pharmacy/dashboard
export const getDashboardData = async (req, res) => {
  try {
    const [medicines, bills, prescriptions, notifications] = await Promise.all([
      Medicine.find(),
      Bill.find(),
      Prescription.find({ status: "Generated" }),
      Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(6),
    ]);

    const today = startOfDay(new Date());

    // ---- Stats ----
    const salesToday = bills
      .filter((b) => new Date(b.createdAt) >= today)
      .reduce((sum, b) => sum + b.amount, 0);

    const stats = {
      totalMedicines: medicines.length,
      lowStock: medicines.filter((m) => m.status === "Low Stock").length,
      outOfStock: medicines.filter((m) => m.status === "Out of Stock").length,
      pendingPrescriptions: prescriptions.filter((p) => p.pharmacyStatus === "Pending").length,
      salesToday,
      expiringMedicines: medicines.filter((m) => m.status === "Expiring Soon").length,
    };

    // ---- Weekly sales (last 7 days) ----
    const weeklySales = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(day.getDate() - i);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const daySales = bills
        .filter((b) => new Date(b.createdAt) >= day && new Date(b.createdAt) < nextDay)
        .reduce((sum, b) => sum + b.amount, 0);

      weeklySales.push({ day: day.toLocaleDateString("en-US", { weekday: "short" }), sales: daySales });
    }

    // ---- Category distribution ----
    const categoryCounts = {};
    medicines.forEach((m) => {
      categoryCounts[m.category] = (categoryCounts[m.category] || 0) + 1;
    });
    const categoryDistribution = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], idx) => ({ name, value, color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }));

    // ---- Today's prescription requests (latest 5) ----
    const todaysPrescriptionRequests = prescriptions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((p) => ({
        id: p.prescriptionId,
        patient: p.patientName,
        doctor: p.doctorName,
        status: p.pharmacyStatus,
      }));

    // ---- Inventory overview (latest 5) ----
    const inventoryOverview = medicines
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((m) => ({
        medicine: m.name,
        category: m.category,
        available: m.stock,
        expiry: new Date(m.expiry).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        status: m.status,
      }));

    // ---- Recent activity (from notifications) ----
    const activityTimeline = notifications.map((n) => ({
      text: n.text,
      time: timeAgo(n.createdAt),
    }));

    res.status(200).json({
      success: true,
      data: {
        stats,
        weeklySales,
        categoryDistribution,
        todaysPrescriptionRequests,
        inventoryOverview,
        activityTimeline,
      },
    });
  } catch (error) {
    console.error("Error in getDashboardData:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};