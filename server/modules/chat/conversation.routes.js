const {
  createConversation,
  getConversations,
} = require("./conversation.controller");
const isAuthenticated = require("../../middlewares/isAuthenticated");

const express = require("express");
const router = express.Router();

router.get("/", isAuthenticated, getConversations);
router.post("/", isAuthenticated, createConversation);

module.exports = router;
