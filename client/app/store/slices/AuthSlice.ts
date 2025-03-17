import { AuthState } from "@/app/types/Auth.types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AuthState = {
  accessToken: null,
  isLoading: true,
  user: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.isLoading = false;
    },
    clearAuthState: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isLoggedIn = false;
      state.isLoading = false;
      sessionStorage.clear();
      localStorage.clear();
    },
    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, clearAuthState, setAuthLoading } =
  authSlice.actions;
export default authSlice.reducer;
