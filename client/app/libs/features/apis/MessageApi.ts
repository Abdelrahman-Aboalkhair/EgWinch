import apiSlice from "../slices/ApiSlice";

export const messageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsersForSidebar: builder.query({
      query: () => ({
        url: "/messages/sidebar-users",
      }),
      providesTags: ["Messages"],
    }),
    getMessages: builder.query({
      query: (userToChatId) => ({
        url: `/messages/${userToChatId}`,
      }),
      providesTags: ["Messages"],
    }),

    sendMessage: builder.mutation({
      query: (data) => ({
        url: `/messages/send/${data.receiverId}`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetUsersForSidebarQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} = messageApi;
