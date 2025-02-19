const User = require("../models/user.model");

exports.getAllUsers = async (req, res) => {
  const { page = 1, limit = 10, role } = req.query;

  try {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    const filter = role ? { role } : {};

    const users = await User.find(filter).skip(skip).limit(limitNum);

    const totalUsers = await User.countDocuments(filter);

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
    const user = await User.findById(req.user.userId);
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error fetching user profile, ", error);
  }
};

exports.createAdmin = async (req, res) => {
  const { data } = req.body;
  try {
    const user = await User.create(data);
    res.status(200).json({ success: true, user });
  } catch (error) {}
};
