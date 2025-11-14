import { createSlice } from "@reduxjs/toolkit";
import { listDepartment } from "./departmentApi";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface DepartmentState {
  departments: InitState<any[]>;
  totalDepartments: InitState<any[]>;
}

const initialState: DepartmentState = {
  departments: { data: [], loading: false, error: null, status: null },
  totalDepartments: { data: [], loading: false, error: null, status: null },
};

const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listDepartment, ["departments", "totalDepartments",]);
  },
});

export default departmentSlice.reducer;
