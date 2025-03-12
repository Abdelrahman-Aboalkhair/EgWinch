const AppError = require("../utils/AppError");

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(403, "You are not authorized to perform this action")
      );
    }
    next();
  };
};

module.exports = authorizeRole;
