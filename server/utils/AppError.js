class AppError extends Error {
  constructor(statusCode, message, isOperational = true) {
    if (typeof statusCode !== "number") {
      throw new Error("AppError: statusCode must be a number");
    }
    if (typeof message !== "string") {
      throw new Error("AppError: message must be a string");
    }
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
