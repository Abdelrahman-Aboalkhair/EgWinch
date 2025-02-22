import { apiSlice } from "../slices/ApiSlice";

export const driverApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    startOnboarding: builder.mutation({
      query: () => ({
        url: "/drivers/start-onboarding",
        method: "POST",
      }),
    }),
    updateDriverStep: builder.mutation({
      query: ({ driverId, step, data }) => ({
        url: `/drivers/${driverId}/updateStep`,
        method: "PUT",
        body: { step, data },
      }),
    }),

    submitForReview: builder.mutation({
      query: (driverId) => ({
        url: `/drivers/${driverId}/submitReview`,
        method: "PUT",
      }),
    }),

    reviewDriverApplication: builder.mutation({
      query: ({ driverId, status, rejectionReason }) => ({
        url: `/admin/drivers/review`,
        method: "PUT",
        body: { driverId, status, rejectionReason },
      }),
    }),
  }),
});

export const {
  useStartOnboardingMutation,
  useUpdateDriverStepMutation,
  useSubmitForReviewMutation,
  useReviewDriverApplicationMutation,
} = driverApi;
