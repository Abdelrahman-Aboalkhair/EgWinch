const mongoose = require("mongoose");
const redis = require("../lib/redis");

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    pickupLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
    },
    dropoffLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
    },
    moveDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "in-progress", "completed", "declined"],
      default: "pending",
    },
    additionalServices: {
      type: [String],
      default: [],
    },
    items: {
      type: [
        {
          name: String,
          quantity: Number,
          isFragile: Boolean,
          specialInstructions: String,
          additionalServices: [String],
        },
      ],
      required: true,
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
    totalPrice: {
      type: Number,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Function to clear cache when data changes
const clearCache = async (userId) => {
  await redis.del(`bookingStats:${userId}`);
};

// Call this function when booking changes
bookingSchema.post("save", async function () {
  await clearCache(this.customer.toString());
  await clearCache(this?.driver?.toString());
});

bookingSchema.post("remove", async function () {
  await clearCache(this.customer.toString());
  await clearCache(this?.driver?.toString());
});

// Create a geospatial index for pickup and dropoff locations
bookingSchema.index({ "pickupLocation.coordinates": "2dsphere" });
bookingSchema.index({ "dropoffLocation.coordinates": "2dsphere" });

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
