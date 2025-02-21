const {
  signin,
  signout,
  googleAuth,
  refreshToken,
  verfiyEmail,
  registerDriver,
  registerCustomer,
} = require("../controllers/auth.controller.js");

const express = require("express");

const router = express.Router();

router.post("/google", googleAuth);
router.post("/register-driver", registerDriver);
router.post("/register-user", registerCustomer);
router.post("/verify-email", verfiyEmail);
router.post("/sign-in", signin);
router.get("/sign-out", signout);
router.get("/refresh-token", refreshToken);

module.exports = router;
