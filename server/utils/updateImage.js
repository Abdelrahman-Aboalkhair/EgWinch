const uploadImage = require("./uploadImage");
const cloudinary = require("cloudinary").v2;

const updateImage = async (user, file) => {
  try {
    await cloudinary.uploader.destroy(user.profilePicture.public_id);

    // Upload new image to Cloudinary
    const result = await uploadImage(file.path);
    if (result) {
      user.profilePicture.public_id = result.public_id;
      user.profilePicture.secure_url = result.secure_url;

      // Remove file from server
      fs.rmSync(`uploads/${file.filename}`);
    }
  } catch (err) {
    throw new Error("File not uploaded, please try again");
  }
};

module.exports = updateImage;
