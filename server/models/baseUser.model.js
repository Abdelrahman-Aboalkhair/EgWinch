const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Booking = require("./booking.model");
const redis = require("../lib/redis");

const baseUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: String,
    profilePicture: { public_id: String, secure_url: String },
    role: {
      type: String,
      enum: ["customer", "driver", "admin"],
      required: true,
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true, default: [0, 0] },
    },
    address: String,
    password: { type: String, select: false },

    refreshToken: [String],
  },
  { timestamps: true }
);

// * {} → Define stages, conditions, and calculations.
// * [] → Used to pass multiple arguments (conditions, values, operators).

// ? Booking statistics
baseUserSchema.statics.getBookingStats = async function (userId) {
  // Caching statiscs with redis for faster load time
  const cacheKey = `bookingStats:${userId}`; // unique key for each user

  // Check if data is in Redis cache
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData); // Return cached result
  }

  // If not cached, fetch from DB
  const stats = await Booking.aggregate([
    {
      // 1st stage, match with customer or driver
      $match: {
        $or: [
          { customer: new mongoose.Types.ObjectId(userId) },
          { driver: new mongoose.Types.ObjectId(userId) },
        ],
      },
    },
    {
      // 2nd stage,
      $group: {
        _id: null,
        totalBookings: { $sum: 1 }, // Count total bookings
        completedBookings: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }, // { $cond: [ condition, value_if_true, value_if_false ] } => count completed bookings
        },
        canceledBookings: {
          $sum: { $cond: [{ $eq: ["$status", "canceled"] }, 1, 0] }, // count canceled bookings
        },

        // Total earnings for drivers (sum of completed and paid bookings)
        totalEarnings: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$status", "completed"] },
                  { $eq: ["$paymentStatus", "paid"] },
                ],
              },
              "$totalPrice",
              0,
            ],
          },
        },

        // Total spendings for customers
        totalSpendings: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, "$totalPrice", 0],
          },
        },

        // Average Rating Calculation (if ratings exist)
        totalRatings: { $sum: { $size: { $ifNull: ["$ratings", []] } } }, // Count number of ratings
        averageRating: {
          $avg: { $ifNull: ["$ratings.rating", 0] }, // Average rating
        },
      },
    },
  ]);

  const result = stats[0] || {
    totalBookings: 0,
    completedBookings: 0,
    canceledBookings: 0,
    totalEarnings: 0,
    totalRatings: 0,
    averageRating: 0,
  };

  // Store in Redis for 10 minutes (600 seconds)
  await redis.setex(cacheKey, 600, JSON.stringify(result));

  return result;
};

/*** Hash Password Before Saving ***/
baseUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/*** Password Comparison ***/
baseUserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    console.error("Password is missing for user:", this._id);
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

/*** JWT Token Generation ***/
baseUserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { userId: this._id, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

baseUserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { userId: this._id, role: this.role },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

/*** Enable GeoJSON Index for Location Queries ***/
baseUserSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", baseUserSchema);

module.exports = User;
