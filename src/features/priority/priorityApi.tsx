import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const listPriority = createAsyncThunk(
  "priority/listPriority",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/cms/priority/setting`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);

export const createPriority = createAsyncThunk(
  "priority/createPriority",
  async (payload, thunkAPI) => {
    try {
      const { name, weight }: any = payload;
      const response = await apiAxiosInstance.post(
        "/cms/priority/setting/create",
        {
          name,
          weight,
        },
      );
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      toast.error(error?.response?.data.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);

export const updatePriority = createAsyncThunk(
  "priority/updatePriority",
  async (payload, thunkAPI) => {
    try {
      const { id, name, weight }: any = payload;
      const response = await apiAxiosInstance.put(
        `/cms/priority/setting/update`,
        {
          id,
          name,
          weight,
        },
      );
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      toast.error(error?.response?.data.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);

export const deletePriority = createAsyncThunk(
  "priority/deletePriority",
  async (ids, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.delete(
        `/cms/priority/setting/delete`,
        { data: { ids } } 
      );

      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);