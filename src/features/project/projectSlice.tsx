import { createSlice } from "@reduxjs/toolkit";
import { inviteEmployeeProject, listProjectById, listProjects, listStatusProject } from "./projectApi";

const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: [],
    project: null,
    statusProject: [],
    loading: false,
    error: null,
  },
  reducers: {
    
  },
  extraReducers(builder) {
    builder
       .addCase(listProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(listProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })

      .addCase(listProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(listProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
      })

      .addCase(listStatusProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(listStatusProject.fulfilled, (state, action) => {
        state.loading = false;
        state.statusProject = action.payload;
      })

      .addCase(inviteEmployeeProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
  },
});

export default projectSlice.reducer;
