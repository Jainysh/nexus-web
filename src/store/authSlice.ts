import { Party } from "@/types/common";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  loggedInUser: Partial<Party> | null;
}
const initialStateMock: AuthState = {
  isLoggedIn: false,
  loggedInUser: {
    companyName: "Jain Distributors",
    address: {
      addressLine1: "Kaipeth Circle",
      city: "Davangere",
      country: "India",
      district: "Davangere",
      pincode: "123456",
      state: "Karnataka",
      addressLine2: "",
    },
    primaryPhoneNumber: "8123646364",
    type: "Distributor",
  },
};

const initialState: AuthState = initialStateMock;
// {
//   isLoggedIn: false,
//   loggedInUser: null,
// };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ primaryPhoneNumber: string }>) => {
      localStorage.setItem("loggedInNumber", action.payload.primaryPhoneNumber);
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
      localStorage.removeItem("loggedInNumber");
      state.isLoggedIn = false;
      state.loggedInUser = null;
    },
  },
});

export const { login, logout, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;
