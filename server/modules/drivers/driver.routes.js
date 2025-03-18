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
router.patch(
  "/update-step/:step",
  isAuthenticated,
  authorizeRole("driver"),
  upload.array("documents", 5),
  updateStep
);
router.patch(
  "/update-status",
  isAuthenticated,
  authorizeRole("admin", "super-admin"),
  updateStatus
);

module.exports = router;
