// Placeholder data for the Admin Panel frontend.
// Replace each of these with real API calls once the admin backend is built.

export const dashboardStats = {
  totalUsers: 1284,
  totalDoctors: 42,
  totalPatients: 1156,
  appointmentsToday: 37,
  pendingApprovals: 5,
  revenueThisMonth: 482300,
};

export const userGrowth = [
  { month: 'Feb', users: 780 },
  { month: 'Mar', users: 860 },
  { month: 'Apr', users: 910 },
  { month: 'May', users: 990 },
  { month: 'Jun', users: 1120 },
  { month: 'Jul', users: 1284 },
];

export const roleDistribution = [
  { name: 'Patients', value: 1156, color: '#3B82F6' },
  { name: 'Doctors', value: 42, color: '#10B981' },
  { name: 'Receptionists', value: 12, color: '#F59E0B' },
  { name: 'Pharmacists', value: 9, color: '#8B5CF6' },
  { name: 'Lab Staff', value: 8, color: '#EC4899' },
  { name: 'Admins', value: 3, color: '#6B7280' },
];

export const departmentLoad = [
  { department: 'Cardiology', appointments: 62 },
  { department: 'Orthopedics', appointments: 48 },
  { department: 'Pediatrics', appointments: 55 },
  { department: 'Neurology', appointments: 34 },
  { department: 'Dermatology', appointments: 29 },
  { department: 'General', appointments: 71 },
];

export const recentActivity = [
  { text: 'Dr. Meera Shah was added to Cardiology', time: '10 minutes ago' },
  { text: 'New patient registration: Rohan Kulkarni', time: '32 minutes ago' },
  { text: 'Appointment #APT-2291 marked Completed', time: '1 hour ago' },
  { text: 'Pharmacist Aditi Verma updated inventory', time: '2 hours ago' },
  { text: 'Department "Oncology" was created', time: 'Yesterday' },
];

export const pendingApprovalsList = [
  { id: 'REQ-101', name: 'Dr. Kabir Anand', role: 'doctor', department: 'Neurology', date: '17 Jul 2026' },
  { id: 'REQ-102', name: 'Sana Iyer', role: 'receptionist', department: 'Front Desk', date: '17 Jul 2026' },
  { id: 'REQ-103', name: 'Rohit Malhotra', role: 'laboratory', department: 'Pathology', date: '16 Jul 2026' },
];

export const users = [
  { id: 'USR-001', name: 'Dr. Arjun Mehta', email: 'arjun.mehta@axiscare.com', phone: '9876543210', role: 'doctor', department: 'Cardiology', status: 'Active', joined: '12 Jan 2025' },
  { id: 'USR-002', name: 'Priya Nair', email: 'priya.nair@axiscare.com', phone: '9876543211', role: 'receptionist', department: 'Front Desk', status: 'Active', joined: '03 Mar 2025' },
  { id: 'USR-003', name: 'Rohan Kulkarni', email: 'rohan.k@example.com', phone: '9876543212', role: 'patient', department: '-', status: 'Active', joined: '15 Jul 2026' },
  { id: 'USR-004', name: 'Aditi Verma', email: 'aditi.verma@axiscare.com', phone: '9876543213', role: 'pharmacist', department: 'Pharmacy', status: 'Active', joined: '20 Feb 2025' },
  { id: 'USR-005', name: 'Karan Suri', email: 'karan.suri@axiscare.com', phone: '9876543214', role: 'laboratory', department: 'Pathology', status: 'Inactive', joined: '11 Nov 2024' },
  { id: 'USR-006', name: 'Dr. Neha Kapoor', email: 'neha.kapoor@axiscare.com', phone: '9876543215', role: 'doctor', department: 'Pediatrics', status: 'Active', joined: '05 May 2025' },
  { id: 'USR-007', name: 'Vikram Rathi', email: 'vikram.rathi@example.com', phone: '9876543216', role: 'patient', department: '-', status: 'Suspended', joined: '22 Jun 2026' },
];

export const doctors = [
  { id: 'DOC-001', name: 'Dr. Arjun Mehta', specialization: 'Cardiologist', department: 'Cardiology', experience: '12 yrs', status: 'On Duty', patients: 214, rating: 4.8 },
  { id: 'DOC-002', name: 'Dr. Neha Kapoor', specialization: 'Pediatrician', department: 'Pediatrics', experience: '8 yrs', status: 'On Duty', patients: 178, rating: 4.9 },
  { id: 'DOC-003', name: 'Dr. Sameer Joshi', specialization: 'Orthopedic Surgeon', department: 'Orthopedics', experience: '15 yrs', status: 'On Leave', patients: 302, rating: 4.7 },
  { id: 'DOC-004', name: 'Dr. Ritu Malhotra', specialization: 'Dermatologist', department: 'Dermatology', experience: '6 yrs', status: 'Off Duty', patients: 96, rating: 4.6 },
];

