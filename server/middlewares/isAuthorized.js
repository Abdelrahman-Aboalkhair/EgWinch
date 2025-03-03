const isAuthorized = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to access this resource.",
    });
  }
  next();
};

module.exports = isAuthorized;
