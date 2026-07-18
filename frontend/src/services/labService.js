import axios from 'axios';

const labApi = axios.create({
  baseURL: 'http://localhost:5000/api/laboratory',
  withCredentials: true,
});

export const labService = {
  // Get all test requests
  getRequests: async (status = '') => {
    try {
      const response = await labApi.get('/requests', {
        params: { status }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching lab requests:', error);
      throw error;
    }
  },

  // Update a test request status
  updateRequestStatus: async (id, status) => {
    try {
      const response = await labApi.put(`/requests/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating lab request status:', error);
      throw error;
    }
  },

  // Get statistics
  getStats: async () => {
    try {
      const response = await labApi.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching lab stats:', error);
      throw error;
    }
  },

  // Get single request by ID
  getRequestById: async (id) => {
    try {
      const response = await labApi.get(`/requests/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lab request details:', error);
      throw error;
    }
  },

  // Complete a test request with results
  completeRequest: async (id, testResults) => {
    try {
      const response = await labApi.put(`/requests/${id}/complete`, { testResults });
      return response.data;
    } catch (error) {
      console.error('Error completing lab request:', error);
      throw error;
    }
  }
};
