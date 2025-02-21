const {
  signin,
  signout,
  googleAuth,
  refreshToken,
  verfiyEmail,
  registerDriver,
  registerCustomer,
} = require("../controllers/auth.controller.js");
const upload = require("../middlewares/multer.middleware.js");

const express = require("express");

const router = express.Router();

router.post("/google", googleAuth);
router.post(
  "/register-driver",
  upload.fields([
    {
      name: "profilePicture",
      maxCount: 1,
    },
    {
      name: "licenseImage",
      maxCount: 1,
    },
  ]),
  registerDriver
);
router.post(
  "/register-customer",
  upload.single("profilePicture"),
  registerCustomer
);
router.post("/verify-email", verfiyEmail);
router.post("/sign-in", signin);
router.get("/sign-out", signout);
router.get("/refresh-token", refreshToken);

module.exports = router;
