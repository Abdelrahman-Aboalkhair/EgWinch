const sendEmail = require("../utils/sendEmail");
const cookieOptions = require("../constants/cookieOptions");
const User = require("../models/baseUser.model");
const Customer = require("../models/customer.model");
const Driver = require("../models/driver.model");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { uploadImage } = require("../utils/uploadImage");
const fs = require("fs");

exports.registerDriver = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      address,
      licenseNumber,
      licenseExpiry,
      vehicleType,
      experienceYears,
      password,
    } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number already in use.",
      });
    }

    // Generate email verification token
    const emailVerificationToken = Math.random().toString().slice(-4);
    const emailTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const profilePicture = req.files["profilePicture"][0];
    const licenseImage = req.files["licenseImage"][0];

    const profilePictureResult = await uploadImage(profilePicture.path);
    const licenseImageResult = await uploadImage(licenseImage.path);

    // Create new driver
    const newDriver = await Driver.create({
      name,
      email,
      phoneNumber,
      address,
      password,
      licenseNumber,
      role: "driver",
      licenseExpiry,
      licenseImage: {
        public_id: licenseImageResult.public_id,
        secure_url: licenseImageResult.secure_url,
      },
      vehicleType,
      experienceYears,
      emailVerificationToken,
      emailTokenExpiry,
      profilePicture: {
        public_id: profilePictureResult.public_id,
        secure_url: profilePictureResult.secure_url,
      },
    });

    if (req.file) {
      const uploadResult = await uploadImage(req.file.path);
      if (uploadResult) {
        newDriver.profilePicture.public_id = uploadResult.public_id;
        newDriver.profilePicture.secure_url = uploadResult.secure_url;

        // Remove the uploaded file from the server
        fs.rmSync(`uploads/${req.file.filename}`);
      }
    }

    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      text: `Your verification code is: ${emailVerificationToken}`,
      html: `<p>Your verification code is: <strong>${emailVerificationToken}</strong></p>`,
    });

    // Generate tokens
    const accessToken = await newDriver.generateAccessToken();
    const refreshToken = await newDriver.generateRefreshToken();

    // Store refresh token
    res.cookie("refreshToken", refreshToken, cookieOptions);
    newDriver.refreshToken.push(refreshToken);
    await newDriver.save();

    res.status(201).json({
      success: true,
      message: "Driver registered successfully. Please verify your email.",
      user: {
        id: newDriver._id,
        name: newDriver.name,
        email: newDriver.email,
        role: newDriver.role,
        isEmailVerified: newDriver.isEmailVerified,
        profilePicture: newDriver.profilePicture || "",
      },
      accessToken,
    });
  } catch (error) {
    console.error("Driver Signup Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during signup.",
      error: error.message,
    });
  }
};

exports.registerCustomer = async (req, res) => {
  try {
    const { name, email, address, phoneNumber, password } = req.body;
    console.log("req.body: ", req.body);

    // Check if the user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number already in use.",
      });
    }

    // Generate email verification token
    const emailVerificationToken = Math.random().toString().slice(-4);
    const emailTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new customer
    const newCustomer = await Customer.create({
      name,
      email,
      address,
      phoneNumber,
      password,
      role: "customer",
      emailVerificationToken,
      emailTokenExpiry,
      profilePicture: {
        public_id: "",
        secure_url: "",
      },
    });

    if (req.file) {
      console.log("req.file: ", req.file);
      const uploadResult = await uploadImage(req.file.path);
      console.log("uploadResult: ", uploadResult);
      if (uploadResult) {
        newCustomer.profilePicture.public_id = uploadResult.public_id;
        newCustomer.profilePicture.secure_url = uploadResult.secure_url;

        // Remove the uploaded file from the server
        fs.rmSync(`uploads/${req.file.filename}`);
      }
    }

    // Send email verification
    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      text: `Your verification code is: ${emailVerificationToken}`,
      html: `<p>Your verification code is: <strong>${emailVerificationToken}</strong></p>`,
    });

    // Generate tokens
    const accessToken = await newCustomer.generateAccessToken();
    const refreshToken = await newCustomer.generateRefreshToken();

    // Store refresh token
    res.cookie("refreshToken", refreshToken, cookieOptions);
    newCustomer.refreshToken.push(refreshToken);
    await newCustomer.save();

    res.status(201).json({
      success: true,
      message: "Customer registered successfully. Please verify your email.",
      user: {
        id: newCustomer._id,
        name: newCustomer.name,
        email: newCustomer.email,
        role: newCustomer.role,
        isEmailVerified: newCustomer.isEmailVerified,
        profilePicture: newCustomer.profilePicture || "",
      },
      accessToken,
    });
  } catch (error) {
    console.error("Customer Signup Error:", error);
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
      message: "User logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
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
            isEmailVerified: user.isEmailVerified,
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

exports.googleAuth = async (req, res) => {
  try {
    const { access_token, role } = req.body;

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

    let user = await User.findOne({ email });

    if (!user) {
      if (!role || !["customer", "driver", "admin"].includes(role)) {
        return res.status(400).json({
          message:
            "Role is required and must be either 'customer' or 'driver' or 'admin'",
        });
      }

      let driverFields = {};
      if (role === "driver") {
        const {
          licenseNumber,
          licenseExpiry,
          licenseImage,
          vehicleType,
          experienceYears,
        } = req.body;

        if (!driverLicenseNumber || !registrationNumber || !capacity) {
          return res.status(400).json({
            message: "Driver registration requires license and vehicle info",
          });
        }

        driverFields = {
          licenseNumber,
          licenseExpiry,
          licenseImage,
          vehicleType,
          experienceYears,
        };
      }

      user = new User({
        name,
        email,
        googleId,
        profilePicture: { secure_url: picture },
        isEmailVerified: true,
        role,
        ...driverFields,
      });

      await user.save();
    }

    // Generate tokens
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    // Store refresh token in cookies
    res.cookie("refreshToken", refreshToken, cookieOptions);
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
