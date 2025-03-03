const Driver = require("./driver.model");
const { uploadImage } = require("../../utils/uploadImage");
const User = require("../users/user.model");
const fs = require("fs");

exports.startOnboarding = async (req, res) => {
  try {
    const { userId } = req.user;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if driver record already exists
    const existingDriver = await Driver.findOne({ user: userId });
    if (existingDriver) {
      return res.status(400).json({
        success: false,
        message: "Driver onboarding already started",
      });
    }

    // Create new driver record
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

    // Update user role
    await User.findByIdAndUpdate(userId, { role: "driver" });

    res.status(201).json({
      success: true,
      message: "Driver onboarding started successfully",
      data: {
        currentStep: driver.currentStep,
        steps: driver.steps,
        status: driver.status,
      },
    });
  } catch (error) {
    console.error("Start Onboarding Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.updateDriverProfile = async (req, res) => {
  try {
    const { step, data } = req.body;
    const driver = await Driver.findOne({ user: req.user.userId });

    if (!driver)
      return res.status(404).json({ message: "Driver profile not found" });

    // Step validation order
    const stepsOrder = [
      "personal_info",
      "vehicle_info",
      "documents",
      "review",
      "completed",
    ];
    const currentIndex = stepsOrder.indexOf(driver.currentStep);

    // if (currentIndex === -1 || step !== stepsOrder[currentIndex])
    //   return res.status(400).json({ message: "Invalid step progression" });

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
          return res.status(400).json({ message: "Missing required fields" });
        }
        updateField["steps.personalInfo"] = { completed: true, data };
        updateField["currentStep"] = "vehicle_info";
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
          return res.status(400).json({ message: "Missing required fields" });
        }
        updateField["steps.vehicleInfo"] = { completed: true, data };
        updateField["currentStep"] = "documents";
        break;

      case "documents":
        console.log("it is a documents step");
        const files = req.files;
        console.log("files: ", files);

        // Check for missing required documents
        const requiredDocs = ["profilePicture", "licenseImage", "vehicleImage"];
        const missingDocs = requiredDocs.filter((doc) => !files[doc]);

        if (missingDocs.length > 0) {
          return res.status(400).json({
            success: false,
            message: `Missing required documents: ${missingDocs.join(", ")}`,
          });
        }

        try {
          // Upload images dynamically
          const uploadedImages = {};
          for (const doc of requiredDocs) {
            if (files[doc] && files[doc][0]) {
              const file = files[doc][0];
              uploadedImages[doc] = await uploadImage(file.path);

              fs.unlinkSync(file.path);
            }
          }

          // Update fields
          Object.assign(updateField, {
            "steps.documents.data": uploadedImages,
            "steps.documents.completed": true,
            currentStep: "review",
            status: "inProgress",
          });
        } catch (uploadError) {
          console.log("Error uploading images:", uploadError);
          // Clean up any temporary files in case of error
          Object.values(files).forEach((fileArray) => {
            if (fileArray && fileArray[0]) {
              try {
                fs.unlinkSync(fileArray[0].path);
              } catch (unlinkError) {
                console.error("Error deleting temp file:", unlinkError);
              }
            }
          });

          throw uploadError;
        }
        break;

      case "review":
        updateField["currentStep"] = "completed";
        updateField["status"] = "inProgress";
        break;

      default:
        return res.status(400).json({ message: "Invalid step" });
    }

    await Driver.findOneAndUpdate(
      { user: req.user.userId },
      { $set: updateField },
      { new: true }
    );

    res.json({ success: true, message: `Step ${step} updated successfully` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
  }
};

exports.reviewDriverApplication = async (req, res) => {
  try {
    const { driverId, status, rejectionReason } = req.body;

    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    if (!["approved", "rejected"].includes(status))
      return res.status(400).json({ message: "Invalid status update" });

    let updateField = { status };

    if (status === "approved") {
      updateField.currentStep = "completed";
    } else if (status === "rejected") {
      updateField.rejectionReason = rejectionReason;
    }

    await Driver.findByIdAndUpdate(driverId, { $set: updateField });

    res.json({ success: true, message: `Driver application ${status}` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
