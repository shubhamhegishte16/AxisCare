import express from 'express';
import { protect, authorizeRole } from '../middleware/authMiddleware.js';
import { createPrescription, getDoctorPrescriptions, updatePrescriptionStatus, deletePrescription } from '../controllers/prescriptionController.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRole('doctor'));

router.post('/', createPrescription);
router.get('/my-prescriptions', getDoctorPrescriptions);
router.put('/:id/status', updatePrescriptionStatus);
router.delete('/:id', deletePrescription);

export default router;
