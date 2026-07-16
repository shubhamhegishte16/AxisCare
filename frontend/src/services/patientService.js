import axios from 'axios';

// For Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with interceptors
const patientApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
patientApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
patientApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Create the patient service object
export const patientService = {
  // Get or create patient profile
  getOrCreateProfile: async () => {
    try {
      const response = await patientApi.get('/patient/profile');
      return response.data;
    } catch (error) {
      console.error('Error in getOrCreateProfile:', error);
      throw error.response?.data || { success: false, message: 'Failed to load profile' };
    }
  },

  // Get patient profile
  getProfile: async () => {
    try {
      const response = await patientApi.get('/patient/me');
      return response.data;
    } catch (error) {
      console.error('Error in getProfile:', error);
      throw error.response?.data || { success: false, message: 'Failed to get profile' };
    }
  },

  // Update patient profile
  updateProfile: async (data) => {
    try {
      const response = await patientApi.put('/patient/profile', data);
      return response.data;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error.response?.data || { success: false, message: 'Failed to update profile' };
    }
  },

  // Update insurance information
  updateInsurance: async (data) => {
    try {
      const response = await patientApi.put('/patient/insurance', data);
      return response.data;
    } catch (error) {
      console.error('Error in updateInsurance:', error);
      throw error.response?.data || { success: false, message: 'Failed to update insurance' };
    }
  },

  // Update emergency contacts
  updateEmergencyContacts: async (contacts) => {
    try {
      const response = await patientApi.put('/patient/emergency-contacts', {
        emergencyContacts: contacts,
      });
      return response.data;
    } catch (error) {
      console.error('Error in updateEmergencyContacts:', error);
      throw error.response?.data || { success: false, message: 'Failed to update emergency contacts' };
    }
  },

  // Update password
  updatePassword: async (data) => {
    try {
      const response = await patientApi.put('/patient/update-password', data);
      return response.data;
    } catch (error) {
      console.error('Error in updatePassword:', error);
      throw error.response?.data || { success: false, message: 'Failed to update password' };
    }
  },
};

// Also export the api instance as default
export default patientApi;