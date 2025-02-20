const {
  getAllUsers,
  getUserProfile,
  createAdmin,
} = require("../controllers/user.controller.js");
const { isLoggedIn } = require("../middlewares/auth.middleware.js");

const express = require("express");
const router = express.Router();

router.get("/", isLoggedIn, getAllUsers);
router.get("/me", isLoggedIn, getUserProfile);
router.post("/", isLoggedIn, createAdmin);

module.exports = router;
