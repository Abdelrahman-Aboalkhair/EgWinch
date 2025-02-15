const mongoose = require("mongoose");

exports.connectToDb = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected successfully`);
  } catch (error) {
    console.log("MongoDB connection failed", error);
  }
};
