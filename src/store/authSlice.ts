import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Party } from "../../types/common";

interface AuthState {
  isLoggedIn: boolean;
  loggedInUser: Partial<Party> | null;
}
const initialStateMock: AuthState = {
  isLoggedIn: true,
  loggedInUser: {
    companyName: "Apple Computers",
    address: {
      addressLine1: "test",
      city: "Cuppertino",
      country: "Unites States",
      district: "Test",
      pincode: "123123",
      state: "State",
      addressLine2: "adasda",
    },
    primaryPhoneNumber: "9049778749",
    type: "Distributor",
  },
};

const initialState: AuthState =
  // initialStateMock;
  {
    isLoggedIn: false,
    loggedInUser: null,
  };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ primaryPhoneNumber: string }>) => {
      state.isLoggedIn = true;
      state.loggedInUser = { ...state.loggedInUser, ...action.payload };
    },
    updateUserInfo: (
      state,
      action: PayloadAction<{ user: Partial<Party> }>
    ) => {
      state.loggedInUser = { ...state.loggedInUser, ...action.payload.user };
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.loggedInUser = null;
    },
  },
});

export const { login, logout, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;
