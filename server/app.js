const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const authRoutes = require("./modules/auth/auth.routes.js");
const userRoutes = require("./modules/users/user.routes.js");
const driverRoutes = require("./modules/drivers/driver.routes.js");
const bookingRoutes = require("./modules/bookings/booking.routes.js");
const reviewRoutes = require("./modules/reviews/review.routes.js");
const messageRoutes = require("./modules/chat/message.routes.js");
const conversationRoutes = require("./modules/chat/conversation.routes.js");
const notificationRoutes = require("./modules/notifications/notification.routes.js");
const locationRoutes = require("./modules/locations/location.routes.js");

const globalError = require("./middlewares/globalError.js");
const logger = require("./config/logger.js");
const AppError = require("./utils/AppError.js");
const { limiter } = require("./constants/limiters.js");
const cookieOptions = require("./constants/cookieOptions.js");

dotenv.config();
const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://trusted.cdn.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);
app.use(helmet.frameguard({ action: "deny" }));

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://egwinch.com"]
    : ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new AppError(403, "CORS policy violation"));
      }
    },
    credentials: true,
  })
);

const allowedHosts =
  process.env.NODE_ENV === "production"
    ? ["egwinch.com", "www.egwinch.com"]
    : ["localhost", "127.0.0.1"];

app.use((req, res, next) => {
  if (!allowedHosts.includes(req.hostname)) {
    return next(new AppError(403, "Forbidden"));
  }
  next();
});

// app.use(rateLimit(limiter));
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: ["sort", "filter", "fields", "page", "limit"],
  })
);

// Logging & Performance
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);
app.use(compression());

// Body Parsing & Cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET, cookieOptions));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/drivers", driverRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/conversations", conversationRoutes);
app.use("/api/v1/locations", locationRoutes);

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalError);

module.exports = app;
