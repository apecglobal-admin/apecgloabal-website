import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import { listAllowancesPayroll, listBonusPayroll, listContractPayroll, listDeductionsPayroll, listInsurancePayroll } from "./payrollApi";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface PayrollState {
 contracts: InitState<any[]>;
 allowances: InitState<any[]>;
 bonus: InitState<any[]>;
 deductions: InitState<any[]>;
 insurances: InitState<any[]>;

}

const initialState: PayrollState = {
    contracts: { data: [], loading: false, error: null, status: null },
    allowances: { data: [], loading: false, error: null, status: null },
    bonus: { data: [], loading: false, error: null, status: null },
    deductions: { data: [], loading: false, error: null, status: null },
    insurances: { data: [], loading: false, error: null, status: null },

};

const payrollSlice = createSlice({
  name: "payroll",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listContractPayroll, "contracts");
    createAsyncReducer(builder, listAllowancesPayroll, "allowances");
    createAsyncReducer(builder, listBonusPayroll, "bonus");
    createAsyncReducer(builder, listDeductionsPayroll, "deductions");
    createAsyncReducer(builder, listInsurancePayroll, "insurances");
  
  },
});

export default payrollSlice.reducer;
