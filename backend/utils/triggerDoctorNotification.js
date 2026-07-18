import DoctorNotification from '../models/DoctorNotification.js';

export const triggerDoctorNotification = async (
  doctorId,
  type,
  title,
  message,
  actionLabel = 'View Details',
  actionUrl = '',
  priority = 'medium',
  relatedId = null,
  relatedModel = null,
  expiresAt = null
) => {
  try {
    const notification = new DoctorNotification({
      doctorId,
      type,
      title,
      message,
      actionLabel,
      actionUrl,
      priority,
      relatedId,
      relatedModel,
      expiresAt,
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error triggering doctor notification:', error);
  }
};
