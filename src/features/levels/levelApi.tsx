import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const listLevels = createAsyncThunk(
  'level/listLevels', 
  async (payload, thunkAPI) => {
    try {
      const {limit, page, search}: any = payload;
      const response = await apiAxiosInstance.get(`/cms/levels?limit=${limit}&page=${page}&search=${search}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listLevelsForId = createAsyncThunk(
  'level/listLevelsForId', 
  async (id, thunkAPI) => {
    try {  
      const response = await apiAxiosInstance.get(`/cms/levels?id=${id}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listOptionLevels = createAsyncThunk(
  'level/listOptionLevels', 
  async (_, thunkAPI) => {
    try {  
      const response = await apiAxiosInstance.get(`/levels/select/options`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const createLevel = createAsyncThunk(
  "level/createLevel",
  async (payload: any, thunkAPI) => {
    try {
      const { name, next_level }: any = payload;
      const response = await apiAxiosInstance.post(`/cms/levels/create`, {
       name, next_level
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

export const updateLevel = createAsyncThunk(
  "level/updateLevel",
  async (payload: any, thunkAPI) => {
    try {
      const { id, name, next_level }: any = payload;
      const response = await apiAxiosInstance.put(`/cms/levels/update`, {
       id, name, next_level
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


export const deleteLevel = createAsyncThunk(
  "level/deleteLevel",
  async (ids, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.delete(
        `/cms/levels/delete`,
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