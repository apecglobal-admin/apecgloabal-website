import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const listTasks = createAsyncThunk(
  "task/listTasks",
  async (payload, thunkAPI) => {
    try {
      const { limit, page }: any = payload;
      const response = await apiAxiosInstance.get(
        `/cms/tasks?limit=${limit}&page=${page}`,
      );
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);

export const listTasksById = createAsyncThunk(
  "task/listTasksById",
  async (id, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/cms/tasks?id=${id}`);
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);