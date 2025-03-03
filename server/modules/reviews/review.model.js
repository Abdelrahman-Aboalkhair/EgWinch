const mongoose = require("mongoose");
const redis = require("../../lib/redis");

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },
  },
  { timestamps: true }
);

// Function to clear cache when data changes
const clearCache = async (userId) => {
  await redis.del(`bookingStats:${userId}`);
};

// Call this function when booking changes
reviewSchema.post("save", async function () {
  await clearCache(this.customer.toString());
  await clearCache(this.driver.toString());
});

reviewSchema.post("remove", async function () {
  await clearCache(this.customer.toString());
  await clearCache(this.driver.toString());
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
