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
      const user = action.payload.data?.user;
      const accessToken = action.payload.data?.accessToken;

      state.user = user;
      state.accessToken = accessToken;
      state.isLoggedIn = true;

      // Store user and accessToken in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken || ""); // Store accessToken
    },

    clearAuthState: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isLoggedIn = false;

      // Remove user and accessToken from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
  },
});

export const { setCredentials, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
