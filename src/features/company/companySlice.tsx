import { createSlice } from "@reduxjs/toolkit";
import { listCompanies } from "./companyApi";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";

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
    createAsyncReducer(builder, listCompanies, "companies")
  },
});

export default projectSlice.reducer;
