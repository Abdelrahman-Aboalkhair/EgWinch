import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, clearAuthState } from "./AuthSlice";
import type { RootState } from "../../store";
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

let isRedirecting = false;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Check if we're on the sign-in page or already redirecting
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    if (currentPath === "/sign-in" || isRedirecting) {
      return result;
    }
  }

  if (result.error && result.error.status === 401) {
    // try to get a new token
    const refreshResult = await baseQuery(
      { url: "/auth/refresh-token", method: "GET" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // store the new token
      api.dispatch(setCredentials(refreshResult.data));
      // retry the original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // if refresh token fails, clear the auth state
      api.dispatch(clearAuthState());

      if (typeof window !== "undefined" && !isRedirecting) {
        isRedirecting = true;
        const currentPath = window.location.pathname;
        if (currentPath !== "/sign-in") {
          localStorage.setItem("redirectAfterLogin", currentPath);
          window.location.href = "/sign-in";
        }
        // Reset the flag after a short delay
        setTimeout(() => {
          isRedirecting = false;
        }, 1000);
      }
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Drivers",
    "Messages",
    "Conversations",
    "Notifications",
    "Bookings",
    "Reviews",
  ],
  endpoints: () => ({}),
});
