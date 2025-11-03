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
      const response = await apiAxiosInstance.get(`/projects/${id}`);
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
      const {
       id, members
      }: any = payload;
      const response = await apiAxiosInstance.post(`/projects/invite`, {
       id, members
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);