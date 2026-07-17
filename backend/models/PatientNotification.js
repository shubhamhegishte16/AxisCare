import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  // User receiving the notification
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // Notification type
  type: {
    type: String,
    enum: ['Alert', 'Billing', 'Appointments', 'Medical', 'System', 'Reminder'],
    required: true,
  },
  
  // Notification title
  title: {
    type: String,
    required: true,
    trim: true,
  },
  
  // Notification message
  message: {
    type: String,
    required: true,
    trim: true,
  },
  
  // Action label (e.g., "Complete Form Now", "Pay Now", "View Details")
  actionLabel: {
    type: String,
    default: 'View Details',
  },
  
  // Action URL or identifier for the action button
  actionUrl: {
    type: String,
    default: '',
  },
  
  // Action data for routing
  actionData: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  
  // Read status
  read: {
    type: Boolean,
    default: false,
  },
  
  // Priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  
  // Expiry date (optional)
  expiresAt: {
    type: Date,
    default: null,
  },
  
  // Related entity IDs (appointment, bill, etc.)
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
  
  // Icon and color mapping (frontend display)
  metadata: {
    iconColor: {
      type: String,
      default: '#00A3C4',
    },
    bgColor: {
      type: String,
      default: '#E0F7FA',
    },
  },
  
}, {
  timestamps: true,
});

// Indexes for faster queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Pre-save middleware to set default metadata based on type
notificationSchema.pre('save', function(next) {
  if (this.isNew && !this.metadata) {
    const metadataMap = {
      'Alert': { iconColor: '#D32F2F', bgColor: '#FFEBEE' },
      'Billing': { iconColor: '#E65100', bgColor: '#FFF3E0' },
      'Appointments': { iconColor: '#2E7D32', bgColor: '#E8F5E9' },
      'Medical': { iconColor: '#00A3C4', bgColor: '#E0F7FA' },
      'System': { iconColor: '#1565C0', bgColor: '#E3F2FD' },
      'Reminder': { iconColor: '#6A1B9A', bgColor: '#F3E5F5' },
    };
    this.metadata = metadataMap[this.type] || { iconColor: '#00A3C4', bgColor: '#E0F7FA' };
  }
  next();
});

const Notification = mongoose.model('PatientNotification', notificationSchema);
export default Notification;