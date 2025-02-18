const express = require("express");
const router = express.Router();
const { getMessages } = require("../controllers/message.controller.");
const { isLoggedIn } = require("../middlewares/auth.middleware");

router.get("/:conversationId", isLoggedIn, getMessages);

module.exports = router;
