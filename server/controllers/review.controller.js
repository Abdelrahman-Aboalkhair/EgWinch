const Review = require("../models/review.model");
const User = require("../models/baseUser.model");
const Booking = require("../models/booking.model");

exports.getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const reviews = await Review.find({ reviewedUser: userId })
      .populate("reviewer", "name email profilePicture role")
      .populate("booking", "pickupLocation dropoffLocation date");

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
    const { reviewedUserId, bookingId } = req.params;
    const { rating, text } = req.body;
    const reviewerId = req.user._id;

    if (reviewerId.toString() === reviewedUserId) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot review yourself" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    const reviewer = await User.findById(reviewerId);
    const reviewedUser = await User.findById(reviewedUserId);
    if (!reviewer || !reviewedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Validate that reviewer and reviewedUser belong to the booking
    if (
      !(
        (booking.customer.toString() === reviewerId.toString() &&
          booking.driver.toString() === reviewedUserId.toString()) ||
        (booking.driver.toString() === reviewerId.toString() &&
          booking.customer.toString() === reviewedUserId.toString())
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only review users from your bookings",
      });
    }

    // Ensure only one review per user per booking
    const existingReview = await Review.findOne({
      reviewer: reviewerId,
      reviewedUser: reviewedUserId,
      booking: bookingId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this user for this booking",
      });
    }

    const review = await Review.create({
      reviewer: reviewerId,
      reviewedUser: reviewedUserId,
      booking: bookingId,
      rating,
      text,
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
