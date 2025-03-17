const express = require("express");
const router = express.Router();

const upload = require("../../middlewares/multer.middleware.js");
const {
  authLimiter,
  signupLimiter,
  passwordResetLimiter,
  refreshTokenLimiter,
  failedLoginLimiter,
} = require("../../constants/limiters.js");

const {
  validateRegister,
  validateVerifyEmail,
  validateSignin,
  validateGoogleAuth,
  validateRefreshToken,
  validateForgotPassword,
  validateResetPassword,
} = require("./auth.validation.js");

const {
  signin,
  signout,
  refreshToken,
  verifyEmail,
  register,
  googleSignup,
  googleSignin,
  forgotPassword,
  resetPassword,
} = require("./auth.controller.js");

router.post("/google-signup", validateGoogleAuth, googleSignup);
router.post("/google-signin", validateGoogleAuth, googleSignin);

router.post(
  "/sign-up",
  signupLimiter,
  upload.single("profilePicture"),
  validateRegister,
  register
);
router.post("/verify-email", validateVerifyEmail, verifyEmail);

router.post("/sign-in", validateSignin, signin);
router.get("/sign-out", signout);

router.get("/refresh-token", validateRefreshToken, refreshToken);

router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/reset-password", validateResetPassword, resetPassword);

module.exports = router;
