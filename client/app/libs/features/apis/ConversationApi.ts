import { apiSlice } from "../slices/ApiSlice";

interface Message {
  _id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface Conversation {
  _id: string;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
  unreadCount: Record<string, number>; // { userId: count }
}

interface CreateConversationParams {
  senderId: string;
  receiverId: string;
}

export const conversationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<Conversation[], void>({
      query: () => ({
        url: "/conversations",
        method: "GET",
      }),
      providesTags: ["Conversation"],
    }),

    createConversation: builder.mutation<
      Conversation,
      CreateConversationParams
    >({
      query: ({ senderId, receiverId }) => ({
        url: "/conversations",
        method: "POST",
        body: { senderId, receiverId },
      }),
      invalidatesTags: ["Conversation"],
    }),
  }),
});

export const { useGetConversationsQuery, useCreateConversationMutation } =
  conversationApi;
