const express = require("express");
const {
  getMessages,
  sendMessage,
} = require("../controllers/message.controller");
const { isLoggedIn } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/:id", isLoggedIn, getMessages);
router.post("/send/:id", isLoggedIn, sendMessage);
