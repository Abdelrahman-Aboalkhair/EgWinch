const {
  signin,
  signout,
  refreshToken,
  verifyEmail,
  registerUser,
  googleSignup,
  googleSignin,
  forgotPassword,
  resetPassword,
} = require("./auth.controller.js");

const upload = require("../../middlewares/multer.middleware.js");

const express = require("express");
const {
  validateRegister,
  validateVerifyEmail,
  validateSignin,
  validateGoogleAuth,
  validateRefreshToken,
  validateForgotPassword,
  validateResetPassword,
} = require("./auth.validation.js");

const router = express.Router();

router.post("/google-signup", validateGoogleAuth, googleSignup);
router.post("/google-signin", validateGoogleAuth, googleSignin);
router.post(
  "/sign-up",
  upload.single("profilePicture"),
  validateRegister,
  registerUser
);
router.post("/verify-email", validateVerifyEmail, verifyEmail);
router.post("/sign-in", validateSignin, signin);
router.get("/sign-out", signout);
router.get("/refresh-token", validateRefreshToken, refreshToken);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/reset-password", validateResetPassword, resetPassword);

module.exports = router;
