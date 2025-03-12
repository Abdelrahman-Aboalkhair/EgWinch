const sendEmail = require("../../utils/sendEmail");
const User = require("../users/user.model");
const AppError = require("../../utils/AppError");
const axios = require("axios");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const passwordResetTemplate = require("../../templates/passwordReset.template");

class AuthService {
  static async registerUser({ name, email, password }) {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError(
        400,
        "This email is already registered, please sign in"
      );
    }

    const emailVerificationCode = Math.random().toString().slice(-4);
    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = await User.create({
      name,
      email,
      password,
      emailVerificationCode,
      verificationCodeExpiry,
      profilePicture: { public_id: "", secure_url: "" },
    });

    await sendEmail({
      to: email,
      subject: "Verify Your Email - EgWinch",
      text: `Your verification code is: ${emailVerificationCode}`,
      code: emailVerificationCode,
    });

    const accessToken = await newUser.generateAccessToken();
    const refreshToken = await newUser.generateRefreshToken();

    await newUser.save();

    return { user: newUser, accessToken, refreshToken };
  }

  static async verifyEmail(emailVerificationCode) {
    const user = await User.findOne({
      emailVerificationCode,
      verificationCodeExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError(400, "Invalid or expired verification code.");
    }

    user.emailVerificationCode = null;
    user.verificationCodeExpiry = null;
    user.emailVerified = true;
    await user.save();

    return { message: "Email verified successfully." };
  }

  static async signin({ email, password }) {
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      throw new AppError(
        400,
        "No user found with this email, please sign up first"
      );

    if (user.googleId) {
      throw new AppError(
        400,
        "This email is registered with Google, please sign in with Google"
      );
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw new AppError(400, "Invalid credentials");

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    await user.save();

    return { user, accessToken, refreshToken };
  }

  static async signout() {
    return { message: "User logged out successfully" };
  }

  static async googleSignup(access_token) {
    try {
      const googleResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
      );
      const { email, name, picture, id: googleId } = googleResponse.data;

      let existingUser = await User.findOne({ email });

      if (existingUser) {
        throw new AppError(
          400,
          "This email is already registered, please sign in"
        );
      }

      const user = new User({
        name,
        email,
        googleId,
        profilePicture: { secure_url: picture },
        emailVerified: true,
      });

      await user.save();

      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();

      return { user, accessToken, refreshToken };
    } catch (error) {
      throw new AppError(
        500,
        error.response?.data?.error || "Google signup failed"
      );
    }
  }

  static async googleSignin(access_token) {
    try {
      const googleResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
      );
      const { email } = googleResponse.data;

      let user = await User.findOne({ email }).select("+password");
      if (!user) {
        throw new AppError(404, "This email is not registered, please sign up");
      }

      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();

      return { user, accessToken, refreshToken };
    } catch (error) {
      throw new AppError(
        500,
        error.response?.data?.error || "Google signin failed"
      );
    }
  }

  static async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(404, "This email is not registered, please sign up");
    }

    const resetToken = user.setResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/password-reset/${resetToken}`;
    const htmlTemplate = passwordResetTemplate(resetUrl);

    try {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: htmlTemplate,
      });

      return { message: "Password reset email sent successfully" };
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw new AppError(500, "Failed to send reset email. Try again later.");
    }
  }

  static async resetPassword(token, newPassword) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    console.log("user: ", user);

    if (!user) {
      throw new AppError("Invalid or expired reset token", 400);
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: "Password reset successful. You can now log in." };
  }
}

module.exports = AuthService;
