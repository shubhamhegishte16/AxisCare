import express from 'express';
import { protect, authorizeRole } from '../middleware/authMiddleware.js';
import { bookAppointment, getMyAppointments, cancelAppointment, getAllAppointments, updateAppointmentStatus, getDoctorsByDepartment } from '../controllers/appointmentController.js';
import uploadAppointmentDoc from '../utils/uploadAppointmentDoc.js';
const router = express.Router();
router.use(protect);
// Patient routes
router.post('/', uploadAppointmentDoc.single('document'), bookAppointment);
router.get('/mine', getMyAppointments);
router.put('/:id/cancel', cancelAppointment);
// Shared — any authenticated user can fetch doctors for the dropdown
router.get('/doctors', getDoctorsByDepartment);
// Admin / receptionist routes
router.get('/all', authorizeRole('admin', 'receptionist'), getAllAppointments);
router.put('/:id/status', authorizeRole('admin', 'receptionist'), updateAppointmentStatus);
export default router;
