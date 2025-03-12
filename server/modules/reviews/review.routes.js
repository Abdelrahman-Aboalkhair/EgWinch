const {
  getUserReviews,
  deleteReview,
  createReview,
} = require("./review.controller");

const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middlewares/isAuthenticated");
const authorizeRole = require("../../middlewares/authorizeRole");

router.get("/:id", getUserReviews);
router.post("/", isAuthenticated, createReview);
router.delete(
  "/",
  isAuthenticated,
  authorizeRole("super-admin", "admin"),
  deleteReview
);

module.exports = router;
