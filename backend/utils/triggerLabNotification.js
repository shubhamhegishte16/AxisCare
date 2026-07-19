import LabNotification from '../models/LabNotification.js';

export const triggerLabNotification = async (
  labId,
  type,
  title,
  message,
  actionLabel = 'View Details',
  actionUrl = '',
  priority = 'medium',
  relatedId = null,
  relatedModel = null,
  expiresAt = null,
  actionData = null
) => {
  try {
    const notification = new LabNotification({
      labId,
      type,
      title,
      message,
      actionLabel,
      actionUrl,
      priority,
      relatedId,
      relatedModel,
      expiresAt,
      actionData,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error triggering lab notification:', error);
    return null;
  }
};
