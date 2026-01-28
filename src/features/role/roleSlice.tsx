import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import { listRoleGroupPreWebsite, listRoleLevelPositionWebsite, listRolePositionWebsite, listUserCMS, roleByUserId } from "./roleApi";
import { list } from "postcss";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface RoleState {
  users: InitState<any[]>;
  roleById: InitState<any[]>;
  positionRoles: InitState<any[]>;
  levelPositionRoles: InitState<any[]>;
  groupPreRoles: InitState<any[]>;
}

const initialState: RoleState = {
  users: { data: [], loading: false, error: null, status: null },
  roleById: { data: [], loading: false, error: null, status: null },
  positionRoles: { data: [], loading: false, error: null, status: null },
  levelPositionRoles: { data: [], loading: false, error: null, status: null },
  groupPreRoles: { data: [], loading: false, error: null, status: null },
};
const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listUserCMS, "users");
    createAsyncReducer(builder, roleByUserId, "roleById");
    createAsyncReducer(builder, listRolePositionWebsite, "positionRoles");
    createAsyncReducer(builder, listRoleLevelPositionWebsite, "levelPositionRoles");
    createAsyncReducer(builder, listRoleGroupPreWebsite, "groupPreRoles");
  },
});

export default roleSlice.reducer;
