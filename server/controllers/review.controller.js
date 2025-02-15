const Review = require("../models/review.model");
const User = require("../models/user.model");

exports.getUserReviews = async (req, res) => {
  try {
    const { id: winchOwnerId } = req.params;

    const winchOwner = await User.findById(winchOwnerId);
    if (!winchOwner) {
      return res
        .status(404)
        .json({ success: false, message: "Winch owner not found" });
    }

    const reviews = await Review.find({ winchOwner: winchOwnerId }).populate(
      "reviewer",
      "name email"
    );

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { winchOwnerId } = req.params;
    const { rating, reviewText } = req.body;
    const reviewerId = req.user._id;

    if (reviewerId.toString() === winchOwnerId) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot review yourself" });
    }

    const winchOwner = await User.findById(winchOwnerId);
    if (!winchOwner) {
      return res
        .status(404)
        .json({ success: false, message: "Winch owner not found" });
    }

    const existingReview = await Review.findOne({
      reviewer: reviewerId,
      winchOwner: winchOwnerId,
    });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this winch owner",
      });
    }

    const review = await Review.create({
      reviewer: reviewerId,
      winchOwner: winchOwnerId,
      rating,
      reviewText,
    });

    res
      .status(201)
      .json({ success: true, message: "Review created successfully", review });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const reviewerId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    if (review.reviewer.toString() !== reviewerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only delete your own review",
      });
    }

    await review.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};
