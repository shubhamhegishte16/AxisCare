// patientNotification.js -
import Notification from '../models/PatientNotification.js';

// Get all notifications for the logged-in user
export const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const { type, read, limit = 50, page = 1 } = req.query;
        
        const query = { userId };
        
        if (type && type !== 'All' && type !== 'Unread') {
            query.type = type;
        }
        
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