import axios from 'axios';
import { API_URL } from '../config/api';

const pharmacyApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

pharmacyApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const pharmacyService = {
  // Create order from prescription
  createOrder: async (data) => {
    try {
      const response = await pharmacyApi.post('/pharmacy/orders', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to create order' };
    }
  },

  // Get pharmacy inventory
  getInventory: async () => {
    try {
      const response = await pharmacyApi.get('/pharmacy/inventory');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to load inventory' };
    }
  },
};

export default pharmacyApi;
