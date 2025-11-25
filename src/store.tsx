import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "./features/employee/employeeSlice";
import departmentReducer from "./features/department/departmentSlice";
import positionReducer from "./features/position/positionSlice";
import projectReducer from "./features/project/projectSlice";
import companyReducer from "./features/company/companySlice";
import authReducer from "./features/auth/authSlice";
import eventReducer from "./features/event/eventSlice";
import policyReducer from "./features/policy/policySlice";
import supportReducer from "./features/support/supportSlice";
import notificationReducer from "./features/notification/notificationSlice";
import imageReducer from "./features/image/imageSlice";
import roleReducer from "./features/role/roleSlice";
import contactReducer from "./features/contact/contactSlice";
import ecoReducer from "./features/ecosystem/ecoSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
    department: departmentReducer,
    position: positionReducer,
    project: projectReducer,
    company: companyReducer,
    event: eventReducer,
    policy: policyReducer,
    support: supportReducer,
    notification: notificationReducer,
    image: imageReducer,
    role: roleReducer,
    contact: contactReducer,
    ecosystem: ecoReducer,
  },
});

export default store;
