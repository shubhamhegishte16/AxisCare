import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const appointmentApi = axios.create({ baseURL: API_URL, withCredentials: true });
appointmentApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);
appointmentApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (!window.location.pathname.includes('/login')) window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export const appointmentService = {
  // Book a new appointment (supports file upload via FormData)
  bookAppointment: async (formData) => {
    try {
      const response = await appointmentApi.post('/appointments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error in bookAppointment:', error);
      throw error.response?.data || { success: false, message: 'Failed to book appointment' };
    }
  },
  // Get all appointments for the logged-in patient
  getMyAppointments: async () => {
    try {
      const response = await appointmentApi.get('/appointments/mine');
      return response.data;
    } catch (error) {
      console.error('Error in getMyAppointments:', error);
      throw error.response?.data || { success: false, message: 'Failed to load appointments' };
    }
  },
  // Cancel a patient's own appointment
  cancelAppointment: async (id) => {
    try {
      const response = await appointmentApi.put(`/appointments/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error in cancelAppointment:', error);
      throw error.response?.data || { success: false, message: 'Failed to cancel appointment' };
    }
  },
  // Get doctors — optionally filtered by department
  getDoctors: async (department = '') => {
    try {
      const params = department ? { department } : {};
      const response = await appointmentApi.get('/appointments/doctors', { params });
      return response.data;
    } catch (error) {
      console.error('Error in getDoctors:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch doctors' };
    }
  },
};
export default appointmentApi;
