import Bill from "../../models/PharmacyPanel/Bill.js";

// NOTE: Right now the only real "revenue" data in this schema comes from
// pharmacy Bills (medicine sales). There is no separate consultation-fee or
// hospital-billing collection yet — DoctorProfile has a `consultationFee`
// field but nothing records that a fee was actually collected per
// appointment. Until that exists, this controller reports pharmacy revenue
// as the hospital's revenue figure, and expenses are not tracked anywhere
// yet, so they are returned as 0 rather than being invented.

// @desc    Get monthly revenue for the last 6 months
// @route   GET /api/admin/billing/revenue
export const getMonthlyRevenue = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const bills = await Bill.find({ createdAt: { $gte: sixMonthsAgo } });

    const monthly = {};
    bills.forEach((b) => {
      const key = new Date(b.createdAt).toLocaleDateString("en-GB", { month: "short" });
      monthly[key] = (monthly[key] || 0) + b.amount;
    });

    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = d.toLocaleDateString("en-GB", { month: "short" });
      months.push({ month: label, revenue: monthly[label] || 0, expenses: 0 });
    }

    res.status(200).json({ success: true, data: months });
  } catch (error) {
    console.error("Error in getMonthlyRevenue:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get billing summary stats
// @route   GET /api/admin/billing/stats
export const getBillingStats = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const bills = await Bill.find({ createdAt: { $gte: startOfMonth } });
    const revenueThisMonth = bills.reduce((sum, b) => sum + b.amount, 0);

    const allBills = await Bill.find();
    const revenueYtd = allBills.reduce((sum, b) => sum + b.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        revenueThisMonth,
        expensesThisMonth: 0, // not tracked yet — see note above
        netProfit: revenueThisMonth,
        revenueYtd,
      },
    });
  } catch (error) {
    console.error("Error in getBillingStats:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
