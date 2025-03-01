const sendEmail = require("../utils/sendEmail");
const cookieOptions = require("../constants/cookieOptions");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("req.body: ", req.body);

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered, please sign in",
      });
    }

    // Generate email verification token
    const emailVerificationCode = Math.random().toString().slice(-4);
    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new User
    const newUser = await User.create({
      name,
      email,
      password,
      emailVerificationCode,
      verificationCodeExpiry,
      profilePicture: {
        public_id: "",
        secure_url: "",
      },
    });

    await sendEmail({
      to: email,
      subject: "Verify Your Email - EgWinch",
      text: `Your verification code is: ${emailVerificationCode}`,
      code: emailVerificationCode,
    });

    // Generate tokens
    const accessToken = await newUser.generateAccessToken();
    const refreshToken = await newUser.generateRefreshToken();

    // Store refresh token
    res.cookie("refreshToken", refreshToken, cookieOptions);
    newUser.refreshToken.push(refreshToken);
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Signed up successfully. Please verify your email.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        emailVerified: newUser.emailVerified,
        profilePicture: newUser.profilePicture || "",
      },
      accessToken,
    });
  } catch (error) {
    console.error("User Signup Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during signup.",
      error: error.message,
    });
  }
};

exports.verfiyEmail = async (req, res) => {
  const { emailVerificationCode } = req.body;
  console.log("emailVerificationCode: ", emailVerificationCode);
  try {
    const user = await User.findOne({
      emailVerificationCode,
      verificationCodeExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }

    user.emailVerificationCode = null;
    user.verificationCodeExpiry = null;
    user.emailVerified = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred during email verification.",
    });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: `There's not user found with this email, please sign up first`,
      });
    }

    if (user.googleId) {
      return res.status(400).json({
        success: false,
        message:
          "This email is registered with Google, please sign in with Google",
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    res.cookie("refreshToken", refreshToken, cookieOptions);
    user.refreshToken.push(refreshToken);
    await user.save();

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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred during login.",
      error: error.message,
    });
  }
};
exports.signout = async (req, res) => {
  try {
    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred during logout.",
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req?.cookies?.refreshToken;
    console.log("refreshToken: ", refreshToken);

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

        if (!user.refreshToken.includes(refreshToken)) {
          return res.status(403).json({
            success: false,
            message: "Refresh token is invalid or has been used",
          });
        }

        // Remove the old refresh token
        user.refreshToken = user.refreshToken.filter(
          (token) => token !== refreshToken
        );

        const newRefreshToken = await user.generateRefreshToken();
        const newAccessToken = await user.generateAccessToken();

        res.cookie("refreshToken", newRefreshToken, cookieOptions);
        user.refreshToken.push(newRefreshToken);
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
