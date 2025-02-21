const {
  getAllUsers,
  createAdmin,
  me,
  getProfile,
  getUserBookingStats,
} = require("../controllers/user.controller.js");
const { isLoggedIn } = require("../middlewares/auth.middleware.js");

const express = require("express");
const router = express.Router();

router.get("/", isLoggedIn, getAllUsers);
router.get("/me", isLoggedIn, me);
router.get("/profile/:id", isLoggedIn, getProfile);
router.get("/booking-stats/:id", isLoggedIn, getUserBookingStats);
router.post("/", isLoggedIn, createAdmin);

module.exports = router;
