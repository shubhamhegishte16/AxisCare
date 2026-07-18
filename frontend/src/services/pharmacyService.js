import axios from 'axios';

const API_URL = 'http://localhost:5000/api' || 'http://localhost:5000/api/pharmacy';

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

const handle = async (promise, fallbackMessage) => {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: fallbackMessage };
  }
};

export const pharmacyService = {
  // PATIENT ORDER ROUTES
  checkMedicineAvailability: async (medicines) => {
    try {
      // console.log('Checking medicine availability:', medicines);
      const response = await pharmacyApi.post('/pharmacy/patient/check-availability', { medicines });
      // console.log('Availability check response:', response.data);
      return response.data;
    } catch (error) {
      // console.error('Error in checkMedicineAvailability:', error);
      throw error.response?.data || { success: false, message: 'Failed to check availability' };
    }
  },

  // Create order from prescription
  createOrderFromPrescription: async (data) => {
    try {
      // console.log('Creating order from prescription:', data);
      const response = await pharmacyApi.post('/pharmacy/patient/create', data);
      // console.log('Order created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in createOrderFromPrescription:', error);
      throw error.response?.data || { success: false, message: 'Failed to create order' };
    }
  },

  // Get patient orders
  getPatientOrders: async () => {
    try {
      const response = await pharmacyApi.get('/pharmacy/patient/orders');
      return response.data;
    } catch (error) {
      console.error('Error in getPatientOrders:', error);
      throw error.response?.data || { success: false, message: 'Failed to fetch orders' };
    }
  },

  // Pharmacy module
  // Dashboard
  getDashboard: () => handle(pharmacyApi.get('/dashboard'), 'Failed to fetch dashboard data'),

  // Reports
  getReports: () => handle(pharmacyApi.get('/reports'), 'Failed to fetch reports data'),

  // Medicines / Inventory
  getMedicines: (params) => handle(pharmacyApi.get('/medicines', { params }), 'Failed to fetch medicines'),
  getMedicineStats: () => handle(pharmacyApi.get('/medicines/stats'), 'Failed to fetch medicine stats'),
  getInventoryStats: () => handle(pharmacyApi.get('/medicines/inventory-stats'), 'Failed to fetch inventory stats'),
  getMedicineById: (id) => handle(pharmacyApi.get(`/medicines/${id}`), 'Failed to fetch medicine'),
  createMedicine: (data) => handle(pharmacyApi.post('/medicines', data), 'Failed to add medicine'),
  updateMedicine: (id, data) => handle(pharmacyApi.put(`/medicines/${id}`, data), 'Failed to update medicine'),
  deleteMedicine: (id) => handle(pharmacyApi.delete(`/medicines/${id}`), 'Failed to delete medicine'),
  adjustStock: (id, type, amount) =>
    handle(pharmacyApi.put(`/medicines/${id}/adjust-stock`, { type, amount }), 'Failed to adjust stock'),

  // Suppliers
  getSuppliers: (params) => handle(pharmacyApi.get('/suppliers', { params }), 'Failed to fetch suppliers'),
  getSupplierStats: () => handle(pharmacyApi.get('/suppliers/stats'), 'Failed to fetch supplier stats'),
  createSupplier: (data) => handle(pharmacyApi.post('/suppliers', data), 'Failed to add supplier'),
  updateSupplier: (id, data) => handle(pharmacyApi.put(`/suppliers/${id}`, data), 'Failed to update supplier'),
  deleteSupplier: (id) => handle(pharmacyApi.delete(`/suppliers/${id}`), 'Failed to delete supplier'),

  // Orders
  getOrders: (params) => handle(pharmacyApi.get('/orders', { params }), 'Failed to fetch orders'),
  getOrderStats: () => handle(pharmacyApi.get('/orders/stats'), 'Failed to fetch order stats'),
  createOrder: (data) => handle(pharmacyApi.post('/orders', data), 'Failed to place order'),
  updateOrderStatus: (id, status) =>
    handle(pharmacyApi.put(`/orders/${id}/status`, { status }), 'Failed to update order status'),

  // Billing
  getBills: (params) => handle(pharmacyApi.get('/billing', { params }), 'Failed to fetch bills'),
  getBillingStats: () => handle(pharmacyApi.get('/billing/stats'), 'Failed to fetch billing stats'),
  createBill: (data) => handle(pharmacyApi.post('/billing', data), 'Failed to create bill'),
  markBillPaid: (id) => handle(pharmacyApi.put(`/billing/${id}/mark-paid`), 'Failed to mark bill as paid'),

  // Prescriptions
  getPrescriptions: (params) => handle(pharmacyApi.get('/prescriptions', { params }), 'Failed to fetch prescriptions'),
  getPrescriptionStats: () => handle(pharmacyApi.get('/prescriptions/stats'), 'Failed to fetch prescription stats'),
  getPrescriptionById: (id) => handle(pharmacyApi.get(`/prescriptions/${id}`), 'Failed to fetch prescription'),
  updatePrescriptionStatus: (id, status) =>
    handle(pharmacyApi.put(`/prescriptions/${id}/status`, { status }), 'Failed to update prescription status'),

  // Notifications
  getNotifications: () => handle(pharmacyApi.get('/notifications'), 'Failed to fetch notifications'),
  markNotificationRead: (id) => handle(pharmacyApi.put(`/notifications/${id}/read`), 'Failed to mark notification as read'),
  markAllNotificationsRead: () => handle(pharmacyApi.put('/notifications/mark-all-read'), 'Failed to mark all as read'),
};

export default pharmacyApi;