import { createSlice } from "@reduxjs/toolkit";

interface User {
  name: string;
  email: string;
  role: string;
  profilePicture: {
    public_id: string;
    secure_url: string;
  };
  emailVerified: boolean;
}

interface AuthState {
  accessToken: string | null;
  isLoading: boolean;
  user: User | null;
}

const initialState: AuthState = {
  accessToken: null,
  isLoading: true,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isLoading = false;
    },
    clearAuthState: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isLoading = false;
    },
    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, clearAuthState, setAuthLoading } =
  authSlice.actions;
export default authSlice.reducer;
