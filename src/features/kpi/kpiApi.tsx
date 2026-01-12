import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const listUnitKpi = createAsyncThunk(
  "kpi/listUnitKpi",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/cms/select/option/units`);
      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listKPI = createAsyncThunk(
  'kpi/listKPI', 
  async (payload, thunkAPI) => {
    try {
      const {limit, page}: any = payload;
      const response = await apiAxiosInstance.get(`/cms/kpi?limit=${limit}&page=${page}`);
      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data.message,{
              position: "top-right",
            });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const createKPI = createAsyncThunk(
  "kpi/createKPI",
  async (payload: any, thunkAPI) => {
    try {
      const { name, description }: any = payload;
      const response = await apiAxiosInstance.post(`/cms/kpi/create`, {
       name, description
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

export const updateKPI = createAsyncThunk(
  "kpi/updateKPI",
  async (payload: any, thunkAPI) => {
    try {
      const { id, name, description }: any = payload;
      const response = await apiAxiosInstance.put(`/cms/kpi/update`, {
       id, name, description
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

export const listKPIChild = createAsyncThunk(
  'kpi/listKPIChild', 
  async (payload, thunkAPI) => {
    try {
      const {limit, page}: any = payload;
      const response = await apiAxiosInstance.get(`/cms/kpi/item?limit=${limit}&page=${page}`);
      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data.message,{
              position: "top-right",
            });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const createKPIChild = createAsyncThunk(
  "kpi/createKPIChild",
  async (payload: any, thunkAPI) => {
    try {
      const { kpi_id, name, description, unit_id }: any = payload;
      const response = await apiAxiosInstance.post(`/cms/kpi/item/create`, {
       kpi_id, name, description, unit_id
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

export const updateKPIChild = createAsyncThunk(
  "kpi/updateKPIChild",
  async (payload: any, thunkAPI) => {
    try {
      const { id, name, description, unit_id }: any = payload;
      const response = await apiAxiosInstance.put(`/cms/kpi/item/update`, {
       id, name, description, unit_id
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

export const updateKPIEmployees = createAsyncThunk(
  "kpi/updateKPIEmployees",
  async (payload: any, thunkAPI) => {
    try {
      const { id, kpis }: any = payload;
      const response = await apiAxiosInstance.put(`/cms/employees/kpi/weight/update`, {
       id, kpis
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