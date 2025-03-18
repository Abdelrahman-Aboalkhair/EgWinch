const cookieOptions = require("../../constants/cookieOptions");
const User = require("../users/user.model");
const jwt = require("jsonwebtoken");
const AuthService = require("./auth.service");
const asyncHandler = require("../../utils/asyncHandler");
const sendResponse = require("../../utils/sendResponse");

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, accessToken, refreshToken } = await AuthService.registerUser({
    name,
    email,
    password,
  });

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse(
    res,
    201,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        profilePicture: user.profilePicture || "",
      },
      accessToken,
    },
    "Signed up successfully. Please verify your email."
  );
});

exports.verifyEmail = asyncHandler(async (req, res) => {
  const { emailVerificationCode } = req.body;
  const result = await AuthService.verifyEmail(emailVerificationCode);

  sendResponse(res, 200, {}, result.message);
});

exports.signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await AuthService.signin({
    email,
    password,
  });

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse(
    res,
    200,
    {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        emailVerified: user.emailVerified,
        profilePicture: user.profilePicture
          ? {
              public_id: user.profilePicture.public_id,
              secure_url: user.profilePicture.secure_url,
            }
          : null,
      },
      accessToken,
    },
    "Signed in successfully"
  );
});

exports.signout = asyncHandler(async (req, res) => {
  const result = await AuthService.signout();
  res.clearCookie("refreshToken");

  sendResponse(res, 200, {}, result.message);
});

exports.googleSignup = asyncHandler(async (req, res) => {
  const { access_token } = req.body;
  const { user, accessToken, refreshToken } = await AuthService.googleSignup(
    access_token
  );

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse(
    res,
    201,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || "",
      },
      accessToken,
      refreshToken,
    },
    "Sign-up successful"
  );
});

exports.googleSignin = asyncHandler(async (req, res) => {
  const { access_token } = req.body;
  const { user, accessToken, refreshToken } = await AuthService.googleSignin(
    access_token
  );

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse(
    res,
    200,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        profilePicture: user.profilePicture || "",
      },
      accessToken,
      refreshToken,
    },
    "Login successful"
  );
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const response = await AuthService.forgotPassword(email);

  sendResponse(res, 200, response);
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const response = await AuthService.resetPassword(token, newPassword);

  sendResponse(res, 200, response);
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req?.cookies?.refreshToken;

  if (!refreshToken) {
    return sendResponse(res, 401, {}, "Refresh token is required");
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return sendResponse(res, 403, {}, "Invalid or expired refresh token");
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return sendResponse(res, 404, {}, "User not found");
      }

      const newRefreshToken = await user.generateRefreshToken();
      const newAccessToken = await user.generateAccessToken();

      res.cookie("refreshToken", newRefreshToken, cookieOptions);
      await user.save();

      sendResponse(res, 200, {
        accessToken: newAccessToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          profilePicture: user.profilePicture,
        },
      });
    }
  );
});
