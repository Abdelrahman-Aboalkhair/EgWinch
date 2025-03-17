import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/AuthApi";
import authReducer from "./slices/AuthSlice";
import conversationReducer from "./slices/ConversationSlice";
import toastReducer from "./slices/ToastSlice";
import driverReducer from "./slices/DriverSlice";
import BookingOnboardingReducer from "./slices/BookingSlice";
import { persistBookingStateMiddleware } from "./slices/BookingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    conversations: conversationReducer,
    toasts: toastReducer,
    driver: driverReducer,
    booking: BookingOnboardingReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(persistBookingStateMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
