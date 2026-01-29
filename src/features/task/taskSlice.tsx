import { createSlice } from "@reduxjs/toolkit";

import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import { listTasks, listTasksById } from "./taskApi";

// Kiểu dữ liệu InitState (giống các slice khác)
interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

// Kiểu dữ liệu cho EmployeeSlice
interface TaskState {
  tasks: InitState<any[]>;
  totalTasks: InitState<any[]>;
  taskById: InitState<any | null>;
}

// Trạng thái khởi tạo
const initialState: TaskState = {
  tasks: { data: [], loading: false, error: null, status: null },
  totalTasks: { data: [], loading: false, error: null, status: null },
  taskById: { data: null, loading: false, error: null, status: null },
};

const employeeSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    // Dùng helper cho các async thunk có payload
    createAsyncReducer(builder, listTasks, ["tasks", "totalTasks"]);
    createAsyncReducer(builder, listTasksById, "taskById");

    // Dùng helper cho API chỉ cần status (không cần lưu payload)
  },
});

export default employeeSlice.reducer;
