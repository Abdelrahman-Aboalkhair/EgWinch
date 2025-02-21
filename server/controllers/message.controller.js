const Message = require("../models/message.model");
const redis = require("../lib/redis");

exports.getMessages = async (req, res) => {
  const { conversationId } = req.params;
  console.log("conversationId for getting messages: ", conversationId);

  try {
    const messages = await Message.find({
      conversation: conversationId,
    }).populate("sender name email");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
