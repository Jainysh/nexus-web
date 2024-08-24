import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  loggedInUser: {
    phoneNumber: string;
  } | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  loggedInUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ phoneNumber: string }>) => {
      state.isLoggedIn = true;
      state.loggedInUser = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.loggedInUser = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
