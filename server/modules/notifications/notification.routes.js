const express = require("express");
const {
  getUserNotifications,
  clearNotifications,
  deleteNotification,
  markAsRead,
} = require("../../controllers/notification.controller.js");
const { isLoggedIn } = require("../../middlewares/auth.middleware.js");
const router = express.Router();

router.get("/", isLoggedIn, getUserNotifications);
router.put("/read", isLoggedIn, markAsRead);
router.delete("/", isLoggedIn, clearNotifications);
router.delete("/:id", isLoggedIn, deleteNotification);

module.exports = router;
