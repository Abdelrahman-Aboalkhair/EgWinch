const {
  getAllUsers,
  getUserProfile,
} = require("../controllers/user.controller.js");
const { isLoggedIn } = require("../middlewares/auth.middleware.js");

const express = require("express");
const router = express.Router();

router.get("/", isLoggedIn, getAllUsers);
router.get("/me", isLoggedIn, getUserProfile);

module.exports = router;
