const AppError = require("../utils/AppError");

const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false }); // ** abortEarly: false to get all errors
  if (error) {
    const message = error.details.map((detail) => detail.message).join(", ");
    return next(new AppError(400, message));
  }
  next();
};

module.exports = validateRequest;
