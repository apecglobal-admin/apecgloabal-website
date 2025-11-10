import { createSlice } from "@reduxjs/toolkit";
import { inviteEmployeeProject, listProjectById, listProjects, listStatusProject } from "./projectApi";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";

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
    createAsyncReducer(builder, listProjects, "projects");
    createAsyncReducer(builder, listProjectById, "project");
    createAsyncReducer(builder, listStatusProject, "statusProject");
    createAsyncReducer(builder, inviteEmployeeProject);
  },
});

export default projectSlice.reducer;
