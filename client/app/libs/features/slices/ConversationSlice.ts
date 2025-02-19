import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  _id: string;
  conversation: string;
  sender: string;
  content: string;
  isRead: boolean;
}

interface Conversation {
  _id: string;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
  unreadCount: Record<string, number>; // { userId: count }
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
        conversationId: string;
        content: string;
        receiverId: string;
        senderId: string;
      }>
    ) => {
      const { conversationId, content, receiverId, senderId } = action.payload;
      const messageData = {
        conversationId,
        content,
        sender: senderId,
        receiver: receiverId,
      };
      if (state.activeConversation) {
        state.activeConversation.messages.push(messageData);
        state.activeConversation.lastMessage = messageData;

        // Increment unread count for other participants
        state.activeConversation.participants.forEach((userId) => {
          if (userId !== senderId) {
            state.activeConversation.unreadCount[userId] =
              (state.activeConversation.unreadCount[userId] || 0) + 1;
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
      if (
        state.activeConversation &&
        state.activeConversation._id === conversationId
      ) {
        state.activeConversation.unreadCount[userId] = count;
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

    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversation = action.payload;
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
