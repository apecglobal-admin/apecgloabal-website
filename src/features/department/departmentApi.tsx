import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const listDepartment = createAsyncThunk(
  'department/listDepartment', 
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/departments`);
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);