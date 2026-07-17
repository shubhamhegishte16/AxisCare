import express from 'express';
import { protect, authorizeRole } from '../middleware/authMiddleware.js';
import { bookAppointment, getMyAppointments, cancelAppointment, getAllAppointments, updateAppointmentStatus, getDoctorsByDepartment, getDoctorAppointments, cancelByDoctor, getDoctorPatients, completeByDoctor } from '../controllers/appointmentController.js';
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
// Doctor routes
router.get('/my-doctor-appointments', authorizeRole('doctor'), getDoctorAppointments);
router.get('/my-doctor-patients', authorizeRole('doctor'), getDoctorPatients);
router.put('/:id/doctor-cancel', authorizeRole('doctor'), cancelByDoctor);
router.put('/:id/doctor-complete', authorizeRole('doctor'), completeByDoctor);
export default router;
