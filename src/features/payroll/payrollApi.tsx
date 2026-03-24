import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const listContractPayroll = createAsyncThunk(
  "payroll/listContractPayroll",
  async (token: any, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/cms/payroll/contract/types`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

export const updateContractPayroll = createAsyncThunk(
  "payroll/updateContractPayroll",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id, name, is_insurance, active} = payload;

      const response = await apiAxiosInstance.put(
        `/cms/payroll/contract/types/edit`,
        { id, name, is_insurance, active },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
  }
);

export const createContractPayroll = createAsyncThunk(
  "payroll/createContractPayroll",
  async (payload: any, thunkAPI) => {
    try {
        const {token, name, is_insurance} = payload;
      const response = await apiAxiosInstance.post(
        "/cms/payroll/contract/types/create",
        { name, is_insurance },
         {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

export const deleteContractPayroll = createAsyncThunk(
  "payroll/deleteContractPayroll",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id } = payload;
      const response = await apiAxiosInstance.delete(
        `/cms/payroll/contract/types/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { id }
        }
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

export const listAllowancesPayroll = createAsyncThunk(
  "payroll/listAllowancesPayroll",
  async (token: any, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/cms/payroll/allowances`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

export const updateAllowancesPayroll = createAsyncThunk(
  "payroll/updateAllowancesPayroll",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id, name, active, is_auto, amount} = payload;

      const response = await apiAxiosInstance.put(
        `/cms/payroll/allowances/edit`,
        { id, name, active, is_auto, amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
  }
);

export const createAllowancesPayroll = createAsyncThunk(
  "payroll/createAllowancesPayroll",
  async (payload: any, thunkAPI) => {
    try {
        const {token, name, is_auto, amount} = payload;
      const response = await apiAxiosInstance.post(
        "/cms/payroll/allowances/create",
        { name, is_auto, amount },
         {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

export const deleteAllowancesPayroll = createAsyncThunk(
  "payroll/deleteAllowancesPayroll",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id } = payload;
      const response = await apiAxiosInstance.delete(
        `/cms/payroll/allowances/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { id }
        }
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

export const listBonusPayroll = createAsyncThunk(
  "payroll/listBonusPayroll",
  async (token: any, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/cms/payroll/bonus`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

export const updateBonusPayroll = createAsyncThunk(
  "payroll/updateBonusPayroll",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id, name, active, is_auto, amount} = payload;

      const response = await apiAxiosInstance.put(
        `/cms/payroll/bonus/edit`,
        { id, name, active, is_auto, amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
  }
);

export const createBonusPayroll = createAsyncThunk(
  "payroll/createBonusPayroll",
  async (payload: any, thunkAPI) => {
    try {
        const {token, name, is_auto, amount} = payload;
      const response = await apiAxiosInstance.post(
        "/cms/payroll/bonus/create",
        { name, is_auto, amount },
         {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

export const deleteBonusPayroll = createAsyncThunk(
  "payroll/deleteBonusPayroll",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id } = payload;
      const response = await apiAxiosInstance.delete(
        `/cms/payroll/bonus/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { id }
        }
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

export const listDeductionsPayroll = createAsyncThunk(
  "payroll/listDeductionsPayroll",
  async (token: any, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/cms/payroll/deductions`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

export const updateDeductionsPayroll = createAsyncThunk(
  "payroll/updateDeductionsPayroll",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id, name, active, is_auto, amount} = payload;

      const response = await apiAxiosInstance.put(
        `/cms/payroll/deductions/edit`,
        { id, name, active, is_auto, amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
  }
);

export const createDeductionsPayroll = createAsyncThunk(
  "payroll/createDeductionsPayroll",
  async (payload: any, thunkAPI) => {
    try {
        const {token, name, is_auto, amount} = payload;
      const response = await apiAxiosInstance.post(
        "/cms/payroll/deductions/create",
        { name, is_auto, amount },
         {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

export const deleteDeductionsPayroll = createAsyncThunk(
  "payroll/deleteDeductionsPayroll",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id } = payload;
      const response = await apiAxiosInstance.delete(
        `/cms/payroll/deductions/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { id }
        }
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

export const listInsurancePayroll = createAsyncThunk(
  "payroll/listInsurancePayroll",
  async (token: any, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/cms/payroll/settings`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

export const updateInsurancePayroll = createAsyncThunk(
  "payroll/updateInsurancePayroll",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id, name, value} = payload;

      const response = await apiAxiosInstance.put(
        `/cms/payroll/settings/edit`,
        { id, name, value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
  }
);