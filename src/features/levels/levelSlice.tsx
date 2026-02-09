import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import { listPosition } from "../position/positionApi";
import { listLevels, listLevelsForId, listOptionLevels } from "./levelApi";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface LevelState {
  levels: InitState<any[]>;
  totalLevels: InitState<any[]>;
  levelId: InitState<any | null>;
  optionLevels: InitState<any[]>;
}

const initialState: LevelState = {
  levels: { data: [], loading: false, error: null, status: null },
  totalLevels: { data: [], loading: false, error: null, status: null },
  levelId: { data: null, loading: false, error: null, status: null },
    optionLevels: { data: [], loading: false, error: null, status: null }
};
const levelSlice = createSlice({
  name: "level",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listLevels, ["levels", "totalLevels",]);
    createAsyncReducer(builder, listLevelsForId, "levelId");
    createAsyncReducer(builder, listOptionLevels, "optionLevels");
  },
});

export default levelSlice.reducer;
