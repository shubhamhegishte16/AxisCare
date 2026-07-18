import express from 'express';
import {
  getPatientBills,
  getBillStats,
  getBillDetails,
  payBill,
  downloadBill,
  createBillFromOrder,
} from '../controllers/PatientBillController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/patient/stats', getBillStats);           
router.get('/patient', getPatientBills);              
router.post('/create-from-order', createBillFromOrder);

router.get('/:id', getBillDetails);                   
router.put('/:id/pay', payBill);                      
router.get('/:id/download', downloadBill);

export default router;