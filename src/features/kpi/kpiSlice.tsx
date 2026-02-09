import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import { listKPI, listKPIChild, listUnitKpi } from "./kpiApi";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface KpiState {
  units: InitState<any[]>;
  kpis: InitState<any[]>;
  totalKpi: InitState<any[]>;
  kpiChild: InitState<any[]>;
  totalKpiChild: InitState<any[]>;
}

const initialState: KpiState = {
  units: { data: [], loading: false, error: null, status: null },
  kpis: { data: [], loading: false, error: null, status: null },
  totalKpi: { data: [], loading: false, error: null, status: null },
  kpiChild: { data: [], loading: false, error: null, status: null },
  totalKpiChild: { data: [], loading: false, error: null, status: null },
};
const kpiSlice = createSlice({
  name: "kpi",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listUnitKpi, "units");
    createAsyncReducer(builder, listKPI, ["kpis", "totalKpi"]);
    createAsyncReducer(builder, listKPIChild, ["kpiChild", "totalKpiChild"]);
  },
});

export default kpiSlice.reducer;
