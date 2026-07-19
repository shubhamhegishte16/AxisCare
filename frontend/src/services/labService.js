import axios from 'axios';
import { apiUrl } from '../config/api';

const labApi = axios.create({
  baseURL: apiUrl('/laboratory'),
  withCredentials: true,
});

labApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const labService = {
  getDashboard: async () => {
    try {
      const response = await labApi.get('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching lab dashboard:', error);
      throw error;
    }
  },

  // Get all test requests
  getRequests: async (status = '') => {
    try {
      const response = await labApi.get('/requests', {
        params: { status }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching lab requests:', error);
      throw error;
    }
  },

  // Update a test request status
  updateRequestStatus: async (id, status) => {
    try {
      const response = await labApi.put(`/requests/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating lab request status:', error);
      throw error;
    }
  },

  // Get statistics
  getStats: async () => {
    try {
      const response = await labApi.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching lab stats:', error);
      throw error;
    }
  },

  // Get completed lab results
  getResults: async (params = {}) => {
    try {
      const response = await labApi.get('/results', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching lab results:', error);
      throw error;
    }
  },

  // Get lab settings/profile
  getSettings: async () => {
    try {
      const response = await labApi.get('/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching lab settings:', error);
      throw error;
    }
  },

  updateSettingsProfile: async (profile) => {
    try {
      const response = await labApi.put('/settings/profile', profile);
      return response.data;
    } catch (error) {
      console.error('Error updating lab profile:', error);
      throw error;
    }
  },

  updateNotificationSettings: async (notifications) => {
    try {
      const response = await labApi.put('/settings/notifications', notifications);
      return response.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  },

  updateLabPreferences: async (preferences) => {
    try {
      const response = await labApi.put('/settings/preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating lab preferences:', error);
      throw error;
    }
  },

  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await labApi.post('/settings/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading lab avatar:', error);
      throw error;
    }
  },

  changePassword: async (payload) => {
    try {
      const response = await labApi.put('/settings/change-password', payload);
      return response.data;
    } catch (error) {
      console.error('Error changing lab password:', error);
      throw error;
    }
  },

  getNotifications: async (params = {}) => {
    try {
      const response = await labApi.get('/notifications', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching lab notifications:', error);
      throw error;
    }
  },

  markNotificationRead: async (id) => {
    try {
      const response = await labApi.put(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking lab notification read:', error);
      throw error;
    }
  },

  markAllNotificationsRead: async () => {
    try {
      const response = await labApi.put('/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Error marking all lab notifications read:', error);
      throw error;
    }
  },

  deleteNotification: async (id) => {
    try {
      const response = await labApi.delete(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting lab notification:', error);
      throw error;
    }
  },

  // Get single request by ID
  getRequestById: async (id) => {
    try {
      const response = await labApi.get(`/requests/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lab request details:', error);
      throw error;
    }
  },

  // Complete a test request with results
  completeRequest: async (id, testResults) => {
    try {
      const response = await labApi.put(`/requests/${id}/complete`, { testResults });
      return response.data;
    } catch (error) {
      console.error('Error completing lab request:', error);
      throw error;
    }
  }
};
