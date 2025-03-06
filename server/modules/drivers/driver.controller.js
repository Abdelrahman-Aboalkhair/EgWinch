const DriverService = require("./driver.service");
const asyncHandler = require("../../utils/asyncHandler");

exports.startOnboarding = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const response = await DriverService.startOnboarding(userId);
  res.status(201).json({
    success: true,
    message: "Driver onboarding started successfully",
    data: response,
  });
});

exports.updateDriverProfile = asyncHandler(async (req, res) => {
  const { step, data } = req.body;
  const response = await DriverService.updateDriverProfile(
    req.user.userId,
    step,
    data,
    req.files
  );
  res.json(response);
});

exports.reviewDriverApplication = asyncHandler(async (req, res) => {
  const { driverId, status, rejectionReason } = req.body;
  const response = await DriverService.reviewDriverApplication(
    driverId,
    status,
    rejectionReason
  );
  res.json(response);
});
