const Joi = require("joi");
const validateRequest = require("../../utils/validateRequest");

const createBookingSchema = Joi.object({});
const updateStepSchema = Joi.object({});
const updateBookingSchema = Joi.object({});
const completeBookingSchema = Joi.object({});
const createOfferSchema = Joi.object({});

const validateCreateBooking = validateRequest(createBookingSchema);
const validateUpdateStep = validateRequest(updateStepSchema);
const validateUpdateBooking = validateRequest(updateBookingSchema);
const validateCompleteBooking = validateRequest(completeBookingSchema);
const validateCreateOffer = validateRequest(createOfferSchema);

module.exports = {
  validateCreateBooking,
  validateUpdateStep,
  validateUpdateBooking,
  validateCompleteBooking,
  validateCreateOffer,
};
