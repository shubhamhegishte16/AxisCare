import User from "../../models/user.js";
import Appointment from "../../models/Appointment.js";
import Bill from "../../models/PharmacyPanel/Bill.js";

// @desc    Get analytics data for the Reports page
// @route   GET /api/admin/reports
export const getReports = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // User growth
    const recentUsers = await User.find({ createdAt: { $gte: sixMonthsAgo } }).select("createdAt");
    const totalBeforeWindow = await User.countDocuments({ createdAt: { $lt: sixMonthsAgo } });
    const monthlyNew = {};
    recentUsers.forEach((u) => {
      const key = new Date(u.createdAt).toLocaleDateString("en-GB", { month: "short" });
      monthlyNew[key] = (monthlyNew[key] || 0) + 1;
    });

    const userGrowth = [];
    let running = totalBeforeWindow;
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = d.toLocaleDateString("en-GB", { month: "short" });
      running += monthlyNew[label] || 0;
      userGrowth.push({ month: label, users: running });
    }

    // Revenue trend (pharmacy bills — see billingController note)
    const bills = await Bill.find({ createdAt: { $gte: sixMonthsAgo } });
    const monthlyRevenue = {};
    bills.forEach((b) => {
      const key = new Date(b.createdAt).toLocaleDateString("en-GB", { month: "short" });
      monthlyRevenue[key] = (monthlyRevenue[key] || 0) + b.amount;
    });
    const revenueByMonth = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = d.toLocaleDateString("en-GB", { month: "short" });
      revenueByMonth.push({ month: label, revenue: monthlyRevenue[label] || 0 });
    }

    // Department load (all-time)
    const departmentLoad = await Appointment.aggregate([
      { $group: { _id: "$department", appointments: { $sum: 1 } } },
      { $project: { _id: 0, department: "$_id", appointments: 1 } },
      { $sort: { appointments: -1 } },
    ]);

    // Role distribution
    const roles = ["patient", "doctor", "receptionist", "pharmacist", "laboratory", "admin"];
    const roleColors = {
      patient: "#3B82F6",
      doctor: "#10B981",
      receptionist: "#F59E0B",
      pharmacist: "#8B5CF6",
      laboratory: "#EC4899",
      admin: "#6B7280",
    };
    const roleLabels = {
      patient: "Patients",
      doctor: "Doctors",
      receptionist: "Receptionists",
      pharmacist: "Pharmacists",
      laboratory: "Lab Staff",
      admin: "Admins",
    };
    const roleDistribution = await Promise.all(
      roles.map(async (r) => ({
        name: roleLabels[r],
        value: await User.countDocuments({ role: r }),
        color: roleColors[r],
      }))
    );

    res.status(200).json({
      success: true,
      data: { userGrowth, revenueByMonth, departmentLoad, roleDistribution },
    });
  } catch (error) {
    console.error("Error in getReports:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
