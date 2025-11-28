import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import { listJobs, listJobStatus } from "./jobApi";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface JobsState {
  jobs: InitState<any[]>;
  totalJobs: InitState<any[]>;
  jobStatus: InitState<any[]>;
}

const initialState: JobsState = {
  jobs: { data: [], loading: false, error: null, status: null },
  totalJobs: { data: [], loading: false, error: null, status: null },
  jobStatus: { data: [], loading: false, error: null, status: null },
};
const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listJobs, ["jobs", "totalJobs",]);
    createAsyncReducer(builder, listJobStatus, "jobStatus");
  },
});

export default jobsSlice.reducer;
