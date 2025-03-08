import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  profilePicture: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ data: { user: User; accessToken: string } }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isLoggedIn = true;

      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    clearAuthState: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isLoggedIn = false;

      localStorage.removeItem("bookingStep");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
