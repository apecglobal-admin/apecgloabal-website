// src/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 
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
import newsReducer from "./features/news/newsSlice";
import statisticReducer from "./features/statistics/statisticsSlice";

// ✅ Config persist cho auth reducer
const persistConfig = {
  key: "cms-root",
  storage,
  whitelist: ["auth"], // Chỉ persist auth reducer
};

// ✅ Config riêng cho auth để chỉ persist một số fields
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["sidebars", "userInfo"], // Chỉ persist sidebars và userInfo
};

// ✅ Combine tất cả reducers
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
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
  news: newsReducer,
  statistic: statisticReducer,
});

// ✅ Tạo persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Configure store với persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

// ✅ Export persistor
export const persistor = persistStore(store);
export default store;

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;