import axios from 'axios';
import { billService } from './PatientBillService.js';
import { appointmentService } from './appointmentService.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const dashboardApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

dashboardApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const dashboardService = {
  getPatientDashboard: async () => {
    try {
    //   console.log('Fetching dashboard data...');
      
      // Use the SAME services that work in your bills page
      const [billsResponse, statsResponse, appointmentsResponse] = await Promise.all([
        billService.getMyBills(),
        billService.getBillStats(),
        appointmentService.getMyAppointments().catch(() => ({ success: false, data: [] }))
      ]);

    //   console.log('Bills Response:', billsResponse);
    //   console.log('Stats Response:', statsResponse);
    //   console.log('Appointments Response:', appointmentsResponse);

      // Extract bills data - using same structure as bills page
      let bills = [];
      if (billsResponse.success && billsResponse.data) {
        bills = billsResponse.data;
      }
    //   console.log('Bills count:', bills.length);

      // Extract stats - using same structure as bills page
      let stats = {
        totalMedicalExpenses: 0,
        pendingPayments: 0,
        paidBills: 0,
        insuranceCovered: 0
      };
      if (statsResponse.success && statsResponse.data) {
        stats = statsResponse.data;
        // console.log('Stats from backend:', stats);
      }

      // Extract appointments
      let appointments = [];
      if (appointmentsResponse.success && appointmentsResponse.data) {
        appointments = appointmentsResponse.data;
      }

      // Calculate pending bills from bills array
      const pendingBills = bills.filter(b => {
        const status = (b.status || b.paymentStatus || '').toLowerCase();
        return status === 'unpaid' || status === 'Unpaid';
      });

      // Get upcoming appointments
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const upcomingAppointments = appointments.filter(a => {
        const apptDate = new Date(a.date);
        return apptDate >= today;
      });

      // Build dashboard data using EXACT same data as bills page
      const dashboardData = {
        user: {
          name: 'Patient',
          email: ''
        },
        stats: {
          totalAppointments: appointments.length || 0,
          pendingBills: pendingBills.length || 0,
          paidBills: stats.paidBills || bills.filter(b => {
            const status = (b.status || b.paymentStatus || '').toLowerCase();
            return status === 'paid' || status === 'Paid';
          }).length || 0,
          totalBills: bills.length || 0,
          upcomingAppointments: upcomingAppointments.length || 0,
          totalMedicalExpenses: stats.totalMedicalExpenses || 0,
          pendingAmount: stats.pendingPayments || 0,
          insuranceCovered: stats.insuranceCovered || 0
        },
        alerts: [],
        healthSummary: {
          bloodPressure: 'Not recorded',
          bloodPressureStatus: 'Not available',
          heartRate: 'Not recorded',
          heartRateStatus: 'Not available',
          bloodSugar: 'Not recorded',
          bloodSugarStatus: 'Not available'
        },
        latestPrescriptions: [],
        upcomingAppointments: upcomingAppointments.slice(0, 3).map(a => ({
          id: a._id,
          doctorName: a.doctorName || 'N/A',
          specialty: a.specialty || 'General',
          date: a.date,
          time: a.time || '10:00 AM',
          location: a.location || 'Clinic'
        })),
        pendingBills: pendingBills.slice(0, 3).map(b => ({
          id: b._id,
          billId: b.billId || b.invoiceId || b.orderId || 'N/A',
          amount: b.amountRaw || b.totalAmount || 0,
          dueDate: b.date || 'N/A'
        })),
        careTeam: [],
        notifications: []
      };

      // Add alerts
      const pendingAmount = stats.pendingPayments || 0;
      if (pendingAmount > 0) {
        dashboardData.alerts.push({
          type: 'urgent',
          message: `You have an outstanding balance of Rs. ${pendingAmount.toFixed(2)}`,
          action: 'Pay Invoice',
          actionType: 'pay',
          actionId: pendingBills[0]?._id
        });
      }

      if (upcomingAppointments.length > 0) {
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

      if (dashboardData.alerts.length === 0) {
        dashboardData.alerts.push({
          type: 'info',
          message: 'Welcome to AxisCare! Your health is our priority.',
          action: 'Book Appointment',
          actionType: 'book',
          actionData: null
        });
      }

    // //   console.log('Final Dashboard Stats:', {
    //     totalMedicalExpenses: dashboardData.stats.totalMedicalExpenses,
    //     pendingAmount: dashboardData.stats.pendingAmount,
    //     paidBills: dashboardData.stats.paidBills,
    //     totalBills: dashboardData.stats.totalBills
    //   });

      return {
        success: true,
        data: dashboardData
      };

    } catch (error) {
      console.error('Dashboard Error:', error);
      // Return fallback data
      return {
        success: false,
        data: {
          user: { name: 'Patient', email: '' },
          stats: {
            totalAppointments: 0,
            pendingBills: 0,
            paidBills: 0,
            totalBills: 0,
            upcomingAppointments: 0,
            totalMedicalExpenses: 0,
            pendingAmount: 0,
            insuranceCovered: 0
          },
          alerts: [{
            type: 'info',
            message: 'Welcome to AxisCare!',
            action: 'Book Appointment',
            actionType: 'book',
            actionData: null
          }],
          healthSummary: {
            bloodPressure: 'Not recorded',
            bloodPressureStatus: 'Not available',
            heartRate: 'Not recorded',
            heartRateStatus: 'Not available',
            bloodSugar: 'Not recorded',
            bloodSugarStatus: 'Not available'
          },
          latestPrescriptions: [],
          upcomingAppointments: [],
          pendingBills: [],
          careTeam: [],
          notifications: []
        },
        message: error.message || 'Failed to load dashboard'
      };
    }
  }
};

export default dashboardApi;