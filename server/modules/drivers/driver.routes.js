const {
  startOnboarding,
  updateDriverProfile,
  reviewDriverApplication,
} = require("./driver.controller.js");
const isAuthenticated = require("../../middlewares/isAuthenticated.js");
const isAuthorized = require("../../middlewares/isAuthorized.js");
const upload = require("../../middlewares/multer.middleware.js");

const express = require("express");

const router = express.Router();

// Driver onboarding
router.post("/start-onboarding", isAuthenticated, startOnboarding);
router.put(
  "/update-onboarding",
  isAuthenticated,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "licenseImage", maxCount: 1 },
    { name: "vehicleImage", maxCount: 1 },
  ]),
  updateDriverProfile
);
router.put(
  "/review-application",
  isAuthenticated,
  isAuthorized,
  reviewDriverApplication
);

module.exports = router;
