const {
  getUserReviews,
  deleteReview,
  createReview,
} = require("./review.controller");

const express = require("express");
const router = express.Router();

router.get("/:id", getUserReviews);
router.post("/", createReview);
router.delete("/", deleteReview);

module.exports = router;
