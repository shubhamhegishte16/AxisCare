import Order from '../models/PharmacyPanel/Order.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import User from '../models/user.js';
import Patient from '../models/Patient.js';

export const getPatientDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // console.log('Fetching dashboard for user:', userId);

    // Get all data
    const [user, patient, orders, allAppointments, prescriptions, careTeam] = await Promise.all([
      User.findById(userId),
      Patient.findOne({ userId }),
      Order.find({ userId }),
      Appointment.find({ patientId: userId }),
      Prescription.find({ patientId: userId }).sort({ createdAt: -1 }).limit(2),
      User.find({ role: 'doctor' }).limit(3)
    ]);

    // Calculate stats
    const pendingBills = orders.filter(o => o.paymentStatus !== 'Paid');
    const paidBills = orders.filter(o => o.paymentStatus === 'Paid');
    
    // Get upcoming appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingAppointments = await Appointment.find({ 
      patientId: userId,
      date: { $gte: today }
    }).sort({ date: 1 }).limit(3);

    const totalMedicalExpenses = orders.reduce((sum, o) => {
      const amount = o.totalAmount || o.total || 0;
      return sum + (parseFloat(amount) || 0);
    }, 0);

    const pendingAmount = pendingBills.reduce((sum, o) => {
      const amount = o.totalAmount || o.total || 0;
      return sum + (parseFloat(amount) || 0);
    }, 0);

    // Build dashboard data
    const dashboardData = {
      user: {
        name: user?.name || 'Patient',
        email: user?.email || ''
      },
      stats: {
        totalAppointments: allAppointments.length || 0,
        pendingBills: pendingBills.length || 0,
        paidBills: paidBills.length || 0,
        totalBills: orders.length || 0,
        upcomingAppointments: upcomingAppointments.length || 0,
        totalMedicalExpenses: totalMedicalExpenses || 0,
        pendingAmount: pendingAmount || 0
      },
      alerts: []
    };

    // Add alerts only if there's data
    if (pendingAmount > 0) {
      dashboardData.alerts.push({
        type: 'urgent',
        message: `You have an outstanding balance of Rs. ${pendingAmount.toFixed(2)}`,
        action: 'Pay Invoice',
        actionType: 'pay',
        actionId: pendingBills[0]?._id
      });
    }

    if (upcomingAppointments && upcomingAppointments.length > 0) {
      const appt = upcomingAppointments[0];
      const apptDate = new Date(appt.date);
      dashboardData.alerts.push({
        type: 'info',
        message: `Dr. ${appt.doctorName || 'N/A'} | ${apptDate.toLocaleDateString()} at ${appt.time || 'N/A'}`,
        action: 'Get Directions',
        actionType: 'directions',
        actionData: appt
      });
    }

    // Health summary
    dashboardData.healthSummary = {
      bloodPressure: patient?.bloodPressure || 'Not recorded',
      bloodPressureStatus: patient?.bloodPressure ? 'Normal' : 'Not available',
      heartRate: patient?.heartRate || 'Not recorded',
      heartRateStatus: patient?.heartRate ? 'Optimal' : 'Not available',
      bloodSugar: patient?.bloodSugar || 'Not recorded',
      bloodSugarStatus: patient?.bloodSugar ? 'Fasting' : 'Not available'
    };

    // Latest prescriptions
    dashboardData.latestPrescriptions = prescriptions.map(p => ({
      id: p._id,
      doctorName: p.doctorName || 'N/A',
      issuedDate: p.createdAt || new Date(),
      medicineName: p.medicines?.[0]?.name || p.medicines?.[0]?.medicineName || 'N/A',
      dosage: p.medicines?.[0]?.dosage || 'N/A'
    }));

    // Upcoming appointments
    dashboardData.upcomingAppointments = upcomingAppointments.map(a => ({
      id: a._id,
      doctorName: a.doctorName || 'N/A',
      specialty: a.specialty || 'General',
      date: a.date,
      time: a.time || '10:00 AM',
      location: a.location || 'Clinic'
    }));

    // Pending bills
    dashboardData.pendingBills = pendingBills.map(b => ({
      id: b._id,
      billId: b.billId || b.orderId || 'N/A',
      amount: b.totalAmount || b.total || 0,
      dueDate: b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'N/A'
    }));

    // Care team
    dashboardData.careTeam = careTeam.map(d => ({
      id: d._id,
      name: d.name || 'Dr. N/A',
      specialty: d.specialty || 'General'
    }));

    console.log('Dashboard data summary:', {
      userName: dashboardData.user.name,
      alerts: dashboardData.alerts.length,
      prescriptions: dashboardData.latestPrescriptions.length,
      appointments: dashboardData.upcomingAppointments.length,
      pendingBills: dashboardData.pendingBills.length,
      careTeam: dashboardData.careTeam.length,
      totalMedicalExpenses: dashboardData.stats.totalMedicalExpenses
    });

    res.status(200).json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Error in getPatientDashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};