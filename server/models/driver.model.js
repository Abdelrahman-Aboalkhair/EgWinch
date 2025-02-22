const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    steps: {
      personalInfo: {
        completed: { type: Boolean, default: false },
        data: {
          phoneNumber: { type: String, required: false },
          dateOfBirth: { type: Date, required: false },
          address: { type: String, required: false },
          gender: { type: String, enum: ["male", "female", "other"] },
          experienceYears: { type: Number, required: false },
        },
      },
      vehicleInfo: {
        completed: { type: Boolean, default: false },
        data: {
          vehicleModel: { type: String, required: false },
          vehicleType: { type: String, required: false },
          plateNumber: { type: String, required: false },
          licenseNumber: { type: String, required: false },
          licenseExpiry: { type: Date, required: false },
          vehicleColor: { type: String, required: false },
        },
      },
      documents: {
        completed: { type: Boolean, default: false },
        data: {
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
      },
    },
    currentStep: {
      type: String,
      enum: [
        "personal_info",
        "vehicle_info",
        "documents",
        "review",
        "completed",
      ],
      default: "personal_info",
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

const Driver = mongoose.model("Driver", driverSchema);

module.exports = Driver;
