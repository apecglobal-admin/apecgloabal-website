import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const loginCMS = createAsyncThunk(
  "auth/loginCMS",
  async (payload: any, thunkAPI) => {
    try {
      const { username, password }: any = payload;
      const response = await apiAxiosInstance.post(`/cms/login`, {
        username,
        password,
      });
      return {
        status: response.status,
        data: response.data,
      }
    } catch (error: any) {
      toast.error(error?.response?.data.message,{
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listSideBars = createAsyncThunk(
  "auth/listSideBars",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/cms/sidebars`
      );
      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const userInfoCMS = createAsyncThunk(
  "auth/userInfoCMS",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/cms/profile`
      );
      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (payload: any, thunkAPI) => {
    try {
      const { old_password, new_password }: any = payload;
      const response = await apiAxiosInstance.put(`/cms/users/change/password`, {
        old_password,
        new_password,
      });
      return {
        status: response.status,
        data: response.data,
      }
    } catch (error: any) {
      toast.error(error?.response?.data.message,{
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);
