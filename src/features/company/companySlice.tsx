import { createSlice } from "@reduxjs/toolkit";
import { listCompanies, listIndustry } from "./companyApi";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface CompanyState {
  companies: InitState<any[]>;
  totalCompany: InitState<any[]>;
  industries: InitState<any[]>;
}

const initialState: CompanyState = {
  companies: { data: [], loading: false, error: null, status: null },
  totalCompany: { data: [], loading: false, error: null, status: null },
  industries: { data: [], loading: false, error: null, status: null },
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listCompanies, [ "companies", "totalCompany"]);
    createAsyncReducer(builder, listIndustry, "industries");
  },
});

export default companySlice.reducer;
