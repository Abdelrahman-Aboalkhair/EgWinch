const {
  startOnboarding,
  updateStep,
  updateStatus,
} = require("./driver.controller.js");
const isAuthenticated = require("../../middlewares/isAuthenticated.js");
const isAuthorized = require("../../middlewares/isAuthorized.js");
const upload = require("../../middlewares/multer.middleware.js");

const express = require("express");

const router = express.Router();

router.post("/", isAuthenticated, startOnboarding);
router.put(
  "/update-step/:step",
  isAuthenticated,
  upload.array("documents"),
  updateStep
);
router.put("/update-status", isAuthenticated, isAuthorized, updateStatus);

module.exports = router;
