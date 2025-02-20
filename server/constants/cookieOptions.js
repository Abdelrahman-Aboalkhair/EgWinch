const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 15 * 1000, // 15 seconds
  path: "/",
  domain:
    process.env.NODE_ENV === "production" ? "your-domain.com" : "localhost",
};
module.exports = cookieOptions;
