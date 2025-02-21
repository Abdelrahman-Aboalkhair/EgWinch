const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const baseUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: String,
    profilePicture: { public_id: String, secure_url: String },
    role: {
      type: String,
      enum: ["customer", "driver", "admin"],
      required: true,
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true, default: [0, 0] },
    },
    address: String,
    password: { type: String, select: false },
    refreshToken: [String],
  },
  { timestamps: true, discriminatorKey: "role" }
);

/*** Hash Password Before Saving ***/
baseUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/*** Password Comparison ***/
baseUserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    console.error("Password is missing for user:", this._id);
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

/*** JWT Token Generation ***/
baseUserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { userId: this._id, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

baseUserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { userId: this._id, role: this.role },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

/*** Enable GeoJSON Index for Location Queries ***/
baseUserSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", baseUserSchema);

module.exports = User;
