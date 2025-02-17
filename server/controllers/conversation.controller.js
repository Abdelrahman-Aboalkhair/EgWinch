const User = require("../models/user.model");

exports.createConversation = async (userId1, userId2) => {
  try {
    const conversation = {
      participants: [userId1, userId2],
      messages: [],
    };

    await User.updateMany(
      { _id: { $in: [userId1, userId2] } },
      { $push: { conversations: conversation } }
    );

    return conversation;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating conversation.");
  }
};

exports.getUserConversations = async (userId) => {
  try {
    const user = await User.findById(userId).populate(
      "conversations.participants"
    );
    return user.conversations;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching user conversations.");
  }
};

exports.getConversationMessages = async (userId, conversationId) => {
  try {
    const user = await User.findById(userId);

    const conversation = user.conversations.id(conversationId);
    return conversation.messages;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching conversation messages.");
  }
};

exports.addMessageToConversation = async (
  userId,
  conversationId,
  senderId,
  messageContent
) => {
  try {
    const user = await User.findById(userId);

    const conversation = user.conversations.id(conversationId);

    // Add the new message
    conversation.messages.push({
      sender: senderId,
      message: messageContent,
    });

    await user.save();

    return conversation.messages;
  } catch (error) {
    console.error(error);
    throw new Error("Error adding message to conversation.");
  }
};
