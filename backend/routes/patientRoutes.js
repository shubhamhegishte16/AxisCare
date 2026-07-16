import express from 'express';
import {
  getOrCreatePatientProfile,
  getPatientProfile,
  updatePatientProfile,
  updateInsuranceInfo,
  updateEmergencyContacts,
  updatePassword,
  getAllPatients,
  deletePatientProfile,
} from '../controllers/patientController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Patient profile routes
router.route('/profile')
  .get(getOrCreatePatientProfile)
  .put(updatePatientProfile);

router.get('/me', getPatientProfile);

// Insurance routes
router.put('/insurance', updateInsuranceInfo);

// Emergency contacts routes
router.put('/emergency-contacts', updateEmergencyContacts);

// Password update
router.put('/update-password', updatePassword);

// Admin only routes
router.get('/all', getAllPatients);
router.delete('/:id', deletePatientProfile);

export default router;