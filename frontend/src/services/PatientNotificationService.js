// patientNotificationService.js -
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const notificationApi = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
notificationApi.interceptors.request.use(
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
notificationApi.interceptors.response.use(
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

export const notificationService = {
    // Get all notifications with filters
    getNotifications: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            if (filters.type) params.append('type', filters.type);
            if (filters.read !== undefined) params.append('read', filters.read);
            if (filters.limit) params.append('limit', filters.limit);
            if (filters.page) params.append('page', filters.page);
            
            const url = `/notifications${params.toString() ? `?${params.toString()}` : ''}`;
            const response = await notificationApi.get(url);
            return response.data;
        } catch (error) {
            console.error('Error in getNotifications:', error);
            throw error.response?.data || { success: false, message: 'Failed to load notifications' };
        }
    },

    // Get unread count
    getUnreadCount: async () => {
        try {
            const response = await notificationApi.get('/notifications/unread-count');
            return response.data;
        } catch (error) {
            console.error('Error in getUnreadCount:', error);
            throw error.response?.data || { success: false, message: 'Failed to get unread count' };
        }
    },

    // Mark a notification as read
    markAsRead: async (id) => {
        try {
            const response = await notificationApi.put(`/notifications/${id}/read`);
            return response.data;
        } catch (error) {
            console.error('Error in markAsRead:', error);
            throw error.response?.data || { success: false, message: 'Failed to mark as read' };
        }
    },

    // Mark all notifications as read
    markAllAsRead: async () => {
        try {
            const response = await notificationApi.put('/notifications/mark-all-read');
            return response.data;
        } catch (error) {
            console.error('Error in markAllAsRead:', error);
            throw error.response?.data || { success: false, message: 'Failed to mark all as read' };
        }
    },

    // Delete a notification
    deleteNotification: async (id) => {
        try {
            const response = await notificationApi.delete(`/notifications/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error in deleteNotification:', error);
            throw error.response?.data || { success: false, message: 'Failed to delete notification' };
        }
    },
};

export default notificationApi;