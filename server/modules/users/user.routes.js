const {
  getAllUsers,
  createAdmin,
  me,
  getProfile,
  getUserBookingStats,
} = require("./user.controller.js");
const isAuthenticated = require("../../middlewares/isAuthenticated.js");

const express = require("express");
const router = express.Router();

router.get("/", isAuthenticated, getAllUsers);
router.get("/me", isAuthenticated, me);
router.get("/profile/:id", isAuthenticated, getProfile);
router.get("/booking-stats/:id", isAuthenticated, getUserBookingStats);
router.post("/", isAuthenticated, createAdmin);

module.exports = router;
