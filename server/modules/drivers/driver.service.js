const Driver = require("./driver.model");
const User = require("../users/user.model");
const { uploadImage } = require("../../utils/uploadImage");
const fs = require("fs");

class DriverService {
  static async startOnboarding(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const existingDriver = await Driver.findOne({ user: userId });
    if (existingDriver) throw new Error("Driver onboarding already started");

    const driver = await Driver.create({
      user: userId,
      currentStep: "personal_info",
      steps: {
        personalInfo: { completed: false, data: {} },
        vehicleInfo: { completed: false, data: {} },
        documents: { completed: false, data: {} },
      },
      status: "pending",
    });

    await User.findByIdAndUpdate(userId, { role: "driver" });

    return driver;
  }

  static async updateDriverProfile(userId, step, data, files) {
    const driver = await Driver.findOne({ user: userId });
    if (!driver) throw new Error("Driver profile not found");

    const stepsOrder = [
      "personal_info",
      "vehicle_info",
      "documents",
      "review",
      "completed",
    ];
    const currentIndex = stepsOrder.indexOf(driver.currentStep);

    let updateField = {};

    switch (step) {
      case "personal_info":
        if (
          !data.phoneNumber ||
          !data.address ||
          !data.gender ||
          !data.dateOfBirth ||
          !data.experienceYears
        ) {
          throw new Error("Missing required fields");
        }
        updateField = {
          "steps.personalInfo": { completed: true, data },
          currentStep: "vehicle_info",
        };
        break;

      case "vehicle_info":
        if (
          !data.vehicleModel ||
          !data.vehicleType ||
          !data.plateNumber ||
          !data.licenseNumber ||
          !data.licenseExpiry ||
          !data.vehicleColor
        ) {
          throw new Error("Missing required fields");
        }
        updateField = {
          "steps.vehicleInfo": { completed: true, data },
          currentStep: "documents",
        };
        break;

      case "documents":
        const requiredDocs = ["profilePicture", "licenseImage", "vehicleImage"];
        const missingDocs = requiredDocs.filter((doc) => !files[doc]);
        if (missingDocs.length > 0) {
          throw new Error(
            `Missing required documents: ${missingDocs.join(", ")}`
          );
        }

        const uploadedImages = {};
        for (const doc of requiredDocs) {
          if (files[doc] && files[doc][0]) {
            const file = files[doc][0];
            uploadedImages[doc] = await uploadImage(file.path);
            fs.unlinkSync(file.path);
          }
        }

        updateField = {
          "steps.documents.data": uploadedImages,
          "steps.documents.completed": true,
          currentStep: "review",
          status: "inProgress",
        };
        break;

      case "review":
        updateField = {
          currentStep: "completed",
          status: "inProgress",
        };
        break;

      default:
        throw new Error("Invalid step");
    }

    await Driver.findOneAndUpdate(
      { user: userId },
      { $set: updateField },
      { new: true }
    );

    return { success: true, message: `Step ${step} updated successfully` };
  }

  static async reviewDriverApplication(driverId, status, rejectionReason) {
    const driver = await Driver.findById(driverId);
    if (!driver) throw new Error("Driver not found");

    if (!["approved", "rejected"].includes(status)) {
      throw new Error("Invalid status update");
    }

    let updateField = { status };
    if (status === "approved") {
      updateField.currentStep = "completed";
    } else if (status === "rejected") {
      updateField.rejectionReason = rejectionReason;
    }

    await Driver.findByIdAndUpdate(driverId, { $set: updateField });

    return { success: true, message: `Driver application ${status}` };
  }
}

module.exports = DriverService;
