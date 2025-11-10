import { createSlice } from "@reduxjs/toolkit";
import { listDepartment } from "./departmentApi";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";

const employeeSlice = createSlice({
  name: "department",
  initialState: {
    departments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listDepartment, "departments");
  },
});

export default employeeSlice.reducer;
