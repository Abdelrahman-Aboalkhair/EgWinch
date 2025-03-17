import { apiSlice } from "../slices/ApiSlice";

export const driverApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    startOnboarding: builder.mutation({
      query: () => ({
        url: "/drivers/start-onboarding",
        method: "POST",
      }),
    }),

    updateStep: builder.mutation({
      query: ({ step, data }) => ({
        url: `/drivers/update-step/${step}`,
        method: "PATCH",
        body: { data },
      }),
    }),

    updateApplicationStatus: builder.mutation({
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
  useUpdateStepMutation,
  useUpdateApplicationStatusMutation,
} = driverApi;
