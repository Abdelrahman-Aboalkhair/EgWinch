const mongoose = require("mongoose");
const User = require("./baseUser.model");

const driverSchema = new mongoose.Schema({
  licenseNumber: String,
  licenseExpiry: Date,
  licenseImage: {
    public_id: String,
    secure_url: String,
  },
  vehicleType: {
    type: String,
    enum: ["small truck", "medium truck", "large truck", "winch"],
  },
  experienceYears: Number,
});

const Driver = User.discriminator("driver", driverSchema);

module.exports = Driver;
