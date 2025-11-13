import { createSlice } from "@reduxjs/toolkit";
import {
  createProject,
  inviteEmployeeProject,
  listProjectById,
  listProjects,
  listStatusProject,
} from "./projectApi";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import build from "next/dist/build";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface ProjectState {
  projects: InitState<any[]>;
  project: InitState<any | null>;
  statusProject: InitState<any[]>;
}

const initialState: ProjectState = {
  projects: { data: [], loading: false, error: null, status: null },
  project: { data: null, loading: false, error: null, status: null },
  statusProject: { data: [], loading: false, error: null, status: null },
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listProjects, "projects");
    createAsyncReducer(builder, listProjectById, "project");
    createAsyncReducer(builder, listStatusProject, "statusProject");
    createAsyncReducer(builder, inviteEmployeeProject);
    createAsyncReducer(builder, createProject);
  },
});

export default projectSlice.reducer;