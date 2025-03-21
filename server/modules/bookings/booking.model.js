const mongoose = require("mongoose");
const redis = require("../../lib/redis");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    onboardingStep: {
      type: String,
      enum: ["location", "items", "services", "completed"],
      default: "location",
    },
    pickupLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: function () {
          return this.onboardingStep !== "location";
        },
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: {
        type: String,
        trim: true,
        required: true,
      },
      floorNumber: {
        type: Number,
        required: true,
      },
    },
    dropoffLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: function () {
          return this.onboardingStep !== "location";
        },
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: {
        type: String,
        trim: true,
        required: true,
      },
      floorNumber: {
        type: Number,
        required: true,
      },
    },
    moveDate: {
      type: Date,
      required: function () {
        return this.onboardingStep !== "location";
      },
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "inProgress", "completed", "declined"],
      default: "pending",
    },
    items: {
      type: [
        {
          name: { type: String, required: true },
          category: { type: String },
          quantity: { type: Number, required: true, min: 1 },
          fragile: { type: Boolean, default: false },
          specialInstructions: { type: String, trim: true },
          additionalService: { type: String, trim: true },
        },
      ],
      default: [],
    },
    additionalServices: {
      type: [
        {
          name: { type: String, required: true },
          details: { type: String, trim: true },
        },
      ],
      default: [],
    },
    offers: [
      {
        driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        price: Number,
        status: {
          type: String,
          enum: ["pending", "negotiating", "accepted", "declined"],
          default: "pending",
        },
      },
    ],
    totalPrice: { type: Number },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

bookingSchema.index({ "pickupLocation.coordinates": "2dsphere" });
bookingSchema.index({ "dropoffLocation.coordinates": "2dsphere" });

const clearCache = async (userId) => {
  await redis.del(`bookingStats:${userId}`);
};

bookingSchema.post("save", async function () {
  await clearCache(this.user.toString());
  await clearCache(this?.driver?.toString());
});

bookingSchema.post("remove", async function () {
  await clearCache(this.user.toString());
  await clearCache(this?.driver?.toString());
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
