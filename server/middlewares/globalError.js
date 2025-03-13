const AppError = require("../utils/AppError");
const logger = require("../config/logger");

const errorHandlers = {
  ValidationError: (err) =>
    new AppError(
      400,
      Object.values(err.errors)
        .map((val) => val.message)
        .join(", ")
    ),
  11000: () => new AppError(400, "Duplicate field value entered"),
  CastError: (err) => new AppError(400, `Invalid ${err.path}: ${err.value}`),
  TokenExpiredError: () =>
    new AppError(401, "Your session has expired, please login again."),
  Joi: (err) =>
    new AppError(400, err.details.map((detail) => detail.message).join(", ")),
};

const globalError = (err, req, res, next) => {
  let error = err;

  if (errorHandlers[err.name] || errorHandlers[err.code]) {
    error = (errorHandlers[err.name] || errorHandlers[err.code])(err);
  }

  if (process.env.NODE_ENV === "development") {
    console.error("Error Stack:", err.stack);
    logger.error({
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode || 500,
      path: req.originalUrl,
      method: req.method,
    });
  }

  if (process.env.NODE_ENV === "production" && error.isOperational) {
    logger.error(
      `[${req.method}] ${req.originalUrl} - ${error.statusCode} - ${error.message}`
    );
  }

  res.status(error.statusCode || 500).json({
    status:
      error.statusCode >= 400 && error.statusCode < 500 ? "fail" : "error",
    message: error.message,
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
      error: error,
    }),
  });
};

module.exports = globalError;
