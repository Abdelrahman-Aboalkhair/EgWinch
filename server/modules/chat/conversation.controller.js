const Conversation = require("../models/conversation.model");
const redis = require("../../lib/redis");

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

    // Invalidate cache for both users
    await redis.del(`conversations:${senderId}`);
    await redis.del(`conversations:${receiverId}`);

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConversations = async (req, res) => {
  const userId = req.user.userId;
  console.log("req.user: ", req.user);

  try {
    const cacheKey = `conversations:${userId}`;

    // Check cache first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Fetch from database if not cached
    const conversations = await Conversation.find({ participants: userId })
      .populate("participants")
      .populate("messages")
      .populate("lastMessage");

    console.log("conversations: ", conversations);

    // Cache result for 5 minutes
    await redis.set(cacheKey, JSON.stringify(conversations), "EX", 60 * 5);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
