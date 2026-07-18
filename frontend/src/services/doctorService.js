import axios from 'axios';

const API_URL = 'http://localhost:5000/api/doctor';

const doctorApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

doctorApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const doctorService = {
  getDashboard: async () => {
    try {
      const response = await doctorApi.get('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error getting doctor dashboard data:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch dashboard data' };
    }
  },
  getPatients: async () => {
    try {
      const response = await doctorApi.get('/patients');
      return response.data;
    } catch (error) {
      console.error('Error getting doctor patients:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch patients' };
    }
  },
  getProfile: async () => {
    try {
      const response = await doctorApi.get('/profile');
      return response.data;
    } catch (error) {
      console.error('Error getting doctor profile:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch doctor profile' };
    }
  },
  createReport: async (reportData) => {
    try {
      const response = await doctorApi.post('/reports', reportData);
      return response.data;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error.response?.data || { success: false, message: 'Failed to create report' };
    }
  },
  getReports: async () => {
    try {
      const response = await doctorApi.get('/reports');
      return response.data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch reports' };
    }
  },
  getReportById: async (id) => {
    try {
      const response = await doctorApi.get(`/reports/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch report' };
    }
  },
  updateReportStatus: async (id, status) => {
    try {
      const response = await doctorApi.put(`/reports/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating report status:', error);
      throw error.response?.data || { success: false, message: 'Failed to update report status' };
    }
  },
  updateReport: async (id, reportData) => {
    try {
      const response = await doctorApi.put(`/reports/${id}`, reportData);
      return response.data;
    } catch (error) {
      console.error('Error updating report:', error);
      throw error.response?.data || { success: false, message: 'Failed to update report' };
    }
  },
  deleteReport: async (id) => {
    try {
      const response = await doctorApi.delete(`/reports/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error.response?.data || { success: false, message: 'Failed to delete report' };
    }
  },
  getNotifications: async () => {
    try {
      const response = await doctorApi.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch notifications' };
    }
  },
  markNotificationRead: async (id) => {
    try {
      const response = await doctorApi.put(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error.response?.data || { success: false, message: 'Failed to mark notification as read' };
    }
  },
  markAllNotificationsRead: async () => {
    try {
      const response = await doctorApi.put(`/notifications/read-all`);
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error.response?.data || { success: false, message: 'Failed to mark all notifications as read' };
    }
  }
};
