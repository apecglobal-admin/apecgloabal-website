import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const listUserCMS = createAsyncThunk(
  "role/listUserCMS",
  async (id, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/cms/users`
      );
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);


export const roleByUserId = createAsyncThunk(
  "role/roleByUserId",
  async (id, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/cms/permissions/group?id=${id}`
      );
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const updateRoleUser = createAsyncThunk(
  "role/updateRoleUser",
  async (payload, thunkAPI) => {
    try {
      const { id, permissions }: any = payload;
      const response = await apiAxiosInstance.put(`/cms/decentralization`, {
        id,
        permissions,
      });
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      toast.error(error?.response?.data.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listRolePositionWebsite = createAsyncThunk(
  "role/listRolePositionWebsite",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/positions/select/options`
      );
      return {
        data: response.data.data,
        status: response.status,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listRoleLevelPositionWebsite = createAsyncThunk(
  "role/listRoleLevelPositionWebsite",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/levels/positions`
      );
      return {
        data: response.data.data,
        status: response.status,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listRoleGroupPreWebsite = createAsyncThunk(
  "role/listRoleGroupPreWebsite",
  async (payload, thunkAPI) => {
    try {
      const { position_id, level_id }: any = payload;
      const response = await apiAxiosInstance.get(
        `/cms/permissions/website/groups?position_id=${position_id}&level_id=${level_id}`
      );
      return {
        data: response.data.data,
        status: response.status,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const updateRolePositionUser = createAsyncThunk(
  "role/updateRolePositionUser",
  async (payload, thunkAPI) => {
    try {
      const { level_id, position_id, permissions }: any = payload;
      const response = await apiAxiosInstance.put(`/cms/permission/website/decentralize`, {
        level_id, position_id, permissions
      });
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      toast.error(error?.response?.data.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);