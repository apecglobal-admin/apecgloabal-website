import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const listEvent = createAsyncThunk(
  'event/listEvent', 
  async (payload, thunkAPI) => {
    try {
      const {limit, page}: any = payload;
      const response = await apiAxiosInstance.get(`/cms/events?limit=${limit}&&page=${page}`);
      console.log("reson api", response.data)
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const createEvent = createAsyncThunk(
  "event/createEvent",
  async (payload: any, thunkAPI) => {
    try {
      const { title, description, date, time,end_time, end_date, address, event_type_id }: any = payload;
      const response = await apiAxiosInstance.post(`/cms/events/create`, {
       title, description, date, time,end_time, end_date, address, event_type_id
      });
      return {
        data: response.data,
        status: response.status
      };
    } catch (error: any) {
      toast.error(error?.response?.data.message)
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const updateEvent = createAsyncThunk(
  "event/updateEvent",
  async (payload: any, thunkAPI) => {
    try {
      const { id, title, description, date, time,end_time, end_date, address, event_type_id }: any = payload;
      const response = await apiAxiosInstance.put(`/cms/events/update?id=${id}`, {
       title, description, date, time,end_time, end_date, address, event_type_id
      });
      return {
        data: response.data,
        status: response.status
      };
    } catch (error: any) {
      toast.error(error?.response?.data.message)
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const deleteEvents = createAsyncThunk(
  "event/deleteEvents",
  async (ids, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.delete(
        `/cms/events/delete`,
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
