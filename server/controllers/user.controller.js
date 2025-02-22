const User = require("../models/user.model");
const redis = require("../lib/redis");

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

exports.getProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error fetching user profile, ", error);
  }
};

exports.me = async (req, res) => {
  try {
    const cacheKey = `user:${req.user.userId}`;
    const cachedUser = await redis.get(cacheKey);
    if (cachedUser) {
      return res
        .status(200)
        .json({ success: true, user: JSON.parse(cachedUser) });
    }
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await redis.setex(cacheKey, 3600, JSON.stringify(user));
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error fetching user profile, ", error);
  }
};

exports.getUserBookingStats = async (req, res) => {
  try {
    const userId = req.params.id;
    const stats = await User.getBookingStats(userId);

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching booking stats",
      error: error.message,
    });
  }
};

exports.createAdmin = async (req, res) => {
  const { data } = req.body;
  try {
    const user = await User.create(data);

    res.status(200).json({ success: true, user });
  } catch (error) {}
};
