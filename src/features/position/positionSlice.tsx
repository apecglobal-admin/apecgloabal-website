import { createSlice } from "@reduxjs/toolkit";
import { listPosition } from "./positionApi";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";

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
    createAsyncReducer(builder, listPosition, "positions");
  },
});

export default employeeSlice.reducer;
