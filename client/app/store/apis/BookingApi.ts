import { apiSlice } from "../slices/ApiSlice";

export const bookingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    predictMovePrice: builder.mutation({
      query: (data) => ({
        url: "/bookings/predict_move_price",
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

    createBooking: builder.mutation({
      query: (data) => ({
        url: "/bookings",
        method: "POST",
        body: data,
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
  usePredictMovePriceMutation,
  useGetBookingsQuery,
  useCreateBookingMutation,
  useCreateOfferMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
} = bookingApi;
