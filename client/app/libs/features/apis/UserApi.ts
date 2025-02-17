import apiSlice from "../slices/ApiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDrivers: builder.query({
      query: () => ({
        url: "/users?role=driver",
      }),
      providesTags: ["Drivers"],
    }),
  }),
});

export const { useGetAllDriversQuery } = userApi;
