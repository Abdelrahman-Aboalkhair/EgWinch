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

// Custom base query with re-authentication logic using axios
const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {}
> = async (args, api, extraOptions) => {
  try {
    const token = (api.getState() as RootState).auth.accessToken;
    console.log("token: ", token);

    // If token is available, set it in headers
    if (token) {
      axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
    }

    // Make the API request
    const response = await axiosInstance({
      ...args, // Spread the provided args
      data:
        args.method === "POST" || args.method === "PUT" ? args.body : undefined, // Send body data for POST/PUT requests
    });

    return { data: response.data };
  } catch (error: any) {
    // Handle 401 Unauthorized error
    if (error.response && error.response.status === 401) {
      // Token might have expired, attempt to refresh it
      const refreshResult = await axiosInstance.get("/refresh-token");

      // If refresh token is successful
      if (refreshResult.data) {
        // Dispatch new credentials to update the state with fresh accessToken
        api.dispatch(setCredentials({ data: refreshResult.data }));

        // Retry the original request with the new access token
        axiosInstance.defaults.headers[
          "Authorization"
        ] = `Bearer ${refreshResult.data.accessToken}`;
        const retryResponse = await axiosInstance(args);

        return { data: retryResponse.data };
      } else {
        // If refresh fails, clear authentication state
        api.dispatch(clearAuthState());
        return { error: { status: 401, message: "Unauthorized" } };
      }
    }

    // Handle other errors
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
  endpoints: () => ({}), // Keep this empty, as you're not defining specific endpoints here
});

export default apiSlice;
