import { createSlice } from "@reduxjs/toolkit";
import { createOrUpdateEmployee, listContact, listEmployee, listEmployeeById, listManager, listSkill } from "./employeeApi";

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    employees: [],
    skills: [],
    contacts: [],
    managers: [],
    employeeById: null,
    loading: false,
    error: null,
  },
  reducers: {
    
  },
  extraReducers(builder) {
    builder
       .addCase(listEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(listEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })

      .addCase(listSkill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(listSkill.fulfilled, (state, action) => {
        state.loading = false;
        state.skills = action.payload;
      })

      .addCase(listContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(listContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload;
      })

      .addCase(listManager.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(listManager.fulfilled, (state, action) => {
        state.loading = false;
        state.managers = action.payload;
      })

      .addCase(createOrUpdateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(listEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(listEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.managers = action.payload;
      })
  },
});

export default employeeSlice.reducer;
