exports.cookieOptions = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
};
