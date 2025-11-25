import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import { listUserCMS, roleByUserId } from "./roleApi";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface RoleState {
  users: InitState<any[]>;
  roleById: InitState<any[]>;
}

const initialState: RoleState = {
  users: { data: [], loading: false, error: null, status: null },
  roleById: { data: [], loading: false, error: null, status: null },
};
const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listUserCMS, "users");
    createAsyncReducer(builder, roleByUserId, "roleById");
  },
});

export default roleSlice.reducer;
