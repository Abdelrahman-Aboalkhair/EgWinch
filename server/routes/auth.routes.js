const {
  signup,
  signin,
  signout,
  googleAuth,
  refreshToken,
  verfiyEmail,
} = require("../controllers/auth.controller.js");
const { verifyRefreshToken } = require("../middlewares/auth.middleware.js");

const express = require("express");

const router = express.Router();

router.post("/google", googleAuth);
router.post("/sign-up", signup);
router.post("/verify-email", verfiyEmail);
router.post("/sign-in", signin);
router.get("/sign-out", signout);
router.get("/refresh-token", refreshToken);

module.exports = router;
