const { v2: cloudinary } = require("cloudinary");
exports.uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return result;
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
};
