const Joi = require("joi");
const validateRequest = require("../../utils/validateRequest");

const personalInfoSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
    .required(),
  dateOfBirth: Joi.date().max("now").min("1900-01-01").required(),
  address: Joi.string().trim().required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  experienceYears: Joi.number().min(0).max(50).required(),
  licenseInfo: Joi.object({
    number: Joi.string().required(),
    expiry: Joi.date().greater("now").required(),
  }).required(),
});

const vehicleInfoSchema = Joi.object({
  model: Joi.string().required(),
  type: Joi.string().valid("winch", "tow truck", "flatbed").required(),
  plateNumber: Joi.string().required(),
  color: Joi.string().required(),
});

const documentsSchema = Joi.object({
  profilePicture: Joi.object({
    public_id: Joi.string().required(),
    secure_url: Joi.string().required(),
  }).required(),
  licenseImage: Joi.object({
    public_id: Joi.string().required(),
    secure_url: Joi.string().required(),
  }).required(),
  vehicleImage: Joi.object({
    public_id: Joi.string().required(),
    secure_url: Joi.string().required(),
  }).required(),
});

const updateStepSchema = Joi.object({
  onboardingStep: Joi.string()
    .valid("personal", "vehicle", "documents", "completed")
    .required(),
  // condionally render the validation logic based on the current onboarding step
  data: Joi.alternatives().conditional("onboardingStep", {
    switch: [
      { is: "personal", then: personalInfoSchema },
      { is: "vehicle", then: vehicleInfoSchema },
      { is: "documents", then: documentsSchema },
    ],
    otherwise: Joi.forbidden(),
  }),
});

const validateUpdateStep = validateRequest(updateStepSchema);

module.exports = {
  validateUpdateStep,
};
