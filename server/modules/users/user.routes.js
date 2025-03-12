const express = require("express");
const {
  getAllUsers,
  createAdmin,
  me,
  getProfile,
  getUserBookingStats,
  deleteUser,
  deleteAdmin,
  updateMe,
} = require("./user.controller.js");

const isAuthenticated = require("../../middlewares/isAuthenticated.js");
const authorizeRole = require("../../middlewares/authorizeRole.js");

const router = express.Router();

router.get("/", isAuthenticated, getAllUsers);
router.get("/me", isAuthenticated, me);
router.get("/profile/:id", isAuthenticated, getProfile);
router.get("/booking-stats/:id", isAuthenticated, getUserBookingStats);

router.put(
  "/update-me",
  isAuthenticated,
  authorizeRole("user", "admin"),
  updateMe
);

router.post(
  "/",
  isAuthenticated,
  authorizeRole("admin", "super-admin"),
  createAdmin
);

router.delete(
  "/user/:id",
  isAuthenticated,
  authorizeRole("admin", "super-admin"),
  deleteUser
);
router.delete(
  "/admin/:id",
  isAuthenticated,
  authorizeRole("super-admin"),
  deleteAdmin
);

module.exports = router;
