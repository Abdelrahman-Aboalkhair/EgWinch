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
        validate: {
          validator: (date) =>
            date < new Date() && date > new Date("1900-01-01"),
          message: "Invalid date of birth",
        },
      },
      address: { type: String, trim: true },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
      },
      experienceYears: { type: Number, min: 0, max: 50 },
      licenseInfo: {
        number: { type: String, unique: true },
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
      model: { type: String },
      type: {
        type: String,
        enum: ["winch", "tow truck", "flatbed"],
      },
      plateNumber: { type: String, unique: true },
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
driverSchema.index({ status: 1 });
driverSchema.index({ isAvailable: 1 });

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

// *Only force required when the onboarding is being updated to "completed"
// *This ensures that we can save each step at a time e.g => personalInfo, vehicleInfo
driverSchema.pre("save", function (next) {
  if (this.onboardingStep === "completed") {
    const missingFields = [];

    if (!this.personalInfo?.phoneNumber) missingFields.push("phoneNumber");
    if (!this.personalInfo?.dateOfBirth) missingFields.push("dateOfBirth");
    if (!this.personalInfo?.address) missingFields.push("address");
    if (!this.personalInfo?.gender) missingFields.push("gender");
    if (!this.personalInfo?.experienceYears)
      missingFields.push("experienceYears");
    if (!this.personalInfo?.licenseInfo?.number)
      missingFields.push("licenseInfo.number");
    if (!this.personalInfo?.licenseInfo?.expiry)
      missingFields.push("licenseInfo.expiry");

    if (!this.vehicleInfo?.model) missingFields.push("vehicleInfo.model");
    if (!this.vehicleInfo?.type) missingFields.push("vehicleInfo.type");
    if (!this.vehicleInfo?.plateNumber)
      missingFields.push("vehicleInfo.plateNumber");
    if (!this.vehicleInfo?.color) missingFields.push("vehicleInfo.color");

    if (!this.documents?.profilePicture?.public_id)
      missingFields.push("documents.profilePicture.public_id");
    if (!this.documents?.profilePicture?.secure_url)
      missingFields.push("documents.profilePicture.secure_url");
    if (!this.documents?.licenseImage?.public_id)
      missingFields.push("documents.licenseImage.public_id");
    if (!this.documents?.licenseImage?.secure_url)
      missingFields.push("documents.licenseImage.secure_url");
    if (!this.documents?.vehicleImage?.public_id)
      missingFields.push("documents.vehicleImage.public_id");
    if (!this.documents?.vehicleImage?.secure_url)
      missingFields.push("documents.vehicleImage.secure_url");

    if (missingFields.length > 0) {
      return next(
        new Error(`Missing required fields: ${missingFields.join(", ")}`)
      );
    }
  }

  if (this.licenseInfo.expiry < new Date()) {
    this.status = "pending";
    this.isAvailable = false;
  }
  next();
});

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
