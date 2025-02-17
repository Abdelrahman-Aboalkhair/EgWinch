const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const conversationSchema = require("./conversation.model");

const roleEnum = {
  CUSTOMER: "customer",
  DRIVER: "driver",
  ADMIN: "admin",
};

const availabilityEnum = ["available", "unavailable"];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    phoneNumber: String,
    profilePicture: {
      public_id: String,
      secure_url: String,
    },
    role: {
      type: String,
      enum: Object.values(roleEnum),
      default: roleEnum.CUSTOMER,
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true, default: [0, 0] },
    },
    password: {
      type: String,
      select: false,
    },
    refreshToken: [String],
    googleId: String,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailTokenExpiry: Date,

    driverLicenseNumber: String,
    driverLicenseExpiry: Date,
    driverLicenseImage: {
      public_id: String,
      secure_url: String,
    },

    registrationNumber: String,
    registrationExpiry: Date,
    registrationImage: {
      public_id: String,
      secure_url: String,
    },
    capacity: {
      type: String,
      required: false,
    },

    availabilityStatus: {
      type: String,
      enum: availabilityEnum,
      default: "available",
    },

    conversations: [conversationSchema],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    console.error("Password is missing for user:", this._id);
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { userId: this._id, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15s",
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { userId: this._id, role: this.role },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

userSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", userSchema);

module.exports = User;
