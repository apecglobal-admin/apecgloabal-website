import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import { listSupport, listSupportType } from "./supportApi";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface SupportState {
  supports: InitState<any[]>;
  totalSupport: InitState<any[]>;
  supportTypes: InitState<any[]>;
}

const initialState: SupportState = {
  supports: { data: [], loading: false, error: null, status: null },
  totalSupport: { data: [], loading: false, error: null, status: null },
  supportTypes: { data: [], loading: false, error: null, status: null },
};
const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listSupport, ["supports", "totalSupport",]);
    createAsyncReducer(builder, listSupportType, "supportTypes");
  },
});

export default supportSlice.reducer;
