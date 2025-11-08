import { createSlice } from "@reduxjs/toolkit";
import { loginCMS } from "./authApi";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    status: 'idle',
    loading: false,
    error: null,
  },
  reducers: {
    
  },
  extraReducers(builder) {
    builder
       .addCase(loginCMS.pending, (state) => {
        state.status = 'loading',
        state.loading = true;
        state.error = null;
      })
      .addCase(loginCMS.fulfilled, (state) => {
        state.status = 'success',
        state.loading = false;

      })
  },
});

export default authSlice.reducer;
