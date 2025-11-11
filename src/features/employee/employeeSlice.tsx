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

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    employees: [],
    skills: [],
    contacts: [],
    managers: [],
    employeeById: [],
    loading: false,
    error: null,
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateSkills.fulfilled, (state) => {
        (state.status = "success"), (state.loading = false);
      })

      .addCase(listEmployeeById.fulfilled, (state, action) => {
        state.employeeById = action.payload;
        state.status = "success";
        state.loading = false;
      });

    // Dùng helper function
    createAsyncReducer(builder, listEmployee, "employees");
    createAsyncReducer(builder, listSkill, "skills");
    createAsyncReducer(builder, listContact, "contacts");
    createAsyncReducer(builder, listManager, "managers");
    // createAsyncReducer(builder, listEmployeeById, "employeeById");
    createAsyncReducer(builder, createOrUpdateEmployee); // không cần stateKey nếu không set payload
  },
});

export default employeeSlice.reducer;

