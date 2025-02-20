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

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // try to get a new token
    const refreshResult = await baseQuery(
      { url: "/auth/refresh-token", method: "GET" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // store the new token
      api.dispatch(setCredentials(refreshResult?.data));
      // retry the original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // if refresh token fails, clear the auth state
      api.dispatch(clearAuthState());

      if (typeof window !== "undefined") {
        // Store the current URL to redirect back after login
        const currentPath = window.location.pathname;
        if (currentPath !== "/auth/sign-in") {
          localStorage.setItem("redirectAfterLogin", currentPath);
          window.location.href = "/sign-in";
        }
      }
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
