const mongoose = require("mongoose");
const BaseUser = require("./baseUser.model");

const DriverSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    address: { type: String, required: true },

    vehicle: {
      vehicleModel: { type: String, required: true },
      vehicleType: { type: String, required: true },
      plateNumber: { type: String, required: true, unique: true },
    },

    documents: {
      profilePicture: { type: String, required: true },
      licenseImage: { type: String, required: true },
    },

    onboardingStatus: {
      type: String,
      enum: [
        "pending_personal_info",
        "personal_info_submitted",
        "vehicle_info_submitted",
        "documents_uploaded",
        "pending_approval",
        "approved",
        "rejected",
      ],
      default: "pending_personal_info",
    },

    adminApprovalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    adminApprovalComment: { type: String },
  },
  { timestamps: true }
);

const Driver = BaseUser.discriminator("Driver", DriverSchema);
module.exports = Driver;
