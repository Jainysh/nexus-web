import { auth } from "@/services/firebaseConfig";
import { supabase } from "@/services/supabaseConfig";
import { Party } from "@/types/common";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  user: Partial<Party> | null;
  isLoading: boolean;
  error: any;
}
const initialStateMock: AuthState = {
  isLoggedIn: false,
  isLoading: true,
  error: null,
  user: null,
  //  {
  //   companyName: "Jain Distributors",
  //   address: {
  //     addressLine1: "Kaipeth Circle",
  //     city: "Davangere",
  //     country: "India",
  //     district: "Davangere",
  //     pincode: "123456",
  //     state: "Karnataka",
  //     addressLine2: "",
  //   },
  //   primaryPhoneNumber: "8123646364",
  //   type: "Distributor",
  // },
};

const initialState: AuthState = initialStateMock;

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const [firebaseSignout, supabaseSignout] = await Promise.all([
        auth.signOut(),
        supabase.auth.signOut({ scope: "global" }),
      ]);
      console.log(firebaseSignout, supabaseSignout);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getLoginUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string; dispatch: any }
>("auth/login", async (_, { rejectWithValue, dispatch }) => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (data?.user?.app_metadata) {
      dispatch(updateUserInfo({ user: data.user?.user_metadata }));
    }
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ primaryPhoneNumber: string }>) => {
      state.isLoggedIn = true;
      state.isLoading = false;
      state.user = { ...state.user, ...action.payload };
    },
    updateUserInfo: (
      state,
      action: PayloadAction<{ user: Partial<Party> }>
    ) => {
      state.isLoggedIn = true;
      state.user = { ...state.user, ...action.payload.user };
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(
        logoutUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      )
      .addCase(getLoginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const { login, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;
