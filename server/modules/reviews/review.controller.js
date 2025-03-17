const Review = require("./review.model");
const User = require("../users/user.model");
const Booking = require("../bookings/booking.model");
const redis = require("../../lib/redis");
const asyncHandler = require("../../utils/asyncHandler");
const AppError = require("../../utils/AppError");

exports.getUserReviews = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const cacheKey = `reviews:${userId}`;

  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return res.status(200).json({ fromCache: true, ...JSON.parse(cachedData) });
  }

  const userExists = await User.exists({ _id: userId });
  if (!userExists) {
    return next(new AppError("User not found", 404));
  }

  const reviews = await Review.find({ reviewedUser: userId })
    .populate("reviewer", "name profilePicture")
    .populate("reviewedUser", "name profilePicture")
    .lean();

  const response = { success: true, count: reviews.length, reviews };

  await redis.set(cacheKey, JSON.stringify(response), "EX", 60 * 5);

  res.status(200).json(response);
});

exports.createReview = asyncHandler(async (req, res, next) => {
  const { reviewedUserId, bookingId } = req.params;
  const { rating, text } = req.body;
  const reviewerId = req.user._id;

  if (reviewerId.toString() === reviewedUserId) {
    return next(new AppError("You cannot review yourself", 400));
  }

  const booking = await Booking.findById(bookingId)
    .select("user driver")
    .lean();
  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  const users = await User.find({ _id: { $in: [reviewerId, reviewedUserId] } })
    .select("_id")
    .lean();
  if (users.length !== 2) {
    return next(new AppError("User not found", 404));
  }

  const isReviewerUser =
    booking.user.toString() === reviewerId.toString() &&
    booking.driver.toString() === reviewedUserId.toString();
  const isReviewerDriver =
    booking.driver.toString() === reviewerId.toString() &&
    booking.user.toString() === reviewedUserId.toString();

  if (!isReviewerUser && !isReviewerDriver) {
    return next(
      new AppError("You can only review users from your bookings", 403)
    );
  }

  const existingReview = await Review.exists({
    reviewer: reviewerId,
    reviewedUser: reviewedUserId,
    booking: bookingId,
  });
  if (existingReview) {
    return next(
      new AppError("You have already reviewed this user for this booking", 400)
    );
  }

  const review = await Review.create({
    reviewer: reviewerId,
    reviewedUser: reviewedUserId,
    booking: bookingId,
    rating,
    text,
  });

  await redis.del(`reviews:${reviewedUserId}`);

  res
    .status(201)
    .json({ success: true, message: "Review created successfully", review });
});

exports.deleteReview = asyncHandler(async (req, res, next) => {
  const { reviewId } = req.params;
  const reviewerId = req.user._id;

  const review = await Review.findOneAndDelete({
    _id: reviewId,
    reviewer: reviewerId,
  });

  if (!review) {
    return next(new AppError("Review not found or unauthorized", 404));
  }

  // Invalidate cache
  await redis.del(`reviews:${review.reviewedUser}`);

  res
    .status(200)
    .json({ success: true, message: "Review deleted successfully" });
});
