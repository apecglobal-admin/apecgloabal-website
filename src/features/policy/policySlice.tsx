import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import { listPolicy, listPolicyType } from "./policyApi";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface PositionState {
  policies: InitState<any[]>;
  totalPolicy: InitState<any[]>;
  policyTypes: InitState<any[]>;
}

const initialState: PositionState = {
  policies: { data: [], loading: false, error: null, status: null },
  totalPolicy: { data: [], loading: false, error: null, status: null },
  policyTypes: { data: [], loading: false, error: null, status: null },
};
const positionSlice = createSlice({
  name: "policy",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listPolicy, ["policies", "totalPolicy",]);
    createAsyncReducer(builder, listPolicyType, "policyTypes");
  },
});

export default positionSlice.reducer;
