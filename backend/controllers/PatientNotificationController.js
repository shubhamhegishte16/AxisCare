import Notification from '../models/PatientNotification.js';
import Appointment from '../models/Appointment.js';

// Get all notifications for the logged-in user
export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, read, limit = 50, page = 1 } = req.query;
    
    const query = { userId };
    
    // Filter by type
    if (type && type !== 'All' && type !== 'Unread') {
      query.type = type;
    }
    
    // Filter by read status
    if (read === 'true') {
      query.read = true;
    } else if (read === 'false' || type === 'Unread') {
      query.read = false;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ userId, read: false });
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      total,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    console.error('Error in getMyNotifications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    
    const notification = await Notification.findOne({ _id: id, userId });
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }
    
    notification.read = true;
    await notification.save();
    
    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (error) {
    console.error('Error in markAsRead:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );
    
    res.status(200).json({
      success: true,
      message: `Marked ${result.modifiedCount} notifications as read`,
      count: result.modifiedCount,
    });
  } catch (error) {
    console.error('Error in markAllAsRead:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    
    const notification = await Notification.findOneAndDelete({ _id: id, userId });
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteNotification:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Delete all read notifications
export const deleteAllRead = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const result = await Notification.deleteMany({ userId, read: true });
    
    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} read notifications`,
      count: result.deletedCount,
    });
  } catch (error) {
    console.error('Error in deleteAllRead:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get unread count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const count = await Notification.countDocuments({ userId, read: false });
    
    res.status(200).json({
      success: true,
      unreadCount: count,
    });
  } catch (error) {
    console.error('Error in getUnreadCount:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Create notification (system generated - used internally)
export const createNotification = async (req, res) => {
  try {
    const { userId, type, title, message, actionLabel, actionUrl, actionData, priority, relatedId, relatedModel } = req.body;
    
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      actionLabel: actionLabel || 'View Details',
      actionUrl: actionUrl || '',
      actionData: actionData || null,
      priority: priority || 'medium',
      relatedId: relatedId || null,
      relatedModel: relatedModel || null,
    });
    
    await notification.save();
    
    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification,
    });
  } catch (error) {
    console.error('Error in createNotification:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Generate notification for appointment status change
export const generateAppointmentNotification = async (appointment, type) => {
  try {
    const userId = appointment.userId;
    let title, message, actionLabel, actionUrl;
    
    switch (type) {
      case 'confirmed':
        title = 'Appointment Scheduled Successfully';
        message = `Your appointment with ${appointment.doctor} for ${appointment.reasonForVisit} has been confirmed for ${appointment.preferredDate} at ${appointment.preferredTime}.`;
        actionLabel = 'View Details';
        actionUrl = '/appointments';
        break;
      case 'cancelled':
        title = 'Appointment Cancelled';
        message = `Your appointment with ${appointment.doctor} for ${appointment.reasonForVisit} has been cancelled.`;
        actionLabel = 'Reschedule';
        actionUrl = '/appointments';
        break;
      case 'reminder':
        title = 'Appointment Reminder';
        message = `Reminder: You have an appointment with ${appointment.doctor} for ${appointment.reasonForVisit} tomorrow at ${appointment.preferredTime}.`;
        actionLabel = 'View Details';
        actionUrl = '/appointments';
        break;
      default:
        return;
    }
    
    const notification = new Notification({
      userId,
      type: 'Appointments',
      title,
      message,
      actionLabel,
      actionUrl,
      priority: type === 'reminder' ? 'medium' : 'high',
      relatedId: appointment._id,
      relatedModel: 'Appointment',
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error generating appointment notification:', error);
    return null;
  }
};

// Generate notification for billing
export const generateBillingNotification = async (bill, patientId) => {
  try {
    const notification = new Notification({
      userId: patientId,
      type: 'Billing',
      title: 'New Invoice Generated',
      message: `Your invoice #${bill.invoiceNumber} for ${bill.description} is ready for payment. Amount: $${bill.amount}`,
      actionLabel: 'Pay Now',
      actionUrl: '/bills',
      priority: 'high',
      relatedId: bill._id,
      relatedModel: 'Bill',
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error generating billing notification:', error);
    return null;
  }
};

// Generate notification for medical reports
export const generateMedicalNotification = async (patientId, doctorName, reportName) => {
  try {
    const notification = new Notification({
      userId: patientId,
      type: 'Medical',
      title: 'Medical History Updated',
      message: `Dr. ${doctorName} uploaded your ${reportName} diagnostic test reports.`,
      actionLabel: 'View Report',
      actionUrl: '/medical-history',
      priority: 'medium',
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error generating medical notification:', error);
    return null;
  }
};