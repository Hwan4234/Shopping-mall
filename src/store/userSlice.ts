import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  uid: string | null;
  email: string | null;
  displayName: string | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  uid: null,
  email: null,
  displayName: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ uid: string; email: string; displayName?: string }>
    ) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.displayName = action.payload.displayName || null;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.uid = null;
      state.email = null;
      state.displayName = null;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
