import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const medicalApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

medicalApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

medicalApi.interceptors.response.use(
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

export const medicalService = {
  // Dashboard
  getDashboard: async () => {
    try {
      const response = await medicalApi.get('/medical/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error in getDashboard:', error);
      // Return empty data instead of throwing
      return { 
        success: false, 
        data: { 
          vitals: {}, 
          patient: {}, 
          stats: {} 
        } 
      };
    }
  },

  // Vitals
  getVitals: async () => {
    try {
      const response = await medicalApi.get('/medical/vitals');
      return response.data;
    } catch (error) {
      console.error('Error in getVitals:', error);
      return { success: false, data: {} };
    }
  },

  // Visits
  getVisits: async (page = 1, limit = 50) => {
    try {
      const response = await medicalApi.get(`/medical/visits?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error in getVisits:', error);
      return { success: false, data: [], count: 0, total: 0 };
    }
  },

  getVisitDetails: async (id) => {
    try {
      const response = await medicalApi.get(`/medical/visits/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getVisitDetails:', error);
      return { success: false, data: null };
    }
  },

  // Consultations
  getConsultations: async (page = 1, limit = 50) => {
    try {
      const response = await medicalApi.get(`/medical/consultations?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error in getConsultations:', error);
      return { success: false, data: [], count: 0, total: 0 };
    }
  },

  getConsultationDetails: async (id) => {
    try {
      const response = await medicalApi.get(`/medical/consultations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getConsultationDetails:', error);
      return { success: false, data: null };
    }
  },

  // Lab Tests
  getLabTests: async (page = 1, limit = 50) => {
    try {
      const response = await medicalApi.get(`/medical/lab-tests?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error in getLabTests:', error);
      return { success: false, data: [], count: 0, total: 0 };
    }
  },

  getLabTestDetails: async (id) => {
    try {
      const response = await medicalApi.get(`/medical/lab-tests/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getLabTestDetails:', error);
      return { success: false, data: null };
    }
  },

  // Medications
  getMedications: async (page = 1, limit = 50) => {
    try {
      const response = await medicalApi.get(`/medical/medications?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error in getMedications:', error);
      return { success: false, data: [], count: 0, total: 0 };
    }
  },

  getMedicationBill: async (id) => {
    try {
      const response = await medicalApi.get(`/medical/medications/${id}/bill`);
      return response.data;
    } catch (error) {
      console.error('Error in getMedicationBill:', error);
      return { success: false, data: null };
    }
  },

  purchaseMedication: async (id, billId) => {
    try {
      const response = await medicalApi.put(`/medical/medications/${id}/purchase`, { billId });
      return response.data;
    } catch (error) {
      console.error('Error in purchaseMedication:', error);
      return { success: false, message: 'Failed to purchase medication' };
    }
  },
};

export default medicalApi;