import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const listPosition = createAsyncThunk(
  'position/listPosition', 
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/positions?limit=100`);
      return response.data.data.positions;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);