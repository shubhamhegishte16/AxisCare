import express from 'express';
import {
  getPatientBills,
  getBillStats,
  getBillDetails,
  payBill,
} from '../controllers/PatientBillController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get bill stats
router.get('/patient/stats', getBillStats);

// Get patient bills
router.get('/patient', getPatientBills);

// Get bill details
router.get('/:id', getBillDetails);

// Pay bill
router.put('/:id/pay', payBill);

export default router;