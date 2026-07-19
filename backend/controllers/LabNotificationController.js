import LabNotification from '../models/LabNotification.js';

export const getMyLabNotifications = async (req, res) => {
  try {
    const labId = req.user._id;
    const { type, read, limit = 50, page = 1 } = req.query;
    const query = { labId };

    if (type && type !== 'All' && type !== 'Unread') query.type = type;
    if (read === 'true') query.read = true;
    else if (read === 'false' || type === 'Unread') query.read = false;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const notifications = await LabNotification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await LabNotification.countDocuments(query);
    const unreadCount = await LabNotification.countDocuments({ labId, read: false });

    res.status(200).json({
      success: true,
      count: notifications.length,
      total,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    console.error('Error in getMyLabNotifications:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const markLabNotificationRead = async (req, res) => {
  try {
    const notification = await LabNotification.findOne({ _id: req.params.id, labId: req.user._id });
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();
    res.status(200).json({ success: true, message: 'Notification marked as read', data: notification });
  } catch (error) {
    console.error('Error in markLabNotificationRead:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const markAllLabNotificationsRead = async (req, res) => {
  try {
    await LabNotification.updateMany(
      { labId: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error in markAllLabNotificationsRead:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const deleteLabNotification = async (req, res) => {
  try {
    const notification = await LabNotification.findOneAndDelete({ _id: req.params.id, labId: req.user._id });
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error in deleteLabNotification:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
