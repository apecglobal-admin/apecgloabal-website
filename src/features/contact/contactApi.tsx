import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const listContactInfo = createAsyncThunk(
  "contact/listContactInfo",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/cms/info`
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const updateContact = createAsyncThunk(
  "contact/updateContact",
  async (payload: any, thunkAPI) => {
    try {
      const {
       id, title,content,email,phone,start_time,end_time,work_day_from,work_day_to
      }: any = payload;
      const response = await apiAxiosInstance.put(`/cms/info/update?id=${id}`, {
        title,content,email,phone,start_time,end_time,work_day_from,work_day_to,
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

