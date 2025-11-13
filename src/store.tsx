import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "./features/employee/employeeSlice";
import departmentReducer from "./features/department/departmentSlice";
import positionReducer from "./features/position/positionSlice";
import projectReducer from "./features/project/projectSlice";
import companyReducer from "./features/company/companySlice";
import authReducer from "./features/auth/authSlice";
import eventReducer from "./features/event/eventSlice"
const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer, 
    department: departmentReducer,
    position: positionReducer, 
    project: projectReducer,
    company: companyReducer,
    event: eventReducer
  },
});

export default store;
