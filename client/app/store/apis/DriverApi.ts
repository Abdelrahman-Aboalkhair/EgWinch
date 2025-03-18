import { apiSlice } from "../slices/ApiSlice";

export const driverApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    startOnboarding: builder.mutation({
      query: (data) => ({
        url: "/drivers",
        method: "POST",
        body: data,
      }),
    }),

    updateStep: builder.mutation({
      query: ({ step, driverId, data }) => ({
        url: `/drivers/update-step/${step}`,
        method: "PATCH",
        body: { driverId, ...data },
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
