import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  _id: string;
  conversation: string;
  sender: string;
  content: string;
  isRead: boolean;
  timestamp: string;
}

interface Conversation {
  _id: string;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
  unreadCount: Record<string, number>;
}

interface ConversationState {
  conversations: Conversation[];
  activeConversationId: string | null; // Track active conversation
}

const initialState: ConversationState = {
  conversations: [],
  activeConversationId: null,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },

    addMessageToConversation: (
      state,
      action: PayloadAction<{ conversationId: string; message: Message }>
    ) => {
      const { conversationId, message } = action.payload;
      const conversation = state.conversations.find(
        (conv) => conv._id === conversationId
      );

      if (conversation) {
        conversation.messages.push(message);
        conversation.lastMessage = message;

        // Increment unread count for all participants except sender
        conversation.participants.forEach((userId) => {
          if (userId !== message.sender) {
            conversation.unreadCount[userId] =
              (conversation.unreadCount[userId] || 0) + 1;
          }
        });
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
      const conversation = state.conversations.find(
        (conv) => conv._id === conversationId
      );

      if (conversation) {
        conversation.unreadCount[userId] = count;
      }
    },

    markMessagesAsRead: (
      state,
      action: PayloadAction<{ conversationId: string; userId: string }>
    ) => {
      const { conversationId, userId } = action.payload;
      const conversation = state.conversations.find(
        (conv) => conv._id === conversationId
      );

      if (conversation) {
        conversation.messages.forEach((msg) => {
          if (msg.sender !== userId) {
            msg.isRead = true;
          }
        });

        // Reset unread count for this user
        conversation.unreadCount[userId] = 0;
      }
    },

    // ✅ New action to set the active conversation
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
    },
  },
});

export const {
  setConversations,
  addMessageToConversation,
  updateUnreadCount,
  markMessagesAsRead,
  setActiveConversation,
} = conversationSlice.actions;

export default conversationSlice.reducer;
