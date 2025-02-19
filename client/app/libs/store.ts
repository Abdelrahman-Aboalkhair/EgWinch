import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./features/apis/AuthApi";
import authReducer from "./features/slices/AuthSlice";
import conversationReducer from "./features/slices/ConversationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    conversations: conversationReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof store>;
