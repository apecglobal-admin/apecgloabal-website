import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import { listApplications, listApplicationStatus } from "./applicationApi";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface ApplicationState {
  applications: InitState<any[]>;
  totalApplication: InitState<any[]>;
  applicationStatus: InitState<any[]>;
}

const initialState: ApplicationState = {
  applications: { data: [], loading: false, error: null, status: null },
  totalApplication: { data: [], loading: false, error: null, status: null },
  applicationStatus: { data: [], loading: false, error: null, status: null },
};
const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listApplications, ["applications", "totalApplication",]);
    createAsyncReducer(builder, listApplicationStatus, "applicationStatus");
  },
});

export default applicationSlice.reducer;
