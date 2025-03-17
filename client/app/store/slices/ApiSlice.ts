import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, clearAuthState, setAuthLoading } from "./AuthSlice";
import type { RootState } from "@/app/store/store";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

// Constants
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Base query configuration
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include", // Required for cookies
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Initialize auth function with proper error handling
const initializeAuth = async (api: {
  dispatch: Function;
  getState: Function;
}) => {
  try {
    api.dispatch(setAuthLoading(true));

    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "GET",
      },
      api,
      {}
    );

    if (refreshResult.data) {
      api.dispatch(setCredentials(refreshResult.data));
      return true;
    }

    api.dispatch(clearAuthState());
    return false;
  } catch (err) {
    console.error("Failed to initialize auth:", err);
    api.dispatch(clearAuthState());
    return false;
  } finally {
    api.dispatch(setAuthLoading(false));
  }
};

// Enhanced base query with reauth logic
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Try the initial query
  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 errors by attempting to refresh the token
  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "GET",
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Token refresh successful, update credentials
      api.dispatch(setCredentials(refreshResult.data));

      // Retry the original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Token refresh failed, clear auth state
      api.dispatch(clearAuthState());
    }
  }

  return result;
};

// API slice configuration
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

// Export initialization function for use in SessionProvider
export { initializeAuth };
