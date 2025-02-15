const { Server } = require("socket.io");
const User = require("../models/user.model");
const Booking = require("../models/booking.model");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const userSocketMap = {};

  io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    const userId = socket.handshake.query.userId;

    // Register the user with their socket ID
    if (userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
    }

    // Handle location updates from the driver
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

    // Handle phone call offers (initiating a call)
    socket.on("offer", (data) => {
      const { userId, offer } = data;
      const receiverSocketId = userSocketMap[userId]; // get the receiver's socket ID from the map
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("offer", offer); // Send the offer to the receiver
      }
    });

    // Handle phone call answers (responding to a call)
    socket.on("answer", (data) => {
      const { userId, answer } = data;
      const receiverSocketId = userSocketMap[userId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("answer", answer); // Send the answer back to the caller
      }
    });

    // Handle ICE candidates (exchange of network information)
    socket.on("candidate", (data) => {
      const { userId, candidate } = data;
      const receiverSocketId = userSocketMap[userId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("candidate", candidate); // Send the ICE candidate to the receiver
      }
    });

    // Clean up when the user disconnects
    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
      delete userSocketMap[userId]; // Remove user from the map
      io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit the updated list of online users
    });
  });
};

const getSocketInstance = () => io;

module.exports = { initializeSocket, getSocketInstance };
