const mongoose = require("mongoose");
const User = require("./baseUser.model");

const driverSchema = new mongoose.Schema({
  licenseNumber: String,
  licenseExpiry: Date,
  vehicleType: {
    type: String,
    enum: ["small truck", "medium truck", "large truck", "winch"],
  },
  experienceYears: Number,
  completedBookings: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalEarnings: { type: Number, default: 0 },
});

const Driver = User.discriminator("driver", driverSchema);

module.exports = Driver;
