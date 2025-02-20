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
  }),
});

export const {
  useGetAllDriversQuery,
  useGetProfileQuery,
  useGetAllUsersQuery,
} = userApi;
