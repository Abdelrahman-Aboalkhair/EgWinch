import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, clearAuthState } from "./AuthSlice";
import type { RootState } from "@/app/store/store";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const PUBLIC_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/password-reset",
  "/",
  "/verify-email",
];

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

  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;

    // If we're already redirecting, or on a public route, don't do anything
    if (
      PUBLIC_ROUTES.some((route) => currentPath.startsWith(route)) ||
      isRedirecting
    ) {
      return result;
    }
  }

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      { url: "/auth/refresh-token", method: "GET" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      api.dispatch(setCredentials(refreshResult.data));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearAuthState());

      if (typeof window !== "undefined" && !isRedirecting) {
        isRedirecting = true;
        const currentPath = window.location.pathname;

        // Redirect only if the current page is not public
        if (!PUBLIC_ROUTES.some((route) => currentPath.startsWith(route))) {
          localStorage.setItem("redirectAfterLogin", currentPath);
          window.location.href = "/sign-in";
        }

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
    "Message",
    "Conversation",
    "Notification",
    "Booking",
    "Review",
    "User",
  ],
  endpoints: () => ({}),
});
