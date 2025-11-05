import { createSlice } from "@reduxjs/toolkit";
import { listDepartment } from "./departmentApi";

const employeeSlice = createSlice({
  name: "department",
  initialState: {
    departments: [],
    loading: false,
    error: null,
  },
  reducers: {
    
  },
  extraReducers(builder) {
    builder
       .addCase(listDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(listDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      });
  },
});

export default employeeSlice.reducer;
