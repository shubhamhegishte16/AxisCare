import DoctorNotification from '../models/DoctorNotification.js';

// Get all notifications for the logged-in doctor
export const getMyNotifications = async (req, res) => {
    try {
        const doctorId = req.user._id;
        const { type, read, limit = 50, page = 1 } = req.query;
        
        const query = { doctorId };
        
        if (type && type !== 'All' && type !== 'Unread') {
            query.type = type;
        }
        
        if (read === 'true') {
            query.read = true;
        } else if (read === 'false' || type === 'Unread') {
            query.read = false;
        }
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const notifications = await DoctorNotification.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await DoctorNotification.countDocuments(query);
        const unreadCount = await DoctorNotification.countDocuments({ doctorId, read: false });
        
        res.status(200).json({
            success: true,
            count: notifications.length,
            total,
            unreadCount,
            data: notifications,
        });
    } catch (error) {
        console.error('Error in getMyNotifications (Doctor):', error);
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
        const doctorId = req.user._id;
        const notificationId = req.params.id;
        
        const notification = await DoctorNotification.findOne({ _id: notificationId, doctorId });
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }
        
        notification.read = true;
        await notification.save();
        
        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            data: notification
        });
    } catch (error) {
        console.error('Error in markAsRead (Doctor):', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
    try {
        const doctorId = req.user._id;
        
        await DoctorNotification.updateMany(
            { doctorId, read: false },
            { $set: { read: true } }
        );
        
        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        console.error('Error in markAllAsRead (Doctor):', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
    try {
        const doctorId = req.user._id;
        const notificationId = req.params.id;
        
        const notification = await DoctorNotification.findOneAndDelete({ _id: notificationId, doctorId });
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteNotification (Doctor):', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
