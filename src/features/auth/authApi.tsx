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
