import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const listPolicy = createAsyncThunk(
  'policy/listPolicy', 
  async (payload, thunkAPI) => {
    try {
      const {limit, page}: any = payload;
      const response = await apiAxiosInstance.get(`/cms/policy?limit=${limit}&page=${page}`);
      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data.message,{
              position: "top-right",
            });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listPolicyType = createAsyncThunk(
  'policy/listPolicyType', 
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/policy/types`);
      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data.message,{
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const createPolicy = createAsyncThunk(
  "policy/createPolicy",
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.post(
        "/cms/policy/create",
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

export const updatePolicy = createAsyncThunk(
  "policy/updatePolicy",
  async ({ id, data }: { id: string | number; data: FormData }, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.put(
        `/cms/policy/update?id=${id}`,
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

// export const deletePolicy = createAsyncThunk(
//   "policy/deletePolicy",
//   async (ids, thunkAPI) => {
//     try {
//       const response = await apiAxiosInstance.delete(
//         `/cms/departments/delete`,
//         { data: { ids } } 
//       );

//       return {
//         data: response.data,
//         status: response.status,
//       };
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
//     }
//   }
// );