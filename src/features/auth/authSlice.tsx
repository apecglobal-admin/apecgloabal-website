import { createSlice } from "@reduxjs/toolkit";
import { loginCMS } from "./authApi";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}
interface AuthState {

}
const initialState: AuthState = {

}
// Tạo slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    createAsyncReducer(builder, loginCMS);
  },
});

// Export actions & reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;
