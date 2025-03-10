const cookieOptions = require("../../constants/cookieOptions");
const User = require("../users/user.model");
const jwt = require("jsonwebtoken");
const AuthService = require("./auth.service");
const asyncHandler = require("../../utils/asyncHandler");

exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, accessToken, refreshToken } = await AuthService.registerUser({
    name,
    email,
    password,
  });

  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.status(201).json({
    success: true,
    message: "Signed up successfully. Please verify your email.",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      profilePicture: user.profilePicture || "",
    },
    accessToken,
  });
});

exports.verifyEmail = asyncHandler(async (req, res) => {
  const { emailVerificationCode } = req.body;
  const result = await AuthService.verifyEmail(emailVerificationCode);

  res.status(200).json({ success: true, message: result.message });
});

exports.signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await AuthService.signin({
    email,
    password,
  });

  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.status(200).json({
    success: true,
    message: "Signed in successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      emailVerified: user.emailVerified,
      profilePicture: {
        public_id: user.profilePicture.public_id,
        secure_url: user.profilePicture.secure_url,
      },
    },
    accessToken,
  });
});

exports.signout = asyncHandler(async (req, res) => {
  const result = await AuthService.signout();
  res.clearCookie("refreshToken");
  res.status(200).json({ success: true, message: result.message });
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req?.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token is required",
    });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired refresh token",
        });
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const newRefreshToken = await user.generateRefreshToken();
      const newAccessToken = await user.generateAccessToken();

      res.cookie("refreshToken", newRefreshToken, cookieOptions);
      await user.save();

      res.status(200).json({
        success: true,
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

exports.googleSignup = asyncHandler(async (req, res) => {
  const { access_token } = req.body;

  const { user, accessToken, refreshToken } = await AuthService.googleSignup(
    access_token
  );

  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.status(201).json({
    message: "Sign-up successful",
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture || "",
    },
  });
});

exports.googleSignin = asyncHandler(async (req, res) => {
  const { access_token } = req.body;

  const { user, accessToken, refreshToken } = await AuthService.googleSignin(
    access_token
  );

  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.json({
    message: "Login successful",
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      profilePicture: user.profilePicture || "",
    },
  });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log("email: ", email);
  const response = await AuthService.forgotPassword(email);
  res.json(response);
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  console.log("req.body: ", req.body);
  const response = await AuthService.resetPassword(token, newPassword);
  res.json(response);
});
