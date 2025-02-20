const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  path: "/",
  domain:
    process.env.NODE_ENV === "production" ? "your-domain.com" : "localhost",
};
module.exports = cookieOptions;
