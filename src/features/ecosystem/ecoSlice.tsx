import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import { listEcoSystems } from "./ecoApi";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface EcoSystemState {
  eco: InitState<any[]>;
}

const initialState: EcoSystemState = {
  eco: { data: [], loading: false, error: null, status: null },
};

const ecoSlice = createSlice({
  name: "ecosystem",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listEcoSystems, "eco");
  },
});

export default ecoSlice.reducer;
