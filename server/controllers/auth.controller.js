const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSMS");
const cookieOptions = require("../constants/cookieOptions");
const User = require("../models/user.model");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const axios = require("axios");

exports.signup = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      password,
      role,
      registrationNumber,
      registrationExpiry,
      registrationImage,
      capacity,
      driverLicenseNumber,
      driverLicenseExpiry,
      driverLicenseImage,
    } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Email or phone number already in use.",
      });
      return;
    }

    const emailVerificationToken = Math.random().toString().slice(-4);

    const emailTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const newUser = await User.create({
      name,
      email,
      phoneNumber,
      password,
      role,
      emailVerificationToken,
      emailTokenExpiry,
      driverLicenseNumber,
      driverLicenseExpiry,
      driverLicenseImage,
      registrationNumber,
      registrationExpiry,
      registrationImage,
      capacity,
    });

    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      text: `Your verification code is: ${emailVerificationToken}`,
      html: `<p>Your verification code is: <strong>${emailVerificationToken}</strong></p>`,
    });

    const accessToken = await newUser.generateAccessToken();
    const refreshToken = await newUser.generateRefreshToken();

    res.cookie("refreshToken", refreshToken, cookieOptions);
    newUser.refreshToken.push(refreshToken);

    res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please verify your email and phone number.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified,
        profilePicture: newUser.profilePicture || "",
      },
      accessToken,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during signup.",
      error: error.message,
    });
  }
};

exports.verfiyEmail = async (req, res) => {
  const { emailVerificationToken } = req.body;
  console.log("req.body: ", req.body);
  console.log("emailVerificationToken: ", emailVerificationToken);
  try {
    const user = await User.findOne({
      emailVerificationToken,
      emailTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token.",
      });
    }

    user.emailVerificationToken = null;
    user.emailTokenExpiry = null;
    user.isEmailVerified = true;

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
        message: `There's not user found with this email ${email}`,
      });
    }

    if (user.googleId) {
      return res.status(400).json({
        success: false,
        message: "Please sign in using Google.",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    console.log("Entered password:", password);
    console.log("Hashed password:", user.password);
    console.log("Is password valid?", isPasswordValid);

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

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneNumberVerified: user.isPhoneNumberVerified,
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
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res
            .status(403)
            .json({ message: "Invalid or expired refresh token" });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        if (!user.refreshToken.includes(refreshToken)) {
          return res
            .status(403)
            .json({ message: "Refresh token is invalid or has been used" });
        }

        user.refreshToken = user.refreshToken.filter(
          (token) => token !== refreshToken
        );

        const newRefreshToken = user.generateRefreshToken();
        const newAccessToken = user.generateAccessToken();

        user.refreshToken.push(newRefreshToken);
        await user.save();

        res.json({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      }
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res
        .status(400)
        .json({ message: "Google access token is required" });
    }

    // Fetch user info from Google API using the access token
    const googleResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
    );

    const { email, name, picture, id: googleId } = googleResponse.data;

    let user = await User.findOne({ googleId });

    if (!user) {
      user = new User({
        name,
        email,
        googleId,
        profilePicture: { secure_url: picture },
        isEmailVerified: true,
      });
      await user.save();
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken.push(refreshToken);
    await user.save();

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        profilePicture: user.profilePicture || "",
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res
      .status(500)
      .json({ message: "Google authentication failed", error: error.message });
  }
};
