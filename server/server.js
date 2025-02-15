const dotenv = require("dotenv");
dotenv.config();
const http = require("http");

const { connectToDb } = require("./config/connectToDb.js");
const app = require("./app.js");
const { initializeSocket } = require("./libs/socket.js");
const server = http.createServer(app);

initializeSocket(server);

connectToDb();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on url http://localhost:${PORT}`);
});

app.on("error", (err) => {
  console.log(err);
  process.exit(1);
});
