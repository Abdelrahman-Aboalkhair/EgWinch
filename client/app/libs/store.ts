import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./features/apis/AuthApi";
import authReducer from "./features/slices/AuthSlice";
import conversationReducer from "./features/slices/ConversationSlice";
import toastReducer from "./features/slices/ToastSlice";
import DriverOnboardingReducer from "./features/slices/DriverOnboardingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    conversations: conversationReducer,
    toasts: toastReducer,
    driverOnboarding: DriverOnboardingReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof store>;
