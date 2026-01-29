import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const listImage = createAsyncThunk(
  "image/listImage",
  async (payload, thunkAPI) => {
    try {
      const { limit, page }: any = payload;
      const response = await apiAxiosInstance.get(
        `/cms/images?limit=${limit}&page=${page}`
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listImageType = createAsyncThunk(
  "image/listImageType",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/images/types`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listPageImage = createAsyncThunk(
  "image/listPageImage",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/sliders/pages`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const createImage = createAsyncThunk(
  "image/createImage",
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.post(
        "/cms/images/create",
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

export const updateImage = createAsyncThunk(
  "image/updateImage",
  async ({ id, data }: { id: string | number; data: FormData }, thunkAPI) => {
    //     for (let [key, value] of data.entries()) {
    //   console.log("abc", key, value);
    // }
    try {
      const response = await apiAxiosInstance.put(
        `/cms/images/update?id=${id}`,
        data
      );

      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      toast.error(error?.response?.data?.message, {
        position: "top-right",
      });

      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const deleteImage = createAsyncThunk(
  "image/deleteImage",
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
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const updateStatusImage = createAsyncThunk(
  "image/updateStatusImage",
  async (id: any, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.put(
        `/cms/images/status?id=${id}`
      );
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      toast.error(error?.response?.data.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);
