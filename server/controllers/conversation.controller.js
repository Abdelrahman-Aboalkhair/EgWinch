const Conversation = require("../models/conversation.model");

exports.createConversation = async (req, res) => {
  const { senderId, receiverId } = req.body;
  console.log("senderId: ", senderId);
  console.log("receiverId: ", receiverId);

  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({ participants: [senderId, receiverId] });
      await conversation.save();
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConversations = async (req, res) => {
  const userId = req.user.userId;
  console.log("req.user: ", req.user);

  try {
    const conversations = await Conversation.find({ participants: userId })
      .populate("participants")
      .populate("messages")
      .populate("lastMessage");
    console.log("conversations: ", conversations);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
