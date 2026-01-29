import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import { listDeadline } from "./deadlineApi";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface DeadlineState {
  deadlines: InitState<any[]>;

}

const initialState: DeadlineState = {
  deadlines: { data: [], loading: false, error: null, status: null },

};
const deadlineSlice = createSlice({
  name: "deadline",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listDeadline, "deadlines");
  },
});

export default deadlineSlice.reducer;
