const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
  domain:
    process.env.NODE_ENV === "production" ? "your-domain.com" : "localhost",
};
module.exports = cookieOptions;
