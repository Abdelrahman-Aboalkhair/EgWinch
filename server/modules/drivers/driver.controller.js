const DriverService = require("./driver.service");
const asyncHandler = require("../../utils/asyncHandler");
const AppError = require("../../utils/AppError");
const sendResponse = require("../../utils/sendResponse");

exports.startOnboarding = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const response = await DriverService.startOnboarding(userId);
  sendResponse(
    res,
    201,
    { response },
    "Driver onboarding started successfully"
  );
});

exports.updateStep = asyncHandler(async (req, res) => {
  const { step } = req.params;

  const response = await DriverService.updateOnboardingStep(step, req.body);

  sendResponse(res, 200, { response }, "Onboarding step updated successfully");
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const { driverId, status, rejectionReason } = req.body;
  const response = await DriverService.updateApplicationStatus(
    driverId,
    status,
    rejectionReason
  );

  sendResponse(res, 200, { response }, "Driver application status updated");
});
