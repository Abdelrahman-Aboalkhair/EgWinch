import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, clearAuthState } from "./AuthSlice";
import type { RootState } from "@/app/store/store";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/v1",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log("Initial request result:", result);

  if (result.error?.status === 401) {
    console.log("Received 401, attempting token refresh...");
    const refreshResult = await baseQuery(
      { url: "/auth/refresh-token", method: "GET" },
      api,
      extraOptions
    );
    console.log("Refresh result:", refreshResult);

    if (refreshResult.data) {
      console.log(
        "Refresh successful, updating credentials:",
        refreshResult.data
      );
      api.dispatch(setCredentials(refreshResult.data));
      result = await baseQuery(args, api, extraOptions);
      console.log("Retry result:", result);
    } else {
      console.log("Refresh failed, clearing auth state...");
      api.dispatch(clearAuthState());
      if (typeof window !== "undefined") {
        window.location.href = "/sign-in";
      }
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Message",
    "Conversation",
    "Notification",
    "Booking",
    "Review",
    "User",
  ],
  endpoints: () => ({}),
});
