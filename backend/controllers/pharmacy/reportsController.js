import Medicine from "../../models/PharmacyPanel/Medicine.js";
import Bill from "../../models/PharmacyPanel/Bill.js";
import Prescription from "../../models/Prescription.js";

const CATEGORY_COLORS = ["#3B82F6", "#00B9D6", "#F59E0B", "#10B981", "#D1D5DB"];

const monthKey = (d) => `${d.getFullYear()}-${d.getMonth()}`;
const pctChange = (curr, prev) => {
  if (!prev) return curr ? 100 : 0;
  return ((curr - prev) / prev) * 100;
};

// @desc    Get pharmacy performance reports (revenue trend, category split, top sellers, highlights)
// @route   GET /api/pharmacy/reports
export const getReportsData = async (req, res) => {
  try {
    const [medicines, bills, prescriptions] = await Promise.all([
      Medicine.find(),
      Bill.find({ status: "Paid" }),
      Prescription.find({ status: "Generated" }),
    ]);

    const now = new Date();

    // ---- Monthly revenue (last 6 months) ----
    const monthlyRevenue = [];
    const monthTotals = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthTotals[monthKey(d)] = { label: d.toLocaleDateString("en-US", { month: "short" }), total: 0 };
    }
    bills.forEach((b) => {
      const key = monthKey(new Date(b.createdAt));
      if (monthTotals[key]) monthTotals[key].total += b.amount;
    });
    Object.values(monthTotals).forEach((m) => monthlyRevenue.push({ month: m.label, revenue: m.total }));

    const thisMonthRevenue = monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0;
    const lastMonthRevenue = monthlyRevenue[monthlyRevenue.length - 2]?.revenue || 0;

    // ---- Category distribution ----
    const categoryCounts = {};
    medicines.forEach((m) => {
      categoryCounts[m.category] = (categoryCounts[m.category] || 0) + 1;
    });
    const categoryDistribution = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], idx) => ({ name, value, color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }));

    // ---- Top selling medicines (by quantity billed) ----
    const soldQty = {};
    bills.forEach((b) => {
      b.items.forEach((item) => {
        soldQty[item.name] = (soldQty[item.name] || 0) + item.quantity;
      });
    });
    const topSellingMedicines = Object.entries(soldQty)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, sold]) => ({ name, sold }));

    // ---- Highlights ----
    const thisMonthPrescriptions = prescriptions.filter(
      (p) => monthKey(new Date(p.createdAt)) === monthKey(now)
    ).length;
    const lastMonthPrescriptions = prescriptions.filter(
      (p) => monthKey(new Date(p.createdAt)) === monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1))
    ).length;

    const avgBillValue = bills.length ? bills.reduce((sum, b) => sum + b.amount, 0) / bills.length : 0;

    const reportHighlights = [
      {
        label: "Total Revenue (This Month)",
        value: `Rs. ${thisMonthRevenue.toLocaleString()}`,
        change: `${pctChange(thisMonthRevenue, lastMonthRevenue) >= 0 ? "+" : ""}${pctChange(thisMonthRevenue, lastMonthRevenue).toFixed(1)}%`,
        positive: thisMonthRevenue >= lastMonthRevenue,
      },
      {
        label: "Prescriptions Filled",
        value: `${thisMonthPrescriptions}`,
        change: `${pctChange(thisMonthPrescriptions, lastMonthPrescriptions) >= 0 ? "+" : ""}${pctChange(thisMonthPrescriptions, lastMonthPrescriptions).toFixed(1)}%`,
        positive: thisMonthPrescriptions >= lastMonthPrescriptions,
      },
      {
        label: "Avg. Bill Value",
        value: `Rs. ${avgBillValue.toFixed(0)}`,
        change: "",
        positive: true,
      },
      {
        label: "Total Medicines Tracked",
        value: `${medicines.length}`,
        change: "",
        positive: true,
      },
    ];

    res.status(200).json({
      success: true,
      data: { reportHighlights, monthlyRevenue, categoryDistribution, topSellingMedicines },
    });
  } catch (error) {
    console.error("Error in getReportsData:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};