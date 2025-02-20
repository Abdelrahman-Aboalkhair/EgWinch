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
        console.log("send_message: ", {
          conversationId,
          senderId,
          receiverId,
          content,
        });
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

          // Update unread count for the receiver (not sender)
          const unreadCount = conversation.unreadCount.get(receiverId) || 0;
          conversation.unreadCount.set(receiverId, unreadCount + 1);
          await conversation.save();

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

    socket.on("mark_as_read", async (conversationId, userId, callback) => {
      try {
        if (!conversationId || !userId) {
          throw new Error("Missing required parameters");
        }

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          throw new Error("Conversation not found");
        }

        if (!conversation.participants.includes(userId)) {
          throw new Error("User is not a participant in this conversation");
        }

        const unreadMessages = await Message.find({
          conversation: conversationId,
          sender: { $ne: userId }, // Exclude messages sent by the user
          isRead: false,
        });

        if (unreadMessages.length > 0) {
          await Message.updateMany(
            { _id: { $in: unreadMessages.map((msg) => msg._id) } },
            { $set: { isRead: true } }
          );

          conversation.unreadCount.set(userId, 0);
          await conversation.save();

          io.to(conversationId).emit("update_unread_count", {
            userId,
            unreadCount: 0,
          });
        }

        if (callback) {
          callback({ status: "ok" });
        }
      } catch (error) {
        console.error("Error in mark_as_read:", error);
        if (callback) {
          callback({ status: "error", error: error.message });
        }
      }
    });
    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
    });
  });

  return io;
};

module.exports = { createSocketServer };
