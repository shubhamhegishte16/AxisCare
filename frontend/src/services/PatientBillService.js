import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

billApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const billService = {
  // Get all bills for the logged-in patient
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
      throw error.response?.data || { success: false, message: 'Failed to load bills' };
    }
  },

  // Get bill details
  getBillDetails: async (id) => {
    try {
      const response = await billApi.get(`/bills/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to load bill details' };
    }
  },

  // Get bill stats
  getBillStats: async () => {
    try {
      const response = await billApi.get('/bills/patient/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to load bill stats' };
    }
  },

  // Pay a bill
  payBill: async (id, paymentMethod) => {
    try {
      const response = await billApi.put(`/bills/${id}/pay`, { paymentMethod });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to pay bill' };
    }
  },

  // Download bill PDF
  downloadBill: async (id) => {
    try {
      const response = await billApi.get(`/bills/${id}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to download bill' };
    }
  },
};

export default billApi;