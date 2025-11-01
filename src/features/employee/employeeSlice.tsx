import { createSlice } from "@reduxjs/toolkit";
import { listEmployee } from "./employeeApi";

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    employees: [],
    loading: false,
    error: null,
  },
  reducers: {
    
  },
  extraReducers(builder) {
    builder
       .addCase(listEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(listEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      });
  },
});

export default employeeSlice.reducer;
