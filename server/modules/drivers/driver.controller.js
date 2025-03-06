const DriverService = require("./driver.service");
const asyncHandler = require("../../utils/asyncHandler");
const AppError = require("../../utils/AppError");

exports.startOnboarding = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const response = await DriverService.startOnboarding(userId);
  res.status(201).json({
    success: true,
    message: "Driver onboarding started successfully",
    data: response,
  });
});

exports.updateStep = asyncHandler(async (req, res) => {
  const { step } = req.params;
  console.log("Received request for step:", step);
  console.log("Request body:", req.body);

  const files = req.files || [];
  let data = { ...req.body };

  // if (data.dateOfBirth) {
  //   data.dateOfBirth = new Date(data.dateOfBirth);
  //   if (isNaN(data.dateOfBirth.getTime())) {
  //     throw new AppError(400, "Invalid date of birth");
  //   }
  // }

  const response = await DriverService.updateOnboardingStep(
    req.user.userId,
    step,
    data,
    files
  );

  res.status(200).json(response);
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const { driverId, status, rejectionReason } = req.body;
  const response = await DriverService.updateApplicationStatus(
    driverId,
    status,
    rejectionReason
  );
  res.json(response);
});
