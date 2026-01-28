import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const listJobs = createAsyncThunk(
  "jobs/listJobs",
  async (payload, thunkAPI) => {
    try {
      const { limit, page }: any = payload;
      const response = await apiAxiosInstance.get(
        `/cms/jobs?limit=${limit}&page=${page}`
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listJobStatus = createAsyncThunk(
  "jobs/listJobStatus",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/jobs/status`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.post(
        "/cms/jobs/create",
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

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ id, data }: { id: string | number; data: FormData }, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.put(
        `/cms/jobs/update?id=${id}`,
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

export const deleteJobs = createAsyncThunk(
  "jobs/deleteJobs",
  async (ids, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.delete(
        `/cms/jobs/delete`,
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

export const updateJobStatus = createAsyncThunk(
  "jobs/updateJobStatus",
  async (payload: any, thunkAPI) => {
    try {
      const { id, status }: any = payload;
      const response = await apiAxiosInstance.put(
        `/cms/jobs/status?id=${id}&status=${status}`
      );
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      toast.error(error?.response?.data.message,{
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);