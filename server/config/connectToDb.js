const mongoose = require("mongoose");
const logger = require("./logger");

exports.connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB connected successfully`);
  } catch (error) {
    logger.error("MongoDB connection failed", error);
  }
};
