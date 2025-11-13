import { createSlice } from "@reduxjs/toolkit";
import { listPosition } from "./positionApi";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface PositionState {
  positions: InitState<any[]>;
}

const initialState: PositionState = {
  positions: { data: [], loading: false, error: null, status: null },
};
const positionSlice = createSlice({
  name: "position",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listPosition, "positions");
  },
});

export default positionSlice.reducer;
