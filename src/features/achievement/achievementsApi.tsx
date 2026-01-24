import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const listAchivements = createAsyncThunk(
  "achievement/listAchivements",
  async (payload, thunkAPI) => {
    try {
      const { limit, page }: any = payload;
      const response = await apiAxiosInstance.get(
        `/cms/achievements?limit=${limit}&page=${page}`,
      );
      return {
        status: response.status,
        data: response.data.data,
      };
    } catch (error: any) {
      toast.error(error?.response?.data.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);

export const listAchivementById = createAsyncThunk(
  "achievement/listAchivementById",
  async (id, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/cms/achievements?id=${id}`);
      return response.data.data;
    } catch (error: any) {
      toast.error(error?.response?.data.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);

export const listAchivementCategory = createAsyncThunk(
  "achievement/listAchivementCategory",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/cms/select/options/achievement_categories`);
      return response.data.data;
    } catch (error: any) {
      toast.error(error?.response?.data.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);

export const createAchivement = createAsyncThunk(
  "achievement/createAchivement",
  async (payload: any, thunkAPI) => {
    try {
      const {
        name,
        description,
        achievement_category_id,
        document,
        employees,
      }: any = payload;
      const response = await apiAxiosInstance.post(`/cms/achievements/create`, {
        name,
        description,
        achievement_category_id,
        document,
        employees,
      });
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      toast.error(error?.response?.data.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);

export const updateAchievement = createAsyncThunk(
  "achievement/updateAchivement",
  async (payload: any, thunkAPI) => {
    try {
      const {
        id,
        name,
        description,
        achievement_category_id,
        document,
        employees,
      }: any = payload;
      const response = await apiAxiosInstance.put(`/cms/achievements/update`, {
        id,
        name,
        description,
        achievement_category_id,
        document,
        employees,
      });
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      toast.error(error?.response?.data.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);

export const deleteAchivements = createAsyncThunk(
  "achievement/deleteAchivements",
  async (ids, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.delete(
        `/cms/achievements/delete`,
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

export const uploadImage = createAsyncThunk(
  "achievement/uploadImage",
  async (payload: { file: File }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("file", payload.file); 

      const response = await apiAxiosInstance.post(
        "/file/images/uploads",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      toast.error(error?.response?.data?.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(
        error?.response?.data || error?.message
      );
    }
  }
);

export const uploadDocument = createAsyncThunk(
  "achievement/uploadDocument",
  async (payload: { file: File }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("file", payload.file); 

      const response = await apiAxiosInstance.post(
        "/file/documents/uploads",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      toast.error(error?.response?.data?.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(
        error?.response?.data || error?.message
      );
    }
  }
);