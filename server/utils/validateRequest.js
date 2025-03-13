const AppError = require("../utils/AppError");
const sanitizeInput = require("./sanitizeInput");

const validateRequest = (schema) => (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    });
  }
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((detail) => detail.message).join(", ");
    return next(new AppError(400, message));
  }

  req.body = value;
  next();
};

module.exports = validateRequest;
