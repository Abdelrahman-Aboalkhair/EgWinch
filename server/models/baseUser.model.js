const mongoose = require("mongoose");

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

const User = mongoose.model("User", baseUserSchema);

module.exports = User;
