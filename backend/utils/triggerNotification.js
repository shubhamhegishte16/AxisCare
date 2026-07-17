import Notification from '../models/PatientNotification.js';

export const triggerNotification = async (userId, type, title, message, actionLabel, actionUrl, priority = 'medium') => {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      actionLabel: actionLabel || 'View Details',
      actionUrl: actionUrl || '/',
      priority,
      read: false,
    });
    
    await notification.save();
    console.log(`Notification triggered: ${title}`);
    return notification;
  } catch (error) {
    console.error('Error triggering notification:', error);
    return null;
  }
};