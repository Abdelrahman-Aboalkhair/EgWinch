const Driver = require("./driver.model");
const User = require("../users/user.model");
const { uploadImage } = require("../../utils/uploadImage");
const asyncHandler = require("../../utils/asyncHandler");

class DriverService {
  static startOnboarding = asyncHandler(async (userId) => {
    let driver = await Driver.findOne({ user: userId });
    if (driver) return driver;

    driver = new Driver({ user: userId });
    await driver.save();

    await User.findByIdAndUpdate(userId, { role: "driver" });

    return driver;
  });

  static updateOnboardingStep = asyncHandler(
    async (userId, step, data, files) => {
      const validSteps = [
        "personal_info",
        "vehicle_info",
        "documents",
        "completed",
      ];
      if (!validSteps.includes(step)) {
        throw new Error("Invalid onboarding step");
      }

      let driver = await Driver.findOne({ user: userId });
      if (!driver) throw new Error("Driver not found");

      if (step === "personal_info") {
        driver.personalInfo = { ...driver.personalInfo, ...data };
      }

      if (step === "vehicle_info") {
        driver.vehicleInfo = { ...driver.vehicleInfo, ...data };
      }

      if (step === "documents") {
        if (!files || !files.length) {
          throw new Error("No documents uploaded");
        }

        driver.documents = await Promise.all(
          files.map((file) => uploadImage(file))
        );
      }

      driver.onboardingStep = step;

      if (step === "completed") {
        driver.status = "inProgress";
      }

      await driver.save();
      return driver;
    }
  );

  static updateApplicationStatus = asyncHandler(
    async (driverId, status, rejectionReason) => {
      const driver = await Driver.findById(driverId);
      if (!driver) throw new Error("Driver not found");

      if (!["approved", "rejected"].includes(status)) {
        throw new Error("Invalid status update");
      }

      let updateField = { status };
      if (status === "approved") {
        updateField.onboardingStep = "completed";
      } else if (status === "rejected") {
        updateField.rejectionReason = rejectionReason;
      }

      await Driver.findByIdAndUpdate(driverId, { $set: updateField });

      return { success: true, message: `Driver application ${status}` };
    }
  );
}

module.exports = DriverService;
