import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const listDepartment = createAsyncThunk(
  'department/listDepartment', 
  async (payload, thunkAPI) => {
    try {
      const {limit, page}: any = payload;
      const response = await apiAxiosInstance.get(`/cms/departments?limit=${limit}&&page=${page}`);
      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data.message,{
              position: "top-right",
            });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const createDepartment = createAsyncThunk(
  "department/createDepartment",
  async (payload: any, thunkAPI) => {
    try {
      const { name, description, manager_id }: any = payload;
      const response = await apiAxiosInstance.post(`/cms/departments/create`, {
       name, description, manager_id
      });
      return {
        data: response.data,
        status: response.status
      };
    } catch (error: any) {
      toast.error(error?.response?.data.message,{
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const updateDepartment = createAsyncThunk(
  "department/updateDepartment",
  async (payload: any, thunkAPI) => {
    try {
      const { id, name, description, manager_id }: any = payload;
      const response = await apiAxiosInstance.put(`/cms/departments/update?id=${id}`, {
       name, description, manager_id
      });
      return {
        data: response.data,
        status: response.status
      };
    } catch (error: any) {
      toast.error(error?.response?.data.message,{
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const deleteDepartments = createAsyncThunk(
  "department/deleteDepartments",
  async (ids, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.delete(
        `/cms/departments/delete`,
        { data: { ids } } 
      );

      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      toast.error(error?.response?.data.message,{
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);