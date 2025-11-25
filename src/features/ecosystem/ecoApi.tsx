import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const listEcoSystems = createAsyncThunk(
  "ecosystem/listEcoSystems",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/cms/ecosystems`
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

export const updateEcoSystem = createAsyncThunk(
  "ecosystem/updateEcoSystem",
  async (payload: any, thunkAPI) => {
    try {
      const {
       id, name, description
      }: any = payload;
      const response = await apiAxiosInstance.put(`/cms/ecosystems/update?id=${id}`, {
        name, description
      });
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

export const updateEcoSystemItem = createAsyncThunk(
  "ecosystem/updateEcoSystemItem",
  async (payload: any, thunkAPI) => {
    try {
      const {
       id, title, subtitle, link, content
      }: any = payload;
      const response = await apiAxiosInstance.put(`/cms/ecosystems/items/update?id=${id}`, {
        title, subtitle, link, content
      });
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
