import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import { listNotification, listNotificationType } from "./notificationApi";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface NotificationState {
  notifications: InitState<any[]>;
  totalNotification: InitState<any[]>;
  notificationTypes: InitState<any[]>;
}

const initialState: NotificationState = {
  notifications: { data: [], loading: false, error: null, status: null },
  totalNotification: { data: [], loading: false, error: null, status: null },
  notificationTypes: { data: [], loading: false, error: null, status: null },
};
const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listNotification, ["notifications", "totalNotification",]);
    createAsyncReducer(builder, listNotificationType, "notificationTypes");
  },
});

export default notificationSlice.reducer;