export const patients = [
  { id: 'PAT-001', name: 'Rohan Kulkarni', email: 'rohan.k@example.com', phone: '9876543212', age: 29, gender: 'Male', lastVisit: '15 Jul 2026', totalVisits: 3 },
  { id: 'PAT-002', name: 'Ishita Bose', email: 'ishita.b@example.com', phone: '9876543220', age: 34, gender: 'Female', lastVisit: '10 Jul 2026', totalVisits: 7 },
  { id: 'PAT-003', name: 'Vikram Rathi', email: 'vikram.rathi@example.com', phone: '9876543216', age: 45, gender: 'Male', lastVisit: '22 Jun 2026', totalVisits: 1 },
  { id: 'PAT-004', name: 'Ananya Desai', email: 'ananya.d@example.com', phone: '9876543221', age: 51, gender: 'Female', lastVisit: '28 Jun 2026', totalVisits: 12 },
];

export const appointments = [
  { id: 'APT-2291', patient: 'Rohan Kulkarni', doctor: 'Dr. Arjun Mehta', department: 'Cardiology', date: '18 Jul 2026', time: '10:30 AM', type: 'In-Person', status: 'Completed' },
  { id: 'APT-2292', patient: 'Ishita Bose', doctor: 'Dr. Neha Kapoor', department: 'Pediatrics', date: '18 Jul 2026', time: '11:15 AM', type: 'Video Consult', status: 'Scheduled' },
  { id: 'APT-2293', patient: 'Vikram Rathi', doctor: 'Dr. Sameer Joshi', department: 'Orthopedics', date: '18 Jul 2026', time: '02:00 PM', type: 'In-Person', status: 'Pending' },
  { id: 'APT-2294', patient: 'Ananya Desai', doctor: 'Dr. Ritu Malhotra', department: 'Dermatology', date: '17 Jul 2026', time: '09:00 AM', type: 'In-Person', status: 'Cancelled' },
];

export const departments = [
  { id: 'DEP-001', name: 'Cardiology', head: 'Dr. Arjun Mehta', doctors: 6, staff: 14, status: 'Active' },
  { id: 'DEP-002', name: 'Pediatrics', head: 'Dr. Neha Kapoor', doctors: 5, staff: 11, status: 'Active' },
  { id: 'DEP-003', name: 'Orthopedics', head: 'Dr. Sameer Joshi', doctors: 4, staff: 9, status: 'Active' },
  { id: 'DEP-004', name: 'Dermatology', head: 'Dr. Ritu Malhotra', doctors: 3, staff: 6, status: 'Active' },
  { id: 'DEP-005', name: 'Oncology', head: 'Unassigned', doctors: 0, staff: 0, status: 'Inactive' },
];

export const pharmacySnapshot = {
  totalMedicines: 486,
  lowStock: 14,
  pendingPrescriptions: 9,
  salesToday: 24500,
};

export const revenueByMonth = [
  { month: 'Feb', revenue: 312000, expenses: 198000 },
  { month: 'Mar', revenue: 338000, expenses: 205000 },
  { month: 'Apr', revenue: 356000, expenses: 211000 },
  { month: 'May', revenue: 390000, expenses: 220000 },
  { month: 'Jun', revenue: 421000, expenses: 234000 },
  { month: 'Jul', revenue: 482300, expenses: 251000 },
];

export const notifications = [
  { id: 'N-001', text: 'Dr. Kabir Anand submitted a registration request awaiting approval.', type: 'Approval', time: '10 minutes ago', status: 'Unread' },
  { id: 'N-002', text: 'Pharmacy stock for Amoxicillin 500mg is running low (8 units left).', type: 'Alert', time: '1 hour ago', status: 'Unread' },
  { id: 'N-003', text: 'Monthly revenue report for June is ready to view.', type: 'Report', time: 'Yesterday', status: 'Read' },
  { id: 'N-004', text: 'New department "Oncology" was created by Admin.', type: 'System', time: '2 days ago', status: 'Read' },
];
