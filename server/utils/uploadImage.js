const { v2: cloudinary } = require("cloudinary");
const asyncHandler = require("./asyncHandler");
const AppError = require("./AppError");

const uploadImage = async (filePath) => {
  if (!filePath) {
    throw new AppError(400, "File not uploaded, please try again");
  }
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return result;
  } catch (error) {
    throw new AppError(400, "Error uploading file, please try again");
  }
};

module.exports = uploadImage;
