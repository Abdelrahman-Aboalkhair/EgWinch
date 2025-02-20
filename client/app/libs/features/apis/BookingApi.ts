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
    }),

    createBooking: builder.mutation({
      query: (data) => ({
        url: "/bookings",
        method: "POST",
        body: data,
      }),
    }),

    getOffers: builder.query({
      query: () => ({
        url: "/bookings/offers",
        method: "GET",
      }),
    }),

    createOffer: builder.mutation({
      query: ({ bookingId, data }) => ({
        url: `/bookings/create-offer/${bookingId}`,
        method: "PUT",
        body: data,
      }),
    }),

    updateBooking: builder.mutation({
      query: ({ id, data }) => ({
        url: `/bookings/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  usePredictMovePriceMutation,
  useGetBookingsQuery,
  useCreateBookingMutation,
  useGetOffersQuery,
  useCreateOfferMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
} = bookingApi;
