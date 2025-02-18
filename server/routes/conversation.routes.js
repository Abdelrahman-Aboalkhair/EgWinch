const express = require("express");
const {
  createConversation,
  getConversations,
} = require("../controllers/conversation.controller");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/auth.middleware");

router.get("/", isLoggedIn, getConversations);
router.post("/", isLoggedIn, createConversation);

module.exports = router;
