const mongoose = require("mongoose");
const User = require("./baseUser.model");

const customerSchema = new mongoose.Schema({
  totalBookings: { type: Number, default: 0 },
  canceledBookings: { type: Number, default: 0 },
});

const Customer = User.discriminator("customer", customerSchema);

module.exports = Customer;
