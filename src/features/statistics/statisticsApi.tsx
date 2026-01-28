import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const listStatistics = createAsyncThunk(
  "statistic/listStatistics",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/cms/dashboards`
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);