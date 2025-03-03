const {
  getUserNotifications,
  clearNotifications,
  deleteNotification,
  markAsRead,
} = require("./notification.controller.js");
const isAuthenticated = require("../../middlewares/isAuthenticated.js");

const express = require("express");
const router = express.Router();

router.get("/", isAuthenticated, getUserNotifications);
router.put("/read", isAuthenticated, markAsRead);
router.delete("/", isAuthenticated, clearNotifications);
router.delete("/:id", isAuthenticated, deleteNotification);

module.exports = router;
