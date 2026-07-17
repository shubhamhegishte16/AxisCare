import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const labApi = axios.create({
  baseURL: API_URL,
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

export const labAppointmentService = {
  // Get patient profile
  getPatientProfile: async () => {
    try {
      const response = await labApi.get('/patient/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to load profile' };
    }
  },

  // Book lab appointment
  bookLabAppointment: async (data) => {
    try {
      const response = await labApi.post('/lab-appointments/book', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to book appointment' };
    }
  },
};

export default labApi;