import express from 'express';
import { getPatientDashboard } from '../controllers/DashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/patient', protect, getPatientDashboard);

export default router;