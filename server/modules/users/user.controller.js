const User = require("./user.model");
const redis = require("../../lib/redis");
const asyncHandler = require("../../utils/asyncHandler");
const AppError = require("../../utils/AppError");
const ApiFeatures = require("../../utils/ApiFeatures");

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const { role } = req.query;
  const filter = role ? { role } : {};

  const apiFeatures = new ApiFeatures(User.find(filter), req.query).paginate();

  const users = await apiFeatures.query;
  const totalUsers = await User.countDocuments(filter);

  res.status(200).json({
    success: true,
    users,
    totalUsers,
    totalPages: Math.ceil(totalUsers / (req.query.limit || 10)),
  });
});

exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({ success: true, user });
});

exports.updateMe = asyncHandler(async (req, res, next) => {
  if (req.body.password) {
    return next(
      new AppError(
        "Cannot update the password from /updateMe route, use forgot-password then follow the instructions",
        400
      )
    );
  }

  if (req.body.role && req.user.role === "super-admin") {
    return next(new AppError("Super admin cannot be updated", 400));
  }

  if (req.body.role && req.user.role === "admin") {
    return next(new AppError("Admin role cannot be updated", 400));
  }
  const user = await User.findByIdAndUpdate(req.user.userId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, user });
});

exports.me = asyncHandler(async (req, res, next) => {
  const cacheKey = `user:${req.user.userId}`;
  const cachedUser = await redis.get(cacheKey);

  if (cachedUser) {
    return res
      .status(200)
      .json({ success: true, user: JSON.parse(cachedUser) });
  }

  const user = await User.findById(req.user.userId);
  if (!user) return next(new AppError("User not found", 404));

  await redis.setex(cacheKey, 3600, JSON.stringify(user));
  res.status(200).json({ success: true, user });
});

exports.getUserBookingStats = asyncHandler(async (req, res, next) => {
  const stats = await User.getBookingStats(req.params.id);

  res.status(200).json({
    success: true,
    stats,
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError("User not found", 404));

  if (user.role === ("super-admin" || "admin")) {
    return next(new AppError("Cannot delete an Admin or Super Admin", 403));
  }

  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "User deleted successfully" });
});

exports.createAdmin = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const admin = await User.create({
    name,
    email,
    password,
    role: "admin",
  });

  res.status(201).json({ success: true, admin });
});

exports.deleteAdmin = asyncHandler(async (req, res, next) => {
  const admin = await User.findById(req.params.id);
  if (!admin) return next(new AppError("Admin not found", 404));

  if (admin.role === "super-admin") {
    return next(new AppError("Cannot delete a Super Admin", 403));
  }

  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "User deleted successfully" });
});
