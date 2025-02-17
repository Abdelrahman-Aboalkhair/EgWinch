const { Server } = require("socket.io");
const User = require("../models/user.model");
const Booking = require("../models/booking.model");
const Conversation = require("../models//conversation.model");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    socket.on("joinRoom", ({ userId, driverId }) => {
      const roomId = [userId, driverId].sort().join("_");
      console.log("roomId: ", roomId);
      socket.join(roomId);
    });

    socket.on("sendMessage", async ({ roomId, sender, message }) => {
      const conversation = await Conversation.findOneAndUpdate(
        { participants: { $all: roomId.split("_") } },
        { $push: { messages: { sender, message } } },
        { new: true, upsert: true }
      );

      if (!conversation) {
        return console.log("conversation not found");
      }

      await conversation.save();

      io.to(roomId).emit("receiveMessage", { sender, message });
    });

    socket.on("updateLocation", async ({ driverId, latitude, longitude }) => {
      await User.findByIdAndUpdate(driverId, {
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      });

      const booking = await Booking.findOne({
        driver: driverId,
        status: "in-progress",
      });
      if (booking) {
        io.to(booking.customer.toString()).emit("driverLocationUpdate", {
          latitude,
          longitude,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
    });
  });
};

const getSocketInstance = () => io;

module.exports = { initializeSocket, getSocketInstance };
