import { createSlice } from "@reduxjs/toolkit";
import {
  createOrUpdateEmployee,
  listContact,
  listEmployee,
  listEmployeeById,
  listManager,
  listSkill,
  updateSkills,
} from "./employeeApi";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";

// Kiểu dữ liệu InitState (giống các slice khác)
interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

// Kiểu dữ liệu cho EmployeeSlice
interface EmployeeState {
  employees: InitState<any[]>;
  skills: InitState<any[]>;
  contacts: InitState<any[]>;
  managers: InitState<any[]>;
  employeeById: InitState<any | null>;
}

// Trạng thái khởi tạo
const initialState: EmployeeState = {
  employees: { data: [], loading: false, error: null, status: null },
  skills: { data: [], loading: false, error: null, status: null },
  contacts: { data: [], loading: false, error: null, status: null },
  managers: { data: [], loading: false, error: null, status: null },
  employeeById: { data: null, loading: false, error: null, status: null },
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    // Dùng helper cho các async thunk có payload
    createAsyncReducer(builder, listEmployee, "employees");
    createAsyncReducer(builder, listSkill, "skills");
    createAsyncReducer(builder, listContact, "contacts");
    createAsyncReducer(builder, listManager, "managers");
    createAsyncReducer(builder, listEmployeeById, "employeeById");

    // Dùng helper cho API chỉ cần status (không cần lưu payload)
    createAsyncReducer(builder, createOrUpdateEmployee);
    createAsyncReducer(builder, updateSkills);
  },
});

export default employeeSlice.reducer;
