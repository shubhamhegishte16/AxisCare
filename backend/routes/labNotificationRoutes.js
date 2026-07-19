import express from 'express';
import {
  deleteLabNotification,
  getMyLabNotifications,
  markAllLabNotificationsRead,
  markLabNotificationRead,
} from '../controllers/LabNotificationController.js';
import { authorizeRole, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRole('lab', 'laboratory'));

router.get('/', getMyLabNotifications);
router.put('/read-all', markAllLabNotificationsRead);
router.put('/:id/read', markLabNotificationRead);
router.delete('/:id', deleteLabNotification);

export default router;
