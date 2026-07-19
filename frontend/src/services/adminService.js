import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const adminApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const adminService = {
  // Dashboard
  getDashboard: async () => (await adminApi.get('/admin/dashboard')).data,

  // Reports
  getReports: async () => (await adminApi.get('/admin/reports')).data,

  // Users
  getUsers: async (params = {}) => (await adminApi.get('/admin/users', { params })).data,
  getUserStats: async () => (await adminApi.get('/admin/users/stats')).data,
  getUserById: async (id) => (await adminApi.get(`/admin/users/${id}`)).data,
  createUser: async (payload) => (await adminApi.post('/admin/users', payload)).data,
  updateUser: async (id, payload) => (await adminApi.put(`/admin/users/${id}`, payload)).data,
  toggleUserStatus: async (id) => (await adminApi.put(`/admin/users/${id}/status`)).data,
  deleteUser: async (id) => (await adminApi.delete(`/admin/users/${id}`)).data,

  // Doctors
  getDoctors: async (params = {}) => (await adminApi.get('/admin/doctors', { params })).data,
  getDoctorStats: async () => (await adminApi.get('/admin/doctors/stats')).data,
  getDoctorById: async (id) => (await adminApi.get(`/admin/doctors/${id}`)).data,
  createDoctor: async (payload) => (await adminApi.post('/admin/doctors', payload)).data,
  updateDoctor: async (id, payload) => (await adminApi.put(`/admin/doctors/${id}`, payload)).data,
  removeDoctor: async (id) => (await adminApi.delete(`/admin/doctors/${id}`)).data,

  // Patients (read-only)
  getPatients: async (params = {}) => (await adminApi.get('/admin/patients', { params })).data,
  getPatientStats: async () => (await adminApi.get('/admin/patients/stats')).data,
  getPatientById: async (id) => (await adminApi.get(`/admin/patients/${id}`)).data,

  // Departments
  getDepartments: async () => (await adminApi.get('/admin/departments')).data,
  getDepartmentStats: async () => (await adminApi.get('/admin/departments/stats')).data,
  createDepartment: async (payload) => (await adminApi.post('/admin/departments', payload)).data,
  updateDepartment: async (id, payload) => (await adminApi.put(`/admin/departments/${id}`, payload)).data,
  deleteDepartment: async (id) => (await adminApi.delete(`/admin/departments/${id}`)).data,

  // Appointments (read-only)
  getAppointments: async (params = {}) => (await adminApi.get('/admin/appointments', { params })).data,
  getAppointmentStats: async () => (await adminApi.get('/admin/appointments/stats')).data,
  getAppointmentsByDepartment: async () => (await adminApi.get('/admin/appointments/by-department')).data,
  getAppointmentById: async (id) => (await adminApi.get(`/admin/appointments/${id}`)).data,

  // Billing (read-only)
  getMonthlyRevenue: async () => (await adminApi.get('/admin/billing/revenue')).data,
  getBillingStats: async () => (await adminApi.get('/admin/billing/stats')).data,

  // Pharmacy oversight (read-only)
  getPharmacyOverview: async () => (await adminApi.get('/admin/pharmacy/overview')).data,

  // Notifications
  getNotifications: async () => (await adminApi.get('/admin/notifications')).data,
  markNotificationRead: async (id) => (await adminApi.put(`/admin/notifications/${id}/read`)).data,
  markAllNotificationsRead: async () => (await adminApi.put('/admin/notifications/read-all')).data,
};

export default adminApi;
