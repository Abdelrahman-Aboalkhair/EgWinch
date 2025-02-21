const sendEmail = require("../utils/sendEmail");
const User = require("../models/baseUser.model");
const Driver = require("../models/driver.model");
const { uploadImage } = require("../utils/uploadImage");
const fs = require("fs");

/**
 * STEP 1: Save Driver's Personal Information
 */
exports.saveDriverPersonalInfo = async (req, res) => {
  try {
    const { userId, fullName, phoneNumber, dateOfBirth, address } = req.body;

    if (!userId || !fullName || !phoneNumber || !dateOfBirth || !address) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "driver") {
      return res.status(404).json({ message: "Driver not found." });
    }

    // Update driver's personal info
    await Driver.findOneAndUpdate(
      { user: userId },
      {
        fullName,
        phoneNumber,
        dateOfBirth,
        address,
        onboardingStatus: "personal_info_submitted",
      },
      { new: true, upsert: true }
    );

    res
      .status(200)
      .json({ message: "Personal information saved successfully." });
  } catch (error) {
    console.error("Error saving driver personal info:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * STEP 2: Save Driver's Vehicle Information
 */
exports.saveDriverVehicleInfo = async (req, res) => {
  try {
    const { userId, vehicleModel, vehicleType, plateNumber } = req.body;

    if (!userId || !vehicleModel || !vehicleType || !plateNumber) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const driver = await Driver.findOne({ user: userId });
    if (!driver) {
      return res.status(404).json({ message: "Driver not found." });
    }

    // Update vehicle details
    driver.vehicle = { vehicleModel, vehicleType, plateNumber };
    driver.onboardingStatus = "vehicle_info_submitted";
    await driver.save();

    res
      .status(200)
      .json({ message: "Vehicle information saved successfully." });
  } catch (error) {
    console.error("Error saving driver vehicle info:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * STEP 3: Upload Driver's Documents (Profile Picture & License)
 */
exports.uploadDriverDocuments = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId || !req.files) {
      return res.status(400).json({ message: "Files are required." });
    }

    const driver = await Driver.findOne({ user: userId });
    if (!driver) {
      return res.status(404).json({ message: "Driver not found." });
    }

    let profilePictureUrl = null;
    let licenseImageUrl = null;

    // Upload Profile Picture
    if (req.files.profilePicture) {
      const profilePicPath = req.files.profilePicture[0].path;
      profilePictureUrl = await uploadImage(profilePicPath);
      fs.unlinkSync(profilePicPath); // Delete local file after upload
    }

    // Upload License Image
    if (req.files.licenseImage) {
      const licensePath = req.files.licenseImage[0].path;
      licenseImageUrl = await uploadImage(licensePath);
      fs.unlinkSync(licensePath);
    }

    driver.documents = {
      profilePicture: profilePictureUrl || driver.documents.profilePicture,
      licenseImage: licenseImageUrl || driver.documents.licenseImage,
    };
    driver.onboardingStatus = "documents_uploaded";
    await driver.save();

    res.status(200).json({ message: "Documents uploaded successfully." });
  } catch (error) {
    console.error("Error uploading driver documents:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * STEP 4: Submit Driver Application (Await Admin Approval)
 */
exports.submitDriverApplication = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const driver = await Driver.findOne({ user: userId });
    if (!driver) {
      return res.status(404).json({ message: "Driver not found." });
    }

    // Check if all steps are completed
    if (
      !driver.fullName ||
      !driver.phoneNumber ||
      !driver.vehicle ||
      !driver.documents.profilePicture ||
      !driver.documents.licenseImage
    ) {
      return res
        .status(400)
        .json({ message: "Complete all steps before submitting." });
    }

    driver.onboardingStatus = "pending_approval";
    await driver.save();

    // Notify Admin (optional)
    await sendEmail({
      to: "admin@example.com",
      subject: "New Driver Application Submitted",
      text: `A new driver has submitted their application and is awaiting approval. Driver ID: ${driver._id}`,
    });

    res.status(200).json({
      message: "Application submitted successfully. Awaiting approval.",
    });
  } catch (error) {
    console.error("Error submitting driver application:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * STEP 5: Admin Approves/Rejects Driver
 */

exports.updateOnboardingStatus = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { status, rejectionReason } = req.body;

    // Validate status input
    if (!["approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status. Use 'approved' or 'rejected'." });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Update status based on approval or rejection
    driver.onboardingStatus = status;
    driver.adminApprovalStatus = status;

    if (status === "rejected") {
      driver.adminApprovalComment = rejectionReason || "No reason provided";
    } else {
      driver.adminApprovalComment = null; // Clear previous rejection comments if approved
    }

    await driver.save();

    res.status(200).json({ message: `Driver ${status} successfully.` });
  } catch (error) {
    console.error("Error updating onboarding status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
