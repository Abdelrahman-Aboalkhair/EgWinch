const Notification = require("../models/notification.model.js");

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.userId,
    }).sort({
      createdAt: -1,
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ message: "Notifications marked as read." });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark notifications as read" });
  }
};

exports.clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.userId });
    res.status(200).json({ message: "All notifications cleared." });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear notifications" });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification || notification.user.toString() !== req.user.userId) {
      return res.status(404).json({ error: "Notification not found" });
    }

    await notification.deleteOne();
    res.status(200).json({ message: "Notification deleted." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
};
