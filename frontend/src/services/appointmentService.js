import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const appointmentApi = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
appointmentApi.interceptors.request.use(
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
appointmentApi.interceptors.response.use(
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

    // Get doctors — fetch all doctors
    getDoctors: async () => {
        try {
            const response = await appointmentApi.get('/appointments/doctors');
            // console.log('getDoctors response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error in getDoctors:', error);
            throw error.response?.data || { success: false, message: 'Failed to fetch doctors' };
        }
    },

    // Get ALL appointments — receptionist / admin
    getAllAppointments: async () => {
        try {
            const response = await appointmentApi.get('/appointments/all');
            return response.data;
        } catch (error) {
            console.error('Error in getAllAppointments:', error);
            throw error.response?.data || { success: false, message: 'Failed to load appointments' };
        }
    },

    // Update appointment status — receptionist / admin
    updateAppointmentStatus: async (id, status) => {
        try {
            const response = await appointmentApi.put(`/appointments/${id}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Error in updateAppointmentStatus:', error);
            throw error.response?.data || { success: false, message: 'Failed to update status' };
        }
    },

    // Create an appointment directly — receptionist / admin
    createAppointmentByReceptionist: async (data) => {
        try {
            const response = await appointmentApi.post('/appointments/receptionist-create', data);
            return response.data;
        } catch (error) {
            console.error('Error in createAppointmentByReceptionist:', error);
            throw error.response?.data || { success: false, message: 'Failed to create appointment' };
        }
    },

    // Get appointments assigned to the logged-in doctor
    getDoctorAppointments: async () => {
        try {
            const response = await appointmentApi.get('/appointments/my-doctor-appointments');
            return response.data;
        } catch (error) {
            console.error('Error in getDoctorAppointments:', error);
            throw error.response?.data || { success: false, message: 'Failed to load doctor appointments' };
        }
    },

    // Doctor cancels an appointment
    cancelAppointmentByDoctor: async (id) => {
        try {
            const response = await appointmentApi.put(`/appointments/${id}/doctor-cancel`);
            return response.data;
        } catch (error) {
            console.error('Error in cancelAppointmentByDoctor:', error);
            throw error.response?.data || { success: false, message: 'Failed to cancel appointment' };
        }
    },

    // Get unique patients for the logged-in doctor
    getDoctorPatients: async () => {
        try {
            const response = await appointmentApi.get('/appointments/my-doctor-patients');
            return response.data;
        } catch (error) {
            console.error('Error in getDoctorPatients:', error);
            throw error.response?.data || { success: false, message: 'Failed to load doctor patients' };
        }
    },

    // Doctor marks an appointment as completed
    completeAppointmentByDoctor: async (id) => {
        try {
            const response = await appointmentApi.put(`/appointments/${id}/doctor-complete`);
            return response.data;
        } catch (error) {
            console.error('Error in completeAppointmentByDoctor:', error);
            throw error.response?.data || { success: false, message: 'Failed to complete appointment' };
        }
    },
};

export default appointmentApi;