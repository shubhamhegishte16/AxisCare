import express from 'express';
import {
  getMedicalDashboard,
  getVisits,
  getVisitDetails,
  getConsultations,
  getConsultationDetails,
  getLabTests,
  getLabTestDetails,
  getMedications,
  getMedicationBill,
  getPatientVitals,
} from '../controllers/medicalHistoryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Dashboard
router.get('/dashboard', getMedicalDashboard);

// Vitals
router.get('/vitals', getPatientVitals);

// Visits
router.get('/visits', getVisits);
router.get('/visits/:id', getVisitDetails);

// Consultations (Prescriptions)
router.get('/consultations', getConsultations);
router.get('/consultations/:id', getConsultationDetails);

// Lab Tests
router.get('/lab-tests', getLabTests);
router.get('/lab-tests/:id', getLabTestDetails);

// Medications
router.get('/medications', getMedications);
router.get('/medications/:id/bill', getMedicationBill);

export default router;