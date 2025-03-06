const sendEmail = require("../../utils/sendEmail");
const User = require("../users/user.model");
const AppError = require("../../utils/AppError");

class AuthService {
  static async registerUser({ name, email, password }) {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError(
        400,
        "This email is already registered, please sign in"
      );
    }

    // Generate email verification token
    const emailVerificationCode = Math.random().toString().slice(-4);
    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new user
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
    if (!email) throw new AppError(400, "Email is required");

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

  static async refreshToken() {}
  static async forgotPassword() {}
  static async resetPassword() {}
  static async googleSignup() {}
  static async googleSignin() {}
  static async facebookSignup() {}
  static async facebookSignin() {}
}

module.exports = AuthService;
