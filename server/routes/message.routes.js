const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middlewares/auth.middleware");
const {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} = require("../controllers/message.controller.");

router.get("/users", isLoggedIn, getUsersForSidebar);
router.get("/:id", isLoggedIn, getMessages);

router.post("/send/:id", isLoggedIn, sendMessage);

module.exports = router;
