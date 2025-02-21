const Notification = require("../models/notification.model.js");
const redis = require("../lib/redis.js");

exports.getUserNotifications = async (req, res) => {
  try {
    const cacheKey = `notifications:${req.user.userId}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return res
        .status(200)
        .json({ fromCache: true, notifications: JSON.parse(cachedData) });
    }

    const notifications = await Notification.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    await redis.set(cacheKey, JSON.stringify(notifications), "EX", 60 * 5); // Cache for 5 minutes

    res.status(200).json({ fromCache: false, notifications });
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

    await redis.del(`notifications:${req.user.userId}`); // Invalidate cache

    res.status(200).json({ message: "Notifications marked as read." });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark notifications as read" });
  }
};

exports.clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.userId });

    await redis.del(`notifications:${req.user.userId}`); // Invalidate cache

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

    await redis.del(`notifications:${req.user.userId}`); // Invalidate cache

    res.status(200).json({ message: "Notification deleted." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
};
