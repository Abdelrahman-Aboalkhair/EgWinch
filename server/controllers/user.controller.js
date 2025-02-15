const User = require("../models/user.model");

exports.getAllUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    const users = await User.find().skip(skip).limit(limitNum);

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limitNum),
    });
  } catch (error) {
    console.log("Error fetching all users, ", error);
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error fetching user profile, ", error);
  }
};
