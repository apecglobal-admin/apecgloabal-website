import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const listNotification = createAsyncThunk(
  "notification/listNotification",
  async (payload, thunkAPI) => {
    try {
      const { limit, page, search }: any = payload;
      const response = await apiAxiosInstance.get(
        `/cms/notifications?limit=${limit}&page=${page}&search=${search}`
      );
      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listNotificationType = createAsyncThunk(
  "notification/listNotificationType",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/notifications/types`);
      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const createNotification = createAsyncThunk(
  "notification/createNotification",
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.post(
        "/cms/notifications/create",
        formData
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
  }
);

export const updateNotification = createAsyncThunk(
  "notification/updateNotification",
  async ({ id, data }: { id: string | number; data: FormData }, thunkAPI) => {
//     console.log("FormData content:");
// for (let [key, value] of data.entries()) {
//   console.log(key, value);
// }
    try {
      const response = await apiAxiosInstance.put(
        `/cms/notifications/update?id=${id}`,
        data 
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
  }
);

export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (ids, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.delete(
        `/cms/notifications/delete`,
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
