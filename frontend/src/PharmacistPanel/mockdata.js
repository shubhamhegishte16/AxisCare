// Mock data for the Pharmacist module.
// TODO: replace every export here with real API calls once the backend is ready.

export const dashboardStats = {
  totalMedicines: 2145,
  lowStock: 18,
  outOfStock: 4,
  todaysPrescriptions: 41,
  pendingPrescriptions: 36,
  salesToday: 28500,
  revenueToday: 28500,
  expiringMedicines: 9,
};

export const weeklySales = [
  { day: 'Mon', sales: 18200 },
  { day: 'Tue', sales: 21500 },
  { day: 'Wed', sales: 19800 },
  { day: 'Thu', sales: 24300 },
  { day: 'Fri', sales: 27100 },
  { day: 'Sat', sales: 31200 },
  { day: 'Sun', sales: 28500 },
];

export const categoryDistribution = [
  { name: 'Pain Reliever', value: 32, color: '#3B82F6' },
  { name: 'Antibiotics', value: 24, color: '#00B9D6' },
  { name: 'Allergy', value: 16, color: '#F59E0B' },
  { name: 'Diabetes', value: 14, color: '#10B981' },
  { name: 'Others', value: 14, color: '#D1D5DB' },
];

export const monthlyRevenue = [
  { month: 'Feb', revenue: 410000 },
  { month: 'Mar', revenue: 452000 },
  { month: 'Apr', revenue: 398000 },
  { month: 'May', revenue: 476000 },
  { month: 'Jun', revenue: 512000 },
  { month: 'Jul', revenue: 498000 },
];

export const todaysPrescriptionRequests = [
  { id: 'RX-1042', patient: 'Rushan Kamble', doctor: 'Dr. Kamble', date: '15 Jul 2026', status: 'Pending' },
  { id: 'RX-1043', patient: 'Swar Darekar', doctor: 'Dr. Darekar', date: '15 Jul 2026', status: 'Pending' },
  { id: 'RX-1044', patient: 'Shubham Hegishte', doctor: 'Dr. Heghiste', date: '15 Jul 2026', status: 'Pending' },
  { id: 'RX-1045', patient: 'Vinaya Patole', doctor: 'Dr. Silviera', date: '14 Jul 2026', status: 'Cancelled' },
  { id: 'RX-1046', patient: 'Elijah Silviera', doctor: 'Dr. Patole', date: '14 Jul 2026', status: 'Pending' },
  { id: 'RX-1047', patient: 'Neha Patil', doctor: 'Dr. Kamble', date: '14 Jul 2026', status: 'Completed' },
];

export const prescriptionMedicines = {
  'RX-1042': [
    { name: 'Paracetamol', dosage: '500mg', qty: 10, frequency: '1-0-1', duration: '5 days' },
    { name: 'Amoxicillin', dosage: '500mg', qty: 15, frequency: '1-1-1', duration: '5 days' },
  ],
  'RX-1043': [
    { name: 'Cetirizine', dosage: '10mg', qty: 10, frequency: '0-0-1', duration: '10 days' },
  ],
};

export const inventoryOverview = [
  { medicine: 'Paracetamol 500mg', category: 'Pain reliever', available: 520, expiry: 'Dec 2027', status: 'In Stock' },
  { medicine: 'Crocin 650mg', category: 'Pain reliever', available: 340, expiry: 'Nov 2027', status: 'In Stock' },
  { medicine: 'Amoxicillin 500mg', category: 'Antibiotics', available: 210, expiry: 'Jun 2027', status: 'In Stock' },
  { medicine: 'Bilastine 500mg', category: 'Allergy', available: 45, expiry: 'Mar 2027', status: 'In Stock' },
  { medicine: 'Insulin 40mg', category: 'Diabetes', available: 0, expiry: 'Aug 2027', status: 'No Stock' },
];

