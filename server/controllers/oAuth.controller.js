const axios = require("axios");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

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
