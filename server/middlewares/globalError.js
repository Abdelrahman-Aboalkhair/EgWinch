const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");

const handleValidationError = (err) => {
  const message = Object.values(err.errors)
    .map((val) => val.message)
    .join(", ");
  return new ApiError(message, 400);
};

const handleDuplicateKeyError = (err) => {
  return new ApiError("Duplicate field value entered", 400);
};

const handleCastError = (err) => {
  return new ApiError(`Invalid ${err.path}: ${err.value}`, 400);
};

const handleTokenExpiredError = () => {
  return new ApiError("Invalid or expired token, please login again.", 403);
};

const globalError = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message || "Internal Server Error";
  error.statusCode = err.statusCode || 500;

  // Handle specific errors
  if (err.name === "ValidationError") error = handleValidationError(err);
  if (err.code === 11000) error = handleDuplicateKeyError(err);
  if (err.name === "CastError") error = handleCastError(err);
  if (err.name === "TokenExpiredError") error = handleTokenExpiredError();

  logger.error(
    `[${req.method}] ${req.originalUrl} - ${error.statusCode} - ${error.message}`
  );

  // Send error response
  res.status(error.statusCode).json({
    status: error.statusCode.toString().startsWith("4") ? "fail" : "error",
    message: error.message,
  });
};

module.exports = globalError;
