const mongoose = require("mongoose");
const redis = require("../../lib/redis");

const driverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    personalInfo: {
      phoneNumber: {
        type: String,
        match: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
      },
      dateOfBirth: {
        type: Date,
      },
      address: { type: String, trim: true },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
      },
      experienceYears: { type: Number, min: 0, max: 50 },
      licenseInfo: {
        number: { type: String },
        expiry: {
          type: Date,
          validate: {
            validator: (date) => date > new Date(),
            message: "License must not be expired",
          },
        },
      },
    },

    vehicleInfo: {
      model: { type: Date },
      type: {
        type: String,
        enum: ["winch", "tow truck", "flatbed"],
      },
      plateNumber: { type: String },
      color: { type: String },
    },

    documents: {
      profilePicture: {
        public_id: { type: String },
        secure_url: { type: String },
      },
      licenseImage: {
        public_id: { type: String },
        secure_url: { type: String },
      },
      vehicleImage: {
        public_id: { type: String },
        secure_url: { type: String },
      },
    },

    onboardingStep: {
      type: String,
      enum: ["personal", "vehicle", "documents", "completed"],
      default: "personal",
    },

    status: {
      type: String,
      enum: ["pending", "inProgress", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: { type: String, default: "" },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: { type: [Number], default: [0, 0] },
    },

    isAvailable: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

driverSchema.index({ location: "2dsphere" });

driverSchema.virtual("age").get(function () {
  return Math.floor((new Date() - this.personalInfo.dateOfBirth) / 31557600000);
});

driverSchema.methods.isLicenseValid = function () {
  return this.licenseInfo.expiry > new Date();
};

driverSchema.methods.canAcceptRequests = function () {
  return (
    this.status === "approved" &&
    this.isAvailable &&
    this.onboardingStep === "completed" &&
    this.isLicenseValid()
  );
};

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
