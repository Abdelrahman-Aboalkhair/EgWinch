const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const { connectToDb } = require("./config/connectToDb.js");
const app = require("./app.js");
const { createSocketServer } = require("./lib/socket.js");
const cloudinary = require("cloudinary").v2;
const logger = require("./config/logger.js");

const server = http.createServer(app);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const io = createSocketServer(server);

connectToDb();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! Server shutting down...");
  console.error(err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED PROMISE REJECTION! Server shutting down...");
  console.error(reason);
  server.close(() => process.exit(1));
});

module.exports = { io };
