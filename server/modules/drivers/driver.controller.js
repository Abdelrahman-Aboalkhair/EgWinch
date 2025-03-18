const DriverService = require("./driver.service");
const asyncHandler = require("../../utils/asyncHandler");
const sendResponse = require("../../utils/sendResponse");
const uploadImage = require("../../utils/uploadImage");

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
  console.log("req.files: ", req.files);
  console.log("req.body: ", req.body);
  const { step } = req.params;
  let documentUrls = {};

  if (req.files) {
    const fileFields = ["profilePicture", "licenseImage", "vehicleImage"];

    for (const field of fileFields) {
      if (req.files[field]) {
        const filePath = req.files[field][0].path;
        const uploadResult = await uploadImage(filePath);
        console.log("uploadResult: ", uploadResult);
        documentUrls[field] = {
          secure_url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        };
      }
    }
  }

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
