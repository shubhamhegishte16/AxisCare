import mongoose from 'mongoose';

const labNotificationSchema = new mongoose.Schema({
  labId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['Alert', 'TestRequest', 'Result', 'System', 'Reminder'],
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
    enum: ['LabAppointment', 'LabResult', null],
    default: null,
  },
}, {
  timestamps: true,
});

labNotificationSchema.index({ labId: 1, createdAt: -1 });
labNotificationSchema.index({ labId: 1, read: 1 });
labNotificationSchema.index({ type: 1 });

const LabNotification = mongoose.model('LabNotification', labNotificationSchema);
export default LabNotification;
