import { apiSlice } from "../slices/ApiSlice";

export const bookingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    estimatePrice: builder.mutation({
      query: (data) => ({
        url: "/bookings/estimate-price",
        method: "POST",
        body: data,
      }),
    }),

    getBookings: builder.query({
      query: () => ({
        url: "/bookings",
        method: "GET",
      }),
      providesTags: ["Booking"],
    }),

    getBooking: builder.query({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "GET",
      }),
      providesTags: ["Booking"],
    }),

    createBooking: builder.mutation({
      query: (data) => ({
        url: "/bookings",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Booking"],
    }),

    updateOnboardingStep: builder.mutation({
      query: ({ bookingId, step, items }) => ({
        url: `/bookings/update-step/${step}`,
        method: "PUT",
        body: { bookingId, items },
      }),
      invalidatesTags: ["Booking"],
    }),

    completeBooking: builder.mutation({
      query: (bookingId) => ({
        url: "/bookings/complete",
        method: "PUT",
        body: { bookingId },
      }),
      invalidatesTags: ["Booking"],
    }),

    createOffer: builder.mutation({
      query: ({ price, bookingId }) => ({
        url: `/bookings/create-offer/${bookingId}`,
        method: "PUT",
        body: { price },
      }),
      invalidatesTags: ["Booking"],
    }),

    updateBooking: builder.mutation({
      query: ({
        bookingId,
        action,
        driverId,
        totalPrice,
        status = "pending",
        paymentStatus = "pending",
      }) => ({
        url: `/bookings/${bookingId}`,
        method: "PUT",
        body: { action, driverId, totalPrice, status, paymentStatus },
      }),
      invalidatesTags: ["Booking"],
    }),

    deleteBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const {
  useEstimatePriceMutation,
  useGetBookingsQuery,
  useGetBookingQuery,
  useCreateBookingMutation,
  useUpdateOnboardingStepMutation,
  useCompleteBookingMutation,
  useCreateOfferMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
} = bookingApi;
