const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const { connectToDb } = require("./config/connectToDb.js");
const app = require("./app.js");
const { createSocketServer } = require("./lib/socket.js");

const server = http.createServer(app);

const io = createSocketServer(server);

connectToDb();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = { io };
