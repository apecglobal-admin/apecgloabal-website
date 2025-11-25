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
      toast.error(error?.response?.data.message, {
        position: "top-right",
      });
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
      toast.error(error?.response?.data.message, {
        position: "top-right",
      });
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
