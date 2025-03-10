const Joi = require("joi");
const validateRequest = require("../../utils/validateRequest");

const signupSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.min": "Name must be at least 3 characters long",
    "string.max": "Name cannot exceed 50 characters",
    "any.required": "Name is required",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(8)
    .max(32)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,32}$"
      )
    )
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password cannot exceed 32 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      "any.required": "Password is required",
    }),

  profilePicture: Joi.object({
    public_id: Joi.string().optional(),
    secure_url: Joi.string().uri().optional().messages({
      "string.uri": "Profile picture secure_url must be a valid URL",
    }),
  }).optional(),
}).options({ stripUnknown: true }); // Removes unexpected fields

const verifyEmailSchema = Joi.object({
  emailVerificationCode: Joi.string().length(4).required(),
});

const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const refreshTokenSchema = Joi.object({
  cookies: Joi.object({
    refreshToken: Joi.string().required().messages({
      "string.empty": "Refresh token is required",
    }),
  }).unknown(true), // Allow other cookies
});

const googleAuthSchema = Joi.object({
  access_token: Joi.string().required().messages({
    "string.empty": "Google access token is required",
  }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    "any.required": "Reset token is required",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "New password is required",
  }),
});

const validateRegister = validateRequest(signupSchema);
const validateVerifyEmail = validateRequest(verifyEmailSchema);
const validateSignin = validateRequest(signinSchema);
const validateRefreshToken = validateRequest(refreshTokenSchema);
const validateGoogleAuth = validateRequest(googleAuthSchema);
const validateForgotPassword = validateRequest(forgotPasswordSchema);
const validateResetPassword = validateRequest(resetPasswordSchema);

module.exports = {
  validateRegister,
  validateVerifyEmail,
  validateSignin,
  validateRefreshToken,
  validateGoogleAuth,
  validateForgotPassword,
  validateResetPassword,
};
