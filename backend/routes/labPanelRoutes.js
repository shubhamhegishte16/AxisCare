import express from 'express';
import { getLabDashboard, getLabRequests, getLabResults, updateLabRequestStatus, completeLabRequest, getLabRequestById, getLabStats } from '../controllers/labPanelController.js';
import { protect, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only allow laboratory staff (role: 'lab') to access these routes
router.use(protect);
router.use(authorizeRole('lab'));

// Routes for laboratory panel
router.get('/stats', getLabStats);
router.get('/dashboard', getLabDashboard);
router.get('/results', getLabResults);
router.get('/requests', getLabRequests);
router.get('/requests/:id', getLabRequestById);
router.put('/requests/:id/status', updateLabRequestStatus);
router.put('/requests/:id/complete', completeLabRequest);

export default router;
