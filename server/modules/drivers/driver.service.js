const Driver = require("./driver.model");
const User = require("../users/user.model");
const AppError = require("../../utils/AppError");

class DriverService {
  static async startOnboarding(userId) {
    let driver = await Driver.findOne({ user: userId });
    if (driver) return driver;

    driver = await Driver.create({ user: userId });

    await User.findByIdAndUpdate(userId, { role: "driver" });

    return driver;
  }

  static async updateOnboardingStep(step, data) {
    const driver = await Driver.findByIdAndUpdate(
      data.driverId,
      { ...data, onboardingStep: step },
      { new: true }
    );

    if (!driver) throw new AppError(404, "Driver not found");

    return driver;
  }

  static async updateApplicationStatus(driverId, status, rejectionReason) {
    const driver = await Driver.findById(driverId);
    if (!driver) throw new AppError(404, "Driver not found");

    if (!["approved", "rejected"].includes(status)) {
      throw new AppError(400, "Invalid status update");
    }

    const updateFields = { status };
    if (status === "approved") {
      updateFields.onboardingStep = "completed";
    } else if (status === "rejected") {
      updateFields.rejectionReason = rejectionReason;
    }

    await Driver.findByIdAndUpdate(driverId, { $set: updateFields });

    return { success: true, message: `Driver application ${status}` };
  }
}

module.exports = DriverService;
