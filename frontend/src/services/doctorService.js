import axios from 'axios';

const API_URL = 'http://localhost:5000/api/doctor';

const doctorApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

doctorApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const doctorService = {
  getProfile: async () => {
    try {
      const response = await doctorApi.get('/profile');
      return response.data;
    } catch (error) {
      console.error('Error getting doctor profile:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch doctor profile' };
    }
  }
};
