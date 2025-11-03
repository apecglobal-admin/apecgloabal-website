import { createSlice } from "@reduxjs/toolkit";
import { listPosition } from "./positionApi";

const employeeSlice = createSlice({
  name: "position",
  initialState: {
    positions: [],
    loading: false,
    error: null,
  },
  reducers: {
    
  },
  extraReducers(builder) {
    builder
       .addCase(listPosition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(listPosition.fulfilled, (state, action) => {
        state.loading = false;
        state.positions = action.payload;
      });
  },
});

export default employeeSlice.reducer;
