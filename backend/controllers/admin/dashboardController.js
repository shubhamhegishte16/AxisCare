import User from "../../models/user.js";
import Appointment from "../../models/Appointment.js";
import Bill from "../../models/PharmacyPanel/Bill.js";

// @desc    Get aggregated stats for the admin dashboard
// @route   GET /api/admin/dashboard
export const getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalDoctors, totalPatients] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "doctor" }),
      User.countDocuments({ role: "patient" }),
    ]);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const appointmentsToday = await Appointment.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const pendingApprovals = await User.countDocuments({ isActive: false });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const bills = await Bill.find({ createdAt: { $gte: startOfMonth } });
    const revenueThisMonth = bills.reduce((sum, b) => sum + b.amount, 0);

    // User growth over the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

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

    // Department load (today's appointments grouped by department)
    const departmentLoad = await Appointment.aggregate([
      { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
      { $group: { _id: "$department", appointments: { $sum: 1 } } },
      { $project: { _id: 0, department: "$_id", appointments: 1 } },
      { $sort: { appointments: -1 } },
    ]);

    // Pending approvals list (inactive accounts awaiting review)
    const pendingUsers = await User.find({ isActive: false }).sort({ createdAt: -1 }).limit(5);
    const pendingApprovalsList = pendingUsers.map((u) => ({
      id: `REQ-${String(u._id).slice(-6).toUpperCase()}`,
      name: u.fullName,
      role: u.role,
      department: u.department || "-",
      date: new Date(u.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    }));

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalDoctors,
          totalPatients,
          appointmentsToday,
          pendingApprovals,
          revenueThisMonth,
        },
        userGrowth,
        roleDistribution,
        departmentLoad,
        pendingApprovalsList,
        recentActivity: [], // populated once an admin-wide activity log exists; see README
      },
    });
  } catch (error) {
    console.error("Error in getDashboard:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
