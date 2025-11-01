import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const listEmployee = createAsyncThunk(
  'employee/listEmployee', 
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/employees`);
      return response.data.data.employees;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listEmployee1 = createAsyncThunk(
  'employee/listEmployee1', 
  async (payload: any, thunkAPI) => {
    try {
      const { email, password }: any = payload; 
      const response = await apiAxiosInstance.post(`/auth/login`,{      
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);
