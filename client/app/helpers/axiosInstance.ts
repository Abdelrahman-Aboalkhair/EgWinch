import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "../libs/store";
import {
  setCredentials,
  clearAuthState,
} from "../libs/features/slices/AuthSlice";

const axiosInstance: AxiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = localStorage.getItem("accessToken"); // Use the correct localStorage key
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error) => {
    // If the error is due to unauthorized access (token expired or invalid)
    if (error.response && error.response.status === 401) {
      try {
        // Attempt to refresh the token
        const refreshResponse = await axiosInstance.get("/refresh-token"); // Adjust endpoint as needed

        // If refresh is successful, update the store with new credentials
        if (refreshResponse.data) {
          const { user, accessToken } = refreshResponse.data;
          store.dispatch(setCredentials({ data: { user, accessToken } }));

          // Store new access token in localStorage (for retrying the request)
          localStorage.setItem("accessToken", accessToken);

          // Retry the original request with the new token
          error.config.headers["Authorization"] = `Bearer ${accessToken}`;
          return axiosInstance(error.config); // Retry the request with new token
        }
      } catch (refreshError) {
        // If token refresh fails, log out the user and clear the state
        store.dispatch(clearAuthState());
        localStorage.removeItem("accessToken");
        console.error("Token refresh failed, user logged out.");
        // Optionally, redirect to login page
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
