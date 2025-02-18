import apiSlice from "../slices/ApiSlice";

export const conversationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => ({
        url: `/conversations`,
        method: "GET",
      }),
      providesTags: ["Conversations"],
    }),

    createConversation: builder.mutation({
      query: ({ senderId, receiverId }) => ({
        url: "/conversations",
        method: "POST",
        body: { senderId, receiverId },
      }),
    }),
  }),
});

export const { useGetConversationsQuery, useCreateConversationMutation } =
  conversationApi;
