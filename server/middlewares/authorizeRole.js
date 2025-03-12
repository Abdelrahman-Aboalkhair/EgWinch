const AppError = require("../utils/AppError");

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("You are not authorized to perform this action", 403)
      );
    }
    next();
  };
};

module.exports = authorizeRole;
