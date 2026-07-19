// services/PatientBillService.js
import axios from 'axios';
import { API_URL } from '../config/api';

const billApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

billApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const billService = {
  getMyBills: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.page) params.append('page', filters.page);
      
      const url = `/bills/patient${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await billApi.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching bills:', error);
      throw error.response?.data || { success: false, message: 'Failed to load bills' };
    }
  },

  getBillDetails: async (id) => {
    try {
      const response = await billApi.get(`/bills/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bill details:', error);
      throw error.response?.data || { success: false, message: 'Failed to load bill details' };
    }
  },

  getBillStats: async () => {
    try {
      const response = await billApi.get('/bills/patient/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching bill stats:', error);
      throw error.response?.data || { success: false, message: 'Failed to load bill stats' };
    }
  },

  payBill: async (id, paymentMethod) => {
    try {
      const response = await billApi.put(`/bills/${id}/pay`, { paymentMethod });
      return response.data;
    } catch (error) {
      console.error('Error paying bill:', error);
      throw error.response?.data || { success: false, message: 'Failed to pay bill' };
    }
  },

  downloadBill: async (id) => {
    try {
      const response = await billApi.get(`/bills/${id}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading bill:', error);
      throw error.response?.data || { success: false, message: 'Failed to download bill' };
    }
  },
};

export default billApi;
