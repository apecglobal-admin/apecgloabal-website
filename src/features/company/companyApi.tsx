import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const listCompanies = createAsyncThunk(
  "company/listCompanies",
  async (payload, thunkAPI) => {
    try {
      const { limit, page }: any = payload;
      const response = await apiAxiosInstance.get(
        `/cms/companies?limit=${limit}&page=${page}`
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
export const listIndustry = createAsyncThunk(
  "company/listIndustry",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/companies/industries`);
      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const createCompany = createAsyncThunk(
  "company/createCompany",
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.post(
        "/cms/companies/create",
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

export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async ({ id, data }: { id: string | number; data: FormData }, thunkAPI) => {
    //     for (let [key, value] of data.entries()) {
    //   console.log("abc", key, value);
    // }
    try {
      const response = await apiAxiosInstance.put(
        `/cms/companies/update?id=${id}`,
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

export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (ids, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.delete(
        `/cms/companies/delete`,
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