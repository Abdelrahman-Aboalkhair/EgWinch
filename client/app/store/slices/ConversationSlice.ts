import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  _id: string;
  conversation: string;
  sender: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface Conversation {
  _id: string;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
  unreadCount: { [userId: string]: number };
}

interface ConversationState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
}

const initialState: ConversationState = {
  conversations: [],
  activeConversation: null,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },

    sendMessage: (
      state,
      action: PayloadAction<{
        _id: string;
        conversation: string;
        content: string;
        sender: string;
        createdAt: string;
        isRead: boolean;
      }>
    ) => {
      const message = action.payload;

      // Update active conversation if it matches
      if (state.activeConversation?._id === message.conversation) {
        if (!state.activeConversation.messages) {
          state.activeConversation.messages = [];
        }
        state.activeConversation.messages.push(message);
        state.activeConversation.lastMessage = message;
      }

      // Always update the conversation in the list
      const conversation = state.conversations.find(
        (conv) => conv._id === message.conversation
      );

      if (conversation) {
        if (!conversation.messages) {
          conversation.messages = [];
        }
        conversation.messages.push(message);
        conversation.lastMessage = message;

        // Update unread count for receiver
        if (message.sender !== conversation._id) {
          const receiverId = conversation.participants.find(
            (id) => id !== message.sender
          );
          if (receiverId) {
            conversation.unreadCount[receiverId] =
              (conversation.unreadCount[receiverId] || 0) + 1;
          }
        }
      }
    },

    updateUnreadCount: (
      state,
      action: PayloadAction<{
        conversationId: string;
        userId: string;
        count: number;
      }>
    ) => {
      const { conversationId, userId, count } = action.payload;

      // First check active conversation
      if (state.activeConversation?._id === conversationId) {
        state.activeConversation.unreadCount[userId] = count;
      } else {
        // If not active, find in conversations array
        const conversation = state.conversations.find(
          (conv) => conv._id === conversationId
        );
        if (conversation) {
          conversation.unreadCount[userId] = count;
        }
      }
    },

    markMessagesAsRead: (
      state,
      action: PayloadAction<{ conversationId: string; userId: string }>
    ) => {
      const { conversationId, userId } = action.payload;

      // Update active conversation
      if (state.activeConversation?._id === conversationId) {
        state.activeConversation.messages =
          state.activeConversation.messages.map((msg) =>
            msg.sender !== userId ? { ...msg, isRead: true } : msg
          );
        state.activeConversation.unreadCount[userId] = 0;
      }

      // Update conversation in list
      const conversation = state.conversations.find(
        (conv) => conv._id === conversationId
      );
      if (conversation) {
        conversation.messages = conversation.messages.map((msg) =>
          msg.sender !== userId ? { ...msg, isRead: true } : msg
        );
        conversation.unreadCount[userId] = 0;
      }
    },

    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      if (!action.payload) {
        state.activeConversation = null;
      } else {
        const conversation = state.conversations.find(
          (conv) => conv._id === action.payload
        );
        state.activeConversation = conversation || null;
      }
    },
  },
});

export const {
  setConversations,
  sendMessage,
  updateUnreadCount,
  markMessagesAsRead,
  setActiveConversation,
} = conversationSlice.actions;

export default conversationSlice.reducer;
