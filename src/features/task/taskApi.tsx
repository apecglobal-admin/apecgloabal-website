import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const listTasks = createAsyncThunk(
  "task/listTasks",
  async (payload, thunkAPI) => {
    try {
      const { limit, page, search }: any = payload;
      const response = await apiAxiosInstance.get(
        `/cms/tasks?limit=${limit}&page=${page}&search=${search}`,
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

export const exportExcelTask = createAsyncThunk(
  "task/exportExcelTask",
  async (payload: any, thunkAPI) => {
    try {
      const { month, year } = payload;
      const response = await apiAxiosInstance.get(
        `/cms/tasks/export?month=${month}&year=${year}`,
        {
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "employees.xlsx";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error: any) {
      toast.error(error?.response?.data?.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.message);
    }
  },
);