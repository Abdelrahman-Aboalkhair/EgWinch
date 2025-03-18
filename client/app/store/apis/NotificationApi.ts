import { apiSlice } from "../slices/ApiSlice";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => `/notifications`,
      providesTags: ["Notification"],
    }),

    markAsRead: builder.mutation({
      query: () => ({
        url: `/notifications/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),

    clearNotifications: builder.mutation({
      query: () => ({
        url: `/notifications`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),

    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useClearNotificationsMutation,
  useDeleteNotificationMutation,
  useMarkAsReadMutation,
} = notificationApi;
