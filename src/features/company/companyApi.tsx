import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const listCompanies = createAsyncThunk(
  "company/listCompanies",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/companies`);
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);