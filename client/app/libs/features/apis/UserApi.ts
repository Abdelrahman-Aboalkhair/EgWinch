import { apiSlice } from "../slices/ApiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDrivers: builder.query({
      query: () => ({
        url: "/users?role=driver",
      }),
      providesTags: ["Drivers"],
    }),

    getAllUsers: builder.query({
      query: () => ({
        url: "/users",
      }),
    }),
    getProfile: builder.query({
      query: () => ({
        url: "/users/me",
      }),
    }),

    createAdmin: builder.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllDriversQuery,
  useCreateAdminMutation,
  useGetProfileQuery,
  useGetAllUsersQuery,
} = userApi;
