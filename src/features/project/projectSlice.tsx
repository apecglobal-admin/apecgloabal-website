import { createSlice } from "@reduxjs/toolkit";
import {
  createProject,
  inviteEmployeeProject,
  listIssues,
  listProjectById,
  listProjects,
  listStatusProject,
} from "./projectApi";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface ProjectState {
  projects: InitState<any[]>;
  totalProjects: InitState<number>;
  project: InitState<any | null>;
  statusProject: InitState<any[]>;
  issues: InitState<any[]>;
  totalIssues: InitState<any[]>;
}

const initialState: ProjectState = {
  projects: { data: [], loading: false, error: null, status: null },
  totalProjects: { data: 0, loading: false, error: null, status: null },
  project: { data: null, loading: false, error: null, status: null },
  statusProject: { data: [], loading: false, error: null, status: null },
  issues: { data: [], loading: false, error: null, status: null },
  totalIssues: { data: [], loading: false, error: null, status: null },
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listProjects, ["projects", "totalProjects"]);
    createAsyncReducer(builder, listProjectById, "project");
    createAsyncReducer(builder, listStatusProject, "statusProject");
    createAsyncReducer(builder, listIssues, ["issues", "totalIssues"]);
    createAsyncReducer(builder, inviteEmployeeProject);
    createAsyncReducer(builder, createProject);
  },
});

export default projectSlice.reducer;