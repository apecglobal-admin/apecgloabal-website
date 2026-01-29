import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const listDeadline = createAsyncThunk(
  "deadline/listDeadline",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/cms/tasks/rules`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);

export const updateDeadline = createAsyncThunk(
  "deadline/updateDeadline",
  async (payload, thunkAPI) => {
    try {
      const { id, value }: any = payload;
      const response = await apiAxiosInstance.put(
        `/cms/tasks/rules/update`,
        {
          id, value
        },
      );
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
        console.log("error", error);
      toast.error(error?.response?.data?.data?.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);
