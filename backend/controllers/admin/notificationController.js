import AdminNotification from "../../models/AdminPanel/Notification.js";

const shapeNotification = (n) => ({
  id: n._id,
  type: n.type,
  text: n.text,
  status: n.status,
  time: new Date(n.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
});

// @desc    Get all notifications for the logged-in admin
// @route   GET /api/admin/notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await AdminNotification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notifications.length, data: notifications.map(shapeNotification) });
  } catch (error) {
    console.error("Error in getNotifications:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Mark a single notification as read
// @route   PUT /api/admin/notifications/:id/read
export const markNotificationRead = async (req, res) => {
  try {
    const notification = await AdminNotification.findOne({ _id: req.params.id, user: req.user._id });
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    notification.status = "Read";
    await notification.save();
    res.status(200).json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    console.error("Error in markNotificationRead:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/admin/notifications/read-all
export const markAllNotificationsRead = async (req, res) => {
  try {
    await AdminNotification.updateMany({ user: req.user._id, status: "Unread" }, { status: "Read" });
    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error in markAllNotificationsRead:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
