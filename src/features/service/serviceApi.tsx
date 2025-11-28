import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const listServices = createAsyncThunk(
  "services/listServices",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/cms/services`
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

export const listServicesType = createAsyncThunk(
  "services/listServicesType",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/services/category`);
      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const createServices = createAsyncThunk(
  "services/createServices",
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.post(
        "/cms/services/create",
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

export const updateServices = createAsyncThunk(
  "services/updateServices",
  async ({ id, data }: { id: string | number; data: FormData }, thunkAPI) => {
//     console.log("FormData content:");
// for (let [key, value] of data.entries()) {
//   console.log(key, value);
// }
    try {
      const response = await apiAxiosInstance.put(
        `/cms/services/update?id=${id}`,
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

export const deleteServices = createAsyncThunk(
  "services/deleteServices",
  async (ids, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.delete(
        `/cms/services/delete`,
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
