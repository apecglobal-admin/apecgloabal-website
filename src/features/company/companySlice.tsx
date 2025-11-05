import { createSlice } from "@reduxjs/toolkit";
import { listCompanies } from "./companyApi";

const projectSlice = createSlice({
  name: "project",
  initialState: {
    companies: [],
    loading: false,
    error: null,
  },
  reducers: {
    
  },
  extraReducers(builder) {
    builder
       .addCase(listCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(listCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
  },
});

export default projectSlice.reducer;
