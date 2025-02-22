const {
  startOnboarding,
  updateDriverProfile,
  reviewDriverApplication,
} = require("../controllers/driver.controller.js");

const { isAdmin, isLoggedIn } = require("../middlewares/auth.middleware.js");

const upload = require("../middlewares/multer.middleware.js");

const express = require("express");

const router = express.Router();

// Driver onboarding
router.post("/start-onboarding", isLoggedIn, startOnboarding);
router.put(
  "/update-onboarding",
  isLoggedIn,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "licenseImage", maxCount: 1 },
    { name: "vehicleImage", maxCount: 1 },
  ]),
  updateDriverProfile
);
router.put("/review-application", isLoggedIn, isAdmin, reviewDriverApplication);

module.exports = router;
