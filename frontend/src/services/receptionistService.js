import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const receptionistApi = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
receptionistApi.interceptors.request.use(
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
receptionistApi.interceptors.response.use(
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

export const receptionistService = {
    // Register a new patient from the front desk
    registerPatient: async (formData) => {
        try {
            const response = await receptionistApi.post('/receptionist/register-patient', formData);
            return response.data;
        } catch (error) {
            console.error('Error in registerPatient:', error);
            throw error.response?.data || { success: false, message: 'Failed to register patient' };
        }
    },

    // Walk-in queue
    getQueue: async () => {
        try {
            const response = await receptionistApi.get('/receptionist/walk-in-queue');
            return response.data;
        } catch (error) {
            console.error('Error in getQueue:', error);
            throw error.response?.data || { success: false, message: 'Failed to load queue' };
        }
    },

    addToQueue: async (entry) => {
        try {
            const response = await receptionistApi.post('/receptionist/walk-in-queue', entry);
            return response.data;
        } catch (error) {
            console.error('Error in addToQueue:', error);
            throw error.response?.data || { success: false, message: 'Failed to add to queue' };
        }
    },

    updateQueueStatus: async (id, status) => {
        try {
            const response = await receptionistApi.put(`/receptionist/walk-in-queue/${id}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Error in updateQueueStatus:', error);
            throw error.response?.data || { success: false, message: 'Failed to update queue status' };
        }
    },

    // Billing
    getInvoices: async () => {
        try {
            const response = await receptionistApi.get('/receptionist/billing');
            return response.data;
        } catch (error) {
            console.error('Error in getInvoices:', error);
            throw error.response?.data || { success: false, message: 'Failed to load invoices' };
        }
    },

    createInvoice: async (invoice) => {
        try {
            const response = await receptionistApi.post('/receptionist/billing', invoice);
            return response.data;
        } catch (error) {
            console.error('Error in createInvoice:', error);
            throw error.response?.data || { success: false, message: 'Failed to create invoice' };
        }
    },

    updateInvoiceStatus: async (id, status, method) => {
        try {
            const response = await receptionistApi.put(`/receptionist/billing/${id}/status`, { status, method });
            return response.data;
        } catch (error) {
            console.error('Error in updateInvoiceStatus:', error);
            throw error.response?.data || { success: false, message: 'Failed to update invoice' };
        }
    },

    // Reports
    getReportsSummary: async () => {
        try {
            const response = await receptionistApi.get('/receptionist/reports/summary');
            return response.data;
        } catch (error) {
            console.error('Error in getReportsSummary:', error);
            throw error.response?.data || { success: false, message: 'Failed to load reports' };
        }
    },
};

export default receptionistApi;
