import express from 'express';
import { protect, authorizeRole } from '../middleware/authMiddleware.js';
import {
  registerPatient,
  getQueue,
  addToQueue,
  updateQueueStatus,
  getInvoices,
  createInvoice,
  updateInvoiceStatus,
  getReportsSummary,
} from '../controllers/receptionistController.js';

const router = express.Router();

// Every route here is receptionist/admin front-desk functionality
router.use(protect, authorizeRole('receptionist', 'admin'));

// Patient registration (front desk)
router.post('/register-patient', registerPatient);

// Walk-in queue
router.get('/walk-in-queue', getQueue);
router.post('/walk-in-queue', addToQueue);
router.put('/walk-in-queue/:id/status', updateQueueStatus);

// Billing
router.get('/billing', getInvoices);
router.post('/billing', createInvoice);
router.put('/billing/:id/status', updateInvoiceStatus);

// Reports
router.get('/reports/summary', getReportsSummary);

export default router;
