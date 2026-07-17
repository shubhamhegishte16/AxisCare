import express from 'express';
import {
  bookLabAppointment,
  getMyLabAppointments,
  getLabAppointmentDetails,
  cancelLabAppointment,
  rescheduleLabAppointment,
  getLabTestCategories,
} from '../controllers/LabAppointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Patient routes
router.post('/book', bookLabAppointment);
router.get('/my', getMyLabAppointments);
router.get('/categories', getLabTestCategories);
router.get('/:id', getLabAppointmentDetails);
router.put('/:id/cancel', cancelLabAppointment);
router.put('/:id/reschedule', rescheduleLabAppointment);

export default router;