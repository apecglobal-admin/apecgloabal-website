import { createSlice } from "@reduxjs/toolkit";
import { listSideBars, loginCMS, userInfoCMS } from "./authApi";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import { create } from "domain";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}
interface AuthState {
sidebars: InitState<any[]>;
userInfo: InitState<any | null>;
}
const initialState: AuthState = {
  sidebars: { data: [], loading: false, error: null, status: null },
  userInfo: { data: null, loading: false, error: null, status: null },
}
// Tạo slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    createAsyncReducer(builder, userInfoCMS, "userInfo");
    createAsyncReducer(builder, listSideBars, "sidebars");
    createAsyncReducer(builder, loginCMS);
  },
});

// Export actions & reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;
