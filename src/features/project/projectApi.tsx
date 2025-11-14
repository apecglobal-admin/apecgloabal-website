import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const listProjects = createAsyncThunk(
  "project/listProjects",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/projects`);
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listProjectById = createAsyncThunk(
  "project/listProjectById",
  async (id, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/cms/projects?id=${id}`);
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listStatusProject = createAsyncThunk(
  "project/listStatusProject",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/projects/status`);
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const inviteEmployeeProject = createAsyncThunk(
  "project/inviteEmployeeProject",
  async (payload: any, thunkAPI) => {
    try {
      const { id, members }: any = payload;
      const response = await apiAxiosInstance.post(`/projects/invite`, {
        id,
        members,
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const createProject = createAsyncThunk(
  "project/createProject",
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.post(
        "/cms/projects/create",
        formData
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

export const updateProject = createAsyncThunk(
  "project/updateProject",
  async ({ id, data }: { id: string | number; data: FormData }, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.put(
        `/cms/projects/update?id=${id}`,
        data // đây là FormData
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

export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async (ids, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.delete(
        `/cms/projects/delete`,
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
