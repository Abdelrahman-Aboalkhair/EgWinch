const {
  signin,
  signout,
  refreshToken,
  verfiyEmail,
  googleSignup,
  googleSignin,
  registerUser,
} = require("../controllers/auth.controller.js");

const upload = require("../middlewares/multer.middleware.js");

const express = require("express");

const router = express.Router();

// Authentication
router.post("/google-signup", googleSignup);
router.post("/google-signin", googleSignin);
router.post("/register", upload.single("profilePicture"), registerUser);
router.post("/verify-email", verfiyEmail);
router.post("/sign-in", signin);
router.get("/sign-out", signout);
router.get("/refresh-token", refreshToken);

module.exports = router;
