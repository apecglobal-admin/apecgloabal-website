import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import { listServices, listServicesType } from "./serviceApi";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface NotificationState {
  services: InitState<any[]>;
  servicesTypes: InitState<any[]>;
}

const initialState: NotificationState = {
  services: { data: [], loading: false, error: null, status: null },
  servicesTypes: { data: [], loading: false, error: null, status: null },
};
const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listServices, "services");
    createAsyncReducer(builder, listServicesType, "servicesTypes");
  },
});

export default servicesSlice.reducer;
