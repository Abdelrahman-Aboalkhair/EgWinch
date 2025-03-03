const {
  signin,
  signout,
  refreshToken,
  verifyEmail,
  registerUser,
  googleSignup,
  googleSignin,
  facebookSignup,
  facebookSignin,
} = require("./auth.controller.js");

const upload = require("../../middlewares/multer.middleware.js");

const express = require("express");

const router = express.Router();

router.post("/google-signup", googleSignup);
router.post("/google-signin", googleSignin);
router.post("/facebook-signup", facebookSignup);
router.post("/facebook-signin", facebookSignin);
router.post("/register", upload.single("profilePicture"), registerUser);
router.post("/verify-email", verifyEmail);
router.post("/sign-in", signin);
router.get("/sign-out", signout);
router.get("/refresh-token", refreshToken);

module.exports = router;
