const { Server } = require("socket.io");
const Message = require("../models/message.model");
const Conversation = require("../models/conversation.model");

const createSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
      console.log("USER JOINED CONVERSATION: ", conversationId);
    });

    socket.on(
      "send_message",
      async ({ conversationId, senderId, receiverId, content }, callback) => {
        console.log("content: ", content);
        console.log("senderId: ", senderId);
        console.log("receiverId: ", receiverId);
        console.log("conversationId: ", conversationId);

        try {
          let conversation;

          // If no conversation exists, create a new one
          if (!conversationId) {
            conversation = new Conversation({
              participants: [senderId, receiverId],
              messages: [],
            });
            await conversation.save();
            conversationId = conversation._id;
          } else {
            conversation = await Conversation.findById(conversationId);
          }

          // Create and save the message
          const message = new Message({
            conversation: conversationId,
            sender: senderId,
            content,
          });
          await message.save();

          // Update the conversation with the new message
          await Conversation.findByIdAndUpdate(conversationId, {
            $push: { messages: message._id },
            lastMessage: message._id,
            updatedAt: Date.now(),
          });

          // Join the socket to the conversation room if it's new
          if (!conversationId) {
            socket.join(conversationId);
          }

          // Emit the message to all users in the conversation
          io.to(conversationId).emit("receive_message", message);

          // Send acknowledgment back to sender
          callback({
            status: "ok",
            message,
            conversation: !conversationId ? conversation : null,
          });
        } catch (error) {
          console.log("error in send_message: ", error);
          callback({ status: "error", error: error.message });
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
    });
  });

  return io;
};

module.exports = { createSocketServer };
