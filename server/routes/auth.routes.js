const {
  signin,
  signout,
  refreshToken,
  verfiyEmail,
  registerCustomer,
  googleSignup,
  googleSignin,
} = require("../controllers/auth.controller.js");

const {
  saveDriverPersonalInfo,
  saveDriverVehicleInfo,
  uploadDriverDocuments,
  submitDriverApplication,
  updateOnboardingStatus,
} = require("../controllers/driverOnboarding.controller.js");

const { isAdmin } = require("../middlewares/auth.middleware.js");

const upload = require("../middlewares/multer.middleware.js");

const express = require("express");

const router = express.Router();

// Authentication
router.post("/google-signup", googleSignup);
router.post("/google-signin", googleSignin);
router.post(
  "/register-customer",
  upload.single("profilePicture"),
  registerCustomer
);
router.post("/verify-email", verfiyEmail);
router.post("/sign-in", signin);
router.get("/sign-out", signout);
router.get("/refresh-token", refreshToken);

// 🚗 Driver Onboarding Routes (Multi-Step)
router.patch("/driver/personal-info", saveDriverPersonalInfo); // Step 1
router.patch("/driver/vehicle-info", saveDriverVehicleInfo); // Step 2
router.post(
  "/driver/upload-documents",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "licenseImage", maxCount: 1 },
  ]),
  uploadDriverDocuments
); // Step 3
router.post("/driver/submit-application", submitDriverApplication); // Step 4

router.patch(
  "/update-driver-status/:driverId",
  isAdmin,
  updateOnboardingStatus
);

module.exports = router;
