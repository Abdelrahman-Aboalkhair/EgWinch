import { apiSlice } from "../slices/ApiSlice";

export const messageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (conversationId) => ({
        url: `/messages/${conversationId}`,
      }),
      providesTags: ["Message"],
    }),
  }),
});

export const { useGetMessagesQuery } = messageApi;
