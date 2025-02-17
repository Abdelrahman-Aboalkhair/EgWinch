const mongoose = require("mongoose");
const messageSchema = require("./message.model");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [messageSchema],
  },
  { timestamps: true }
);

module.exports = conversationSchema;
