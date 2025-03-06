const mongoose = require("mongoose");
const redis = require("../../lib/redis");

const driverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    onboardingStep: {
      type: String,
      enum: ["personal_info", "vehicle_info", "documents", "completed"],
      default: "personal_info",
    },
    personalInfo: {
      phoneNumber: {
        type: String,
      },
      dateOfBirth: {
        type: Date,
      },
      address: { type: String, trim: true },
      gender: { type: String, enum: ["male", "female", "other"] },
      experienceYears: { type: Number },
    },
    vehicleInfo: {
      vehicleModel: {
        type: String,
      },
      vehicleType: { type: String },
      plateNumber: { type: String },
      licenseNumber: { type: String },
      licenseExpiry: { type: Date },
      vehicleColor: { type: String },
    },
    documents: {
      profilePicture: {
        public_id: String,
        secure_url: String,
      },
      licenseImage: {
        public_id: String,
        secure_url: String,
      },
      vehicleImage: {
        public_id: String,
        secure_url: String,
      },
    },
    status: {
      type: String,
      enum: ["pending", "inProgress", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String, default: "" },
  },
  { timestamps: true }
);

const clearCache = async (userId) => {
  await redis.del(`driverStats:${userId}`);
};

driverSchema.post("save", async function () {
  await clearCache(this.user.toString());
});

driverSchema.post("remove", async function () {
  await clearCache(this.user.toString());
});

const Driver = mongoose.model("Driver", driverSchema);
module.exports = Driver;
