import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import { listStatistics } from "./statisticsApi";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface StatisticsState {
  statistics: InitState<any[]>;

}

const initialState: StatisticsState = {
  statistics: { data: [], loading: false, error: null, status: null },

};
const StatisticsSlice = createSlice({
  name: "statistic",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listStatistics, "statistics");
  },
});

export default StatisticsSlice.reducer;
