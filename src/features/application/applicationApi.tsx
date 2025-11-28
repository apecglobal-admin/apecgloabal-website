import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const listApplications = createAsyncThunk(
  "application/listApplications",
  async (payload, thunkAPI) => {
    try {
      const { limit, page }: any = payload;
      const response = await apiAxiosInstance.get(
        `/cms/applications?limit=${limit}&page=${page}`
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

export const listApplicationStatus = createAsyncThunk(
  "application/listApplicationStatus",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/applications/status`);
      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const reviewApplication = createAsyncThunk(
  "application/reviewApplication",
  async (payload: any, thunkAPI) => {
    try {
      const { id, status }: any = payload;
      const response = await apiAxiosInstance.put(
        `/cms/applications/status?id=${id}&status=${status}`
      );
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      toast.error(error?.response?.data.message,{
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const submitApplication = createAsyncThunk(
  "application/submitApplication",
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.post(
        "/applications/submit",
        formData
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