import { apiSlice } from "../slices/ApiSlice";

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserReviews: builder.query({
      query: (userId) => `/reviews/${userId}`,
      providesTags: (result, error, userId) => [{ type: "Review", id: userId }],
    }),

    createReview: builder.mutation({
      query: (reviewData) => ({
        url: "/reviews",
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: ["Review"],
    }),

    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: "/reviews",
        method: "DELETE",
        body: { reviewId },
      }),
      invalidatesTags: ["Review"],
    }),
  }),
});

export const {
  useGetUserReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
