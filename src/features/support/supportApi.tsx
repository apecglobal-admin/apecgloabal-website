import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const listSupport = createAsyncThunk(
  "support/listSupport",
  async (payload, thunkAPI) => {
    try {
      const { limit, page }: any = payload;
      const response = await apiAxiosInstance.get(
        `/cms/contracts/requests/form?limit=${limit}&page=${page}`
      );
      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data.message,{
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listSupportType = createAsyncThunk(
  "support/listSupportType",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/contracts/types`);
      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data.message,{
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const updateSupport = createAsyncThunk(
  "support/updateSupport",
  async (payload, thunkAPI) => {
    try {
      const { id, status_id }: any = payload;
      const response = await apiAxiosInstance.put(
        `/cms/contracts/requests/change?id=${id}&status_id=${status_id}`
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

export const deleteSupport = createAsyncThunk(
  "support/deleteSupport",
  async (ids, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.delete(
        `/cms/contracts/requests/delete`,
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