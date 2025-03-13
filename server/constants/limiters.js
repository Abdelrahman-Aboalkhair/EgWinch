const rateLimit = require("express-rate-limit");

exports.limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message:
    "Too many authentication attempts from this IP, please try again later.",
});

exports.passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: "Too many password reset requests. Please try again later.",
});

exports.signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Too many sign-up attempts. Please try again later.",
});

exports.otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Too many OTP requests. Please wait before requesting a new code.",
});

exports.failedLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many failed login attempts. Please try again later.",
});

exports.refreshTokenLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message:
    "Too many refresh token requests. Please wait before requesting again.",
});
