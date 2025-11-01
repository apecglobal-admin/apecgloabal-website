import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "./features/employee/employeeSlice";
import departmentReducer from "./features/department/departmentSlice";
import positionReducer from "./features/position/positionSlice";
const store = configureStore({
  reducer: {
    employee: employeeReducer, 
    department: departmentReducer,
    position: positionReducer, 
  },
});

export default store;
