import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { RootState } from "../../store";
import { setCredentials, clearAuthState } from "./AuthSlice";
import { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

// Create axios instance with base URL configuration
const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {}
> = async (args, api, extraOptions) => {
  try {
    // Retrieve the current accessToken from the Redux state
    const token = (api.getState() as RootState).auth.accessToken;
    if (token) {
      // Attach the token to every request via the Authorization header
      axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
    }

    // Attempt the API request
    const response = await axiosInstance({
      ...args,
      data:
        args.method === "POST" || args.method === "PUT" ? args.body : undefined,
    });
    return { data: response.data };
  } catch (error: any) {
    // Check if the error is due to an expired/invalid accessToken
    if (error.response && error.response.status === 401) {
      try {
        // Attempt to silently renew the accessToken via the refresh endpoint.
        // Note: The refresh token should be sent automatically as it's stored as an HttpOnly cookie.
        const refreshResult = await axiosInstance.get("/refresh-token");

        if (refreshResult.data) {
          // Update Redux state with new credentials
          api.dispatch(setCredentials({ data: refreshResult.data }));

          // Set the new token on the axios instance
          axiosInstance.defaults.headers[
            "Authorization"
          ] = `Bearer ${refreshResult.data.accessToken}`;

          // Retry the original request with the new token
          const retryResponse = await axiosInstance(args);
          return { data: retryResponse.data };
        }
      } catch (refreshError) {
        // If refreshing fails, clear the auth state
        api.dispatch(clearAuthState());
        return { error: { status: 401, message: "Unauthorized" } };
      }
    }

    // For other errors, return a general error object
    return {
      error: {
        status: error.response?.status || 500,
        message: error.response?.data.message || "Unknown error",
      },
    };
  }
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  endpoints: () => ({}),
});

export default apiSlice;
