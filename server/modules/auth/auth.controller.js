const cookieOptions = require("../../constants/cookieOptions");
const User = require("../users/user.model");
const jwt = require("jsonwebtoken");
const axios = require("axios");
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

exports.refreshToken = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.googleSignup = async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res
        .status(400)
        .json({ message: "Google access token is required" });
    }

    const googleResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
    );
    const { email, name, picture, id: googleId } = googleResponse.data;

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "This email is already registered, please sign in" });
    }

    const user = new User({
      name,
      email,
      googleId,
      profilePicture: { secure_url: picture },
      emailVerified: true,
    });

    await user.save();

    // Generate tokens
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    res.cookie("refreshToken", refreshToken, cookieOptions);
    user.refreshToken.push(refreshToken);
    await user.save();

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
  } catch (error) {
    console.error("Google Sign-Up Error:", error);
    res
      .status(500)
      .json({ message: "Google sign-up failed", error: error.message });
  }
};

exports.googleSignin = async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res
        .status(400)
        .json({ message: "Google access token is required" });
    }

    const googleResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
    );
    const { email } = googleResponse.data;

    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "This email is not registered, please sign up" });
    } else if (user.password) {
      return res.status(400).json({
        message:
          "This email is not registered with Google, please sign in with email and password",
      });
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    res.cookie("refreshToken", refreshToken, cookieOptions);
    user.refreshToken.push(refreshToken);
    await user.save();

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
  } catch (error) {
    console.error("Google Login Error:", error);
    res
      .status(500)
      .json({ message: "Google login failed", error: error.message });
  }
};

exports.facebookSignup = async (req, res) => {
  try {
    const { access_token } = req.body;
    console.log("access_token: ", access_token);

    if (!access_token) {
      return res
        .status(400)
        .json({ message: "Facebook access token is required" });
    }

    // Get user info from Facebook API
    const fbResponse = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${access_token}`
    );

    console.log("fbResponse: ", fbResponse);

    const { email, name, id: facebookId, picture } = fbResponse.data;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "This email is already registered, please sign in" });
    }

    // Create new user
    const user = new User({
      name,
      email,
      facebookId,
      profilePicture: { secure_url: picture.data.url },
      emailVerified: true,
    });

    await user.save();

    // Generate tokens
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });
    user.refreshToken.push(refreshToken);
    await user.save();

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
  } catch (error) {
    console.error("Facebook Sign-Up Error:", error);
    res
      .status(500)
      .json({ message: "Facebook sign-up failed", error: error.message });
  }
};

exports.facebookSignin = async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res
        .status(400)
        .json({ message: "Facebook access token is required" });
    }

    // Get user info from Facebook API
    const fbResponse = await axios.get(
      `https://graph.facebook.com/me?fields=id,email&access_token=${access_token}`
    );

    const { email } = fbResponse.data;

    let user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "This email is not registered, please sign up" });
    } else if (user.password) {
      return res.status(400).json({
        message:
          "This email is not registered with Facebook, please sign in with email and password",
      });
    }

    // Generate tokens
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });
    user.refreshToken.push(refreshToken);
    await user.save();

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
  } catch (error) {
    console.error("Facebook Login Error:", error);
    res
      .status(500)
      .json({ message: "Facebook login failed", error: error.message });
  }
};
