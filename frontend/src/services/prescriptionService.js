import axios from 'axios';
import { API_URL } from '../config/api';

const prescriptionApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

prescriptionApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const prescriptionService = {
  createPrescription: async (data) => {
    try {
      const response = await prescriptionApi.post('/prescriptions', data);
      return response.data;
    } catch (error) {
      console.error('Error creating prescription:', error);
      throw error.response?.data || { success: false, message: 'Failed to create prescription' };
    }
  },

  getDoctorPrescriptions: async () => {
    try {
      const response = await prescriptionApi.get('/prescriptions/my-prescriptions');
      return response.data;
    } catch (error) {
      console.error('Error getting prescriptions:', error);
      throw error.response?.data || { success: false, message: 'Failed to get prescriptions' };
    }
  },

  updatePrescriptionStatus: async (id, status) => {
    try {
      const response = await prescriptionApi.put(`/prescriptions/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating prescription status:', error);
      throw error.response?.data || { success: false, message: 'Failed to update prescription status' };
    }
  },

  deletePrescription: async (id) => {
    try {
      const response = await prescriptionApi.delete(`/prescriptions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting prescription:', error);
      throw error.response?.data || { success: false, message: 'Failed to delete prescription' };
    }
  }
};
