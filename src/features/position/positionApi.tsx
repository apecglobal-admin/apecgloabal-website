import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const listPosition = createAsyncThunk(
  'position/listPosition', 
  async (payload, thunkAPI) => {
    try {
      const {limit, page}: any = payload;
      const response = await apiAxiosInstance.get(`/cms/positions?limit=${limit}&page=${page}`);
      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data.message,{
              position: "top-right",
            });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const createPosition = createAsyncThunk(
  "position/createPosition",
  async (payload: any, thunkAPI) => {
    try {
      const { title, description, is_manager_position }: any = payload;
      const response = await apiAxiosInstance.post(`/cms/positions/create`, {
       title, description, is_manager_position
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

export const updatePosition = createAsyncThunk(
  "position/updatePosition",
  async (payload: any, thunkAPI) => {
    try {
      const { id, title, description,is_manager_position, is_active }: any = payload;
      const response = await apiAxiosInstance.put(`/cms/positions/update?id=${id}`, {
       title, description, is_manager_position, is_active
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


export const deletePosition = createAsyncThunk(
  "position/deletePosition",
  async (ids, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.delete(
        `/cms/positions/delete`,
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