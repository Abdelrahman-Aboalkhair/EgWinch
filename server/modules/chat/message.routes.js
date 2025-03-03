const { getMessages } = require("./message.controller");
const isAuthenticated = require("../../middlewares/isAuthenticated");

const express = require("express");
const router = express.Router();

router.get("/:conversationId", isAuthenticated, getMessages);

module.exports = router;
