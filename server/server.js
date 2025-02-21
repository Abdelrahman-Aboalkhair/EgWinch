const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const { connectToDb } = require("./config/connectToDb.js");
const app = require("./app.js");
const { createSocketServer } = require("./lib/socket.js");
const cloudinary = require("cloudinary").v2;

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
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = { io };
