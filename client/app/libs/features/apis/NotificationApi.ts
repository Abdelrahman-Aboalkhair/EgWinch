import { apiSlice } from "../slices/ApiSlice";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => `/notifications`,
      providesTags: ["Notifications"],
    }),

    markAsRead: builder.mutation({
      query: () => ({
        url: `/notifications/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // Clear all notifications
    clearNotifications: builder.mutation({
      query: () => ({
        url: `/notifications`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // Delete a single notification
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useClearNotificationsMutation,
  useDeleteNotificationMutation,
  useMarkAsReadMutation,
} = notificationApi;
