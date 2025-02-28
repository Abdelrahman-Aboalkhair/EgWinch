import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "../store/store";
import { setCredentials, clearAuthState } from "../store/slices/AuthSlice";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = store.getState().auth.accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error) => {
    console.log("error: ", error);

    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return Promise.reject(error);
      }

      isRefreshing = true;
      originalRequest._retry = true; // Custom flag

      try {
        const refreshResponse = await axios.get(
          "http://localhost:5000/api/v1/auth/refresh-token",
          {
            withCredentials: true,
          }
        );
        console.log("refreshResponse: ", refreshResponse);

        if (refreshResponse.data) {
          const { user, accessToken } = refreshResponse.data;
          store.dispatch(setCredentials({ data: { user, accessToken } }));

          // Update the token for the original request
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

          isRefreshing = false; // Reset the flag
          return axiosInstance(originalRequest); // Retry the failed request
        }
      } catch (refreshError) {
        store.dispatch(clearAuthState());
        console.error("Token refresh failed, user logged out.");
        isRefreshing = false; // Reset even if it fails
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
