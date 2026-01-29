import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import { list } from "postcss";
import { listPriority } from "./priorityApi";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface PriorityState {
  priorities: InitState<any[]>;
}

const initialState: PriorityState = {
  priorities: { data: [], loading: false, error: null, status: null },

};
const prioritySlice = createSlice({
  name: "priority",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listPriority, "priorities");
   
  },
});

export default prioritySlice.reducer;