export const medicinesList = [
  { id: 'MED-001', name: 'Paracetamol 500mg', category: 'Pain reliever', batch: 'B-2201', expiry: '12 Dec 2027', stock: 520, price: 12, supplier: 'MedLife Supplies', status: 'In Stock' },
  { id: 'MED-002', name: 'Crocin 650mg', category: 'Pain reliever', batch: 'B-2210', expiry: '05 Nov 2027', stock: 340, price: 18, supplier: 'MedLife Supplies', status: 'In Stock' },
  { id: 'MED-003', name: 'Amoxicillin 500mg', category: 'Antibiotics', batch: 'B-1987', expiry: '30 Jun 2027', stock: 210, price: 45, supplier: 'PharmaPlus', status: 'In Stock' },
  { id: 'MED-004', name: 'Bilastine 500mg', category: 'Allergy', batch: 'B-2043', expiry: '18 Mar 2027', stock: 45, price: 62, supplier: 'Health First Distributors', status: 'Low Stock' },
  { id: 'MED-005', name: 'Insulin 40mg', category: 'Diabetes', batch: 'B-1876', expiry: '22 Aug 2027', stock: 0, price: 210, supplier: 'PharmaPlus', status: 'Out of Stock' },
  { id: 'MED-006', name: 'Azithromycin 250mg', category: 'Antibiotics', batch: 'B-2099', expiry: '02 Sep 2026', stock: 60, price: 95, supplier: 'MedLife Supplies', status: 'Expiring Soon' },
  { id: 'MED-007', name: 'Metformin 500mg', category: 'Diabetes', batch: 'B-2118', expiry: '14 Jan 2028', stock: 480, price: 22, supplier: 'Health First Distributors', status: 'In Stock' },
  { id: 'MED-008', name: 'Cetirizine 10mg', category: 'Allergy', batch: 'B-2067', expiry: '09 Oct 2027', stock: 300, price: 15, supplier: 'PharmaPlus', status: 'In Stock' },
];

export const purchaseOrders = [
  { id: 'PO-3001', supplier: 'MedLife Supplies', date: '10 Jul 2026', amount: 84500, status: 'Delivered' },
  { id: 'PO-3002', supplier: 'PharmaPlus', date: '11 Jul 2026', amount: 42200, status: 'Pending' },
  { id: 'PO-3003', supplier: 'Health First Distributors', date: '12 Jul 2026', amount: 65800, status: 'Pending' },
  { id: 'PO-3004', supplier: 'MedLife Supplies', date: '08 Jul 2026', amount: 31200, status: 'Cancelled' },
  { id: 'PO-3005', supplier: 'PharmaPlus', date: '13 Jul 2026', amount: 57600, status: 'Delivered' },
];

export const suppliers = [
  { id: 'SUP-01', name: 'MedLife Supplies', contact: '+91 98765 43210', email: 'contact@medlife.com', medicines: 128, orders: 42, status: 'Active' },
  { id: 'SUP-02', name: 'PharmaPlus', contact: '+91 91234 56780', email: 'sales@pharmaplus.com', medicines: 96, orders: 31, status: 'Active' },
  { id: 'SUP-03', name: 'Health First Distributors', contact: '+91 90000 11223', email: 'info@healthfirst.com', medicines: 74, orders: 19, status: 'Pending' },
  { id: 'SUP-04', name: 'Nova Pharma Traders', contact: '+91 88990 22110', email: 'hello@novapharma.com', medicines: 52, orders: 12, status: 'Inactive' },
];

export const bills = [
  { id: 'BILL-9001', patient: 'Rushan Kamble', date: '15 Jul 2026', amount: 640, status: 'Paid' },
  { id: 'BILL-9002', patient: 'Swar Darekar', date: '15 Jul 2026', amount: 1120, status: 'Paid' },
  { id: 'BILL-9003', patient: 'Neha Patil', date: '14 Jul 2026', amount: 380, status: 'Pending' },
  { id: 'BILL-9004', patient: 'Elijah Silviera', date: '14 Jul 2026', amount: 960, status: 'Paid' },
];

export const notifications = [
  { id: 1, type: 'New Prescription', text: 'New prescription received from Dr. Kamble for Rushan Kamble', time: '5 min ago', read: false },
  { id: 2, type: 'Low Stock Alert', text: 'Bilastine 500mg is running low (45 units left)', time: '1 hr ago', read: false },
  { id: 3, type: 'Purchase Delivered', text: 'Purchase order PO-3001 from MedLife Supplies has been delivered', time: '3 hr ago', read: true },
  { id: 4, type: 'Medicine Expiring', text: 'Azithromycin 250mg is expiring on 02 Sep 2026', time: '5 hr ago', read: true },
  { id: 5, type: 'Bill Generated', text: 'Bill BILL-9004 generated for Elijah Silviera', time: '1 day ago', read: true },
];

export const topSellingMedicines = [
  { name: 'Paracetamol 500mg', sold: 1240 },
  { name: 'Crocin 650mg', sold: 980 },
  { name: 'Amoxicillin 500mg', sold: 760 },
  { name: 'Cetirizine 10mg', sold: 610 },
  { name: 'Metformin 500mg', sold: 540 },
];

export const activityTimeline = [
  { text: 'Prescription RX-1042 dispensed for Rushan Kamble', time: '10 min ago' },
  { text: 'Added new medicine — Azithromycin 250mg', time: '45 min ago' },
  { text: 'Stock updated for Bilastine 500mg', time: '2 hr ago' },
  { text: 'Purchase order PO-3001 marked as delivered', time: '4 hr ago' },
];