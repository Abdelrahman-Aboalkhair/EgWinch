import apiSlice from "../slices/ApiSlice";

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConverstations: builder.query({
      query: () => ({
        url: "/conversations",
      }),
      providesTags: ["Drivers"],
    }),
  }),
});

export const { useGetConverstationsQuery } = chatApi;
