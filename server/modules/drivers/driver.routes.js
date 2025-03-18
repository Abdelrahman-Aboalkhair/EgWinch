const {
  startOnboarding,
  updateStep,
  updateStatus,
} = require("./driver.controller.js");
const isAuthenticated = require("../../middlewares/isAuthenticated.js");
const authorizeRole = require("../../middlewares/authorizeRole.js");
const upload = require("../../middlewares/multer.middleware.js");

const express = require("express");

const router = express.Router();

router.post("/", isAuthenticated, startOnboarding);
router.put(
  "/update-step/:step",
  isAuthenticated,
  upload.fields([
    {
      name: "licenseImage",
      maxCount: 1,
    },
    {
      name: "profilePicture",
      maxCount: 1,
    },
    {
      name: "vehicleImage",
      maxCount: 1,
    },
  ]),
  updateStep
);
router.patch(
  "/update-status",
  isAuthenticated,
  authorizeRole("admin", "super-admin"),
  updateStatus
);

module.exports = router;
