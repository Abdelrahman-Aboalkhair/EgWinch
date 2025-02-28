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
      query: ({ step, data }) => ({
        url: `/drivers/update-onboarding`,
        method: "PUT",
        body: { step, data },
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
  useReviewDriverApplicationMutation,
} = driverApi;
