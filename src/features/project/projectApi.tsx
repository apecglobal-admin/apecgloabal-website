import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const listProjects = createAsyncThunk(
  "project/listProjects",
  async (payload, thunkAPI) => {
    try {
      const {limit, page, search}: any = payload;
      const response = await apiAxiosInstance.get(`/cms/projects?limit=${limit}&page=${page}&search=${search}`);
      return response.data;
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
      toast.error(error?.response?.data.message,{
        position: "top-right",
      });
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
      toast.error(error?.response?.data.message,{
        position: "top-right",
      });
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
      toast.error(error?.response?.data.message,{
        position: "top-right",
      });
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

export const listIssues = createAsyncThunk(
  "project/listIssues",
  async (payload, thunkAPI) => {
    try {
      const {project_id, limit, page}: any = payload;
      const response = await apiAxiosInstance.get(`/cms/projects/issues?project_id=${project_id}&limit=${limit}&page=${page}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const createIssues = createAsyncThunk(
  "project/createIssues",
  async (payload: any, thunkAPI) => {
    try {
      const { id ,title, description }: any = payload;
      const response = await apiAxiosInstance.post(`/cms/projects/issues/create?id=${id}`, {
       id ,title, description
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

export const deleteIssues = createAsyncThunk(
  "project/deleteIssues",
  async (ids, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.delete(
        `/cms/projects/issues/delete`,
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