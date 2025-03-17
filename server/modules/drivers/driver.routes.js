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

router.post("/", isAuthenticated, authorizeRole("user"), startOnboarding);
router.patch(
  "/update-step/:step",
  isAuthenticated,
  authorizeRole("driver"),
  upload.array("documents"),
  updateStep
);
router.patch(
  "/update-status",
  isAuthenticated,
  authorizeRole("admin", "super-admin"),
  updateStatus
);

module.exports = router;
