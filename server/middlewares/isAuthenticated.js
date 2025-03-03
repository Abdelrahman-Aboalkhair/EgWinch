const jwt = require("jsonwebtoken");

exports.isLoggedIn = async (req, res, next) => {
  try {
    // get the accessToken from headers
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to access this resource.",
      });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};
