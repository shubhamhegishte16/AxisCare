// patientNotification.js -
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['Alert', 'Billing', 'Appointments', 'Medical', 'System', 'Reminder'],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  actionLabel: {
    type: String,
    default: 'View Details',
  },
  actionUrl: {
    type: String,
    default: '',
  },
  actionData: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  read: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedModel',
    default: null,
  },
  relatedModel: {
    type: String,
    enum: ['Appointment', 'Bill', 'Prescription', 'LabReport', null],
    default: null,
  },
}, {
  timestamps: true,
});

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ type: 1 });

const Notification = mongoose.model('PatientNotification', notificationSchema);
export default Notification;