const DriverService = require("./driver.service");
const asyncHandler = require("../../utils/asyncHandler");
const sendResponse = require("../../utils/sendResponse");

exports.startOnboarding = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const response = await DriverService.startOnboarding(userId, req.body);
  sendResponse(
    res,
    201,
    { response },
    "Driver onboarding started successfully"
  );
});

exports.updateStep = asyncHandler(async (req, res) => {
  const { step } = req.params;
  console.log("req.body: ", req.body);
  console.log("req.files: ", req.files); // Log uploaded files

  const documentUrls = req.files.map((file) => file.path);

  const updateData = {
    ...req.body,
    documents: documentUrls,
  };

  const response = await DriverService.updateOnboardingStep(step, updateData);

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
