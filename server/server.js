const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const { connectToDb } = require("./config/connectToDb.js");
const { Server } = require("socket.io");
const app = require("./app.js");
const Conversation = require("./models/conversation.model.js");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

io.on("connection", (socket) => {
  console.log("Connected with client.");

  socket.on("sendMessage", async (data) => {
    const { sender, message, driverId } = data;
    const participants = [sender, driverId].sort();

    let conversation = await Conversation.findOne({
      participants,
    });

    if (!conversation) {
      conversation = new Conversation({
        participants,
        messages: [{ sender, message }],
      });
      await conversation.save();
    } else {
      conversation.messages.push({ sender, message });
      await conversation.save();
    }

    io.emit("recievedMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from client.");
  });
});

connectToDb();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  console.log(err);
  process.exit(1);
});
