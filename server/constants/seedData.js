const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const data = [
  {
    model: "Message",
    documents: [
      {
        sender: new ObjectId(),
        message: "This is a standalone message.",
        createdAt: new Date(),
      },
    ],
  },
  {
    model: "User",
    documents: [
      // Customer
      {
        name: "Customer Test",
        email: "customer@gmail.com",
        phoneNumber: "1234567890",
        location: { type: "Point", coordinates: [31.2357, 30.0444] },
        role: "customer",
        password: "securePassword",
      },
      // Driver
      {
        name: "Driver Test",
        email: "driver@gmail.com",
        phoneNumber: "9876543210",
        location: { type: "Point", coordinates: [29.987, 31.211] },
        role: "driver",
        driverLicenseNumber: "DL12345",
        driverLicenseExpiry: new Date("2025-12-31"),
        registrationNumber: "RN54321",
        registrationExpiry: new Date("2025-06-30"),
        capacity: "2 tons",
        availabilityStatus: "available",
        password: "securePassword",
      },
      // Admin
      {
        name: "Admin Test",
        email: "admin@gmail.com",
        phoneNumber: "1112223333",
        location: { type: "Point", coordinates: [30.052, 31.233] },
        role: "admin",
        password: "securePassword",
      },
    ],
  },
  {
    model: "Booking",
    documents: [
      {
        customer: new ObjectId(),
        driver: new ObjectId(),
        pickupLocation: {
          type: "Point",
          coordinates: [31.2357, 30.0444],
          address: "Cairo, Egypt",
        },
        dropoffLocation: {
          type: "Point",
          coordinates: [29.9187, 31.2001],
          address: "Giza, Egypt",
        },
        date: new Date(),
        status: "pending",
        additionalServices: ["carpentry", "loading"],
        items: [
          { name: "Sofa", quantity: 1, isFragile: false },
          {
            name: "TV",
            quantity: 1,
            isFragile: true,
            specialInstructions: "Handle with care.",
          },
        ],
        totalPrice: 500,
        paymentStatus: "pending",
      },
    ],
  },
  {
    model: "Review",
    documents: [
      {
        reviewer: new ObjectId(),
        winchOwner: new ObjectId(),
        rating: 5,
        reviewText: "Great service, very professional!",
      },
    ],
  },
  {
    model: "Conversation",
    documents: [
      {
        participants: [new ObjectId(), new ObjectId()],
        messages: [
          {
            sender: new ObjectId(),
            message: "Hello, when will you arrive?",
            createdAt: new Date(),
          },
          {
            sender: new ObjectId(),
            message: "I will be there in 10 minutes.",
            createdAt: new Date(),
          },
        ],
      },
    ],
  },
];

module.exports = data;
