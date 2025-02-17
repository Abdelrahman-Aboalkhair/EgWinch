const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const bookingRoutes = require("./routes/booking.routes.js");
const reviewRoutes = require("./routes/review.routes.js");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/reviews", reviewRoutes);

module.exports = app;
