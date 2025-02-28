import { apiSlice } from "../slices/ApiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "/users",
      }),
      providesTags: ["User"],
    }),
    getProfile: builder.query({
      query: (id) => ({
        url: `/users/profile/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getMe: builder.query({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    createAdmin: builder.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useCreateAdminMutation,
  useGetProfileQuery,
  useGetMeQuery,
  useGetAllUsersQuery,
} = userApi;
