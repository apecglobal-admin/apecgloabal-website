import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";


export const listAbsences = createAsyncThunk(
  "attendance/listAbsences",
  async (token: any, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/cms/attendance/absence`,{
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

export const updateAbsence = createAsyncThunk(
  "attendance/updateAbsence",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id, name, description, is_attendance_added, is_leave_deducted } = payload;

      const response = await apiAxiosInstance.put(
        `/cms/attendance/absence/edit`,
        { id, name, description, is_attendance_added, is_leave_deducted },
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

export const updateAbsenceStatus = createAsyncThunk(
  "attendance/updateAbsenceStatus",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id } = payload;

      const response = await apiAxiosInstance.put(
        `/cms/attendance/absence/status`,
        { id },
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

export const createAbsence = createAsyncThunk(
  "attendance/createAbsence",
  async (payload: any, thunkAPI) => {
    try {
        const {token, name, description, is_attendance_added, is_leave_deducted} = payload;
      const response = await apiAxiosInstance.post(
        "/cms/attendance/absence/create",
        { name, description,  is_attendance_added, is_leave_deducted },
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

export const deleteAbsence = createAsyncThunk(
  "attendance/deleteAbsence",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id } = payload;
      const response = await apiAxiosInstance.delete(
        `/cms/attendance/absence/delete`,
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

export const listPolicyAttendance = createAsyncThunk(
  "attendance/listPolicyAttendance",
  async (token: any, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/cms/attendance/policy`,{
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

export const updatePolicyAttendance = createAsyncThunk(
  "attendance/updatePolicyAttendance",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id, name, description} = payload;

      const response = await apiAxiosInstance.put(
        `/cms/attendance/policy/edit`,
        { id, name, description },
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

export const createPolicyAttendance = createAsyncThunk(
  "attendance/createPolicyAttendance",
  async (payload: any, thunkAPI) => {
    try {
        const {token, name, description} = payload;
      const response = await apiAxiosInstance.post(
        "/cms/attendance/policy/create",
        { name, description },
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

export const deletePolicyAttendance = createAsyncThunk(
  "attendance/deletePolicyAttendance",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id } = payload;
      const response = await apiAxiosInstance.delete(
        `/cms/attendance/policy/delete`,
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

export const listShiftWorkAttendance = createAsyncThunk(
  "attendance/listShiftWorkAttendance",
  async (token: any, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/cms/attendance/shift/work`,{
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

export const updateShiftWorkAttendance = createAsyncThunk(
  "attendance/updateShiftWorkAttendance",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id, name, checkin, checkout} = payload;

      const response = await apiAxiosInstance.put(
        `/cms/attendance/shift/work/edit`,
        { id, name, checkin, checkout },
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

export const createShiftWorkAttendance = createAsyncThunk(
  "attendance/createShiftWorkAttendance",
  async (payload: any, thunkAPI) => {
    try {
        const {token, name, checkin, checkout} = payload;
      const response = await apiAxiosInstance.post(
        "/cms/attendance/shift/work/create",
        { name, checkin, checkout },
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

export const deleteShiftWorkAttendance = createAsyncThunk(
  "attendance/deleteShiftWorkAttendance",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id } = payload;
      const response = await apiAxiosInstance.delete(
        `/cms/attendance/shift/work/delete`,
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

export const listShiftWorkSaturdayAttendance = createAsyncThunk(
  "attendance/listShiftWorkSaturdayAttendance",
  async (token: any, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/cms/attendance/saturday/shift/work`,{
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

export const updateShiftWorkSaturdayAttendance = createAsyncThunk(
  "attendance/updateShiftWorkSaturdayAttendance",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id, name, checkin, checkout} = payload;

      const response = await apiAxiosInstance.put(
        `/cms/attendance/saturday/shift/work/edit`,
        { id, name, checkin, checkout },
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

export const createShiftWorkSaturdayAttendance = createAsyncThunk(
  "attendance/createShiftWorkSaturdayAttendance",
  async (payload: any, thunkAPI) => {
    try {
        const {token, name, checkin, checkout} = payload;
      const response = await apiAxiosInstance.post(
        "/cms/attendance/saturday/shift/work/create",
        { name, checkin, checkout },
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

export const deleteShiftWorkSaturdayAttendance = createAsyncThunk(
  "attendance/deleteShiftWorkSaturdayAttendance",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id } = payload;
      const response = await apiAxiosInstance.delete(
        `/cms/attendance/saturday/shift/work/delete`,
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

export const listStatusAbsence = createAsyncThunk(
  "attendance/listStatusAbsence",
  async (token: any, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/cms/attendance/absence/status/select`,{
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

export const listTypeAbsence = createAsyncThunk(
  "attendance/listTypeAbsence",
  async (token: any, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/cms/attendance/absence/select`,{
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

export const listEmployeeAbsences = createAsyncThunk(
  "attendance/listEmployeeAbsences",
  async (payload: any, thunkAPI) => {
    try {
      const {
        token,
        id,
        absence_id,
        attendance_status_id,
        page,
        limit,
        search,
      } = payload;

      const response = await apiAxiosInstance.get(
        `/cms/attendance/absence/employee`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            id,
            absence_id,
            attendance_status_id,
            page,
            limit,
            search,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(
        error?.response?.data || error?.message
      );
    }
  }
);

export const listEmployeeAbsencesById = createAsyncThunk(
  "attendance/listEmployeeAbsencesById",
  async (payload: any, thunkAPI) => {
    try {
      const {
        token,
        id,
       
      } = payload;

      const response = await apiAxiosInstance.get(
        `/cms/attendance/absence/employee`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            id,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(
        error?.response?.data || error?.message
      );
    }
  }
);

export const listSenioritiesAttendance = createAsyncThunk(
  "attendance/listSenioritiesAttendance",
  async (token: any, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/cms/attendance/leave/seniorities`,{
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

export const updateSenioritiesAttendance = createAsyncThunk(
  "attendance/updateSenioritiesAttendance",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id, years_required, days_granted} = payload;

      const response = await apiAxiosInstance.put(
        `/cms/attendance/leave/seniorities/edit`,
        { id, years_required, days_granted },
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

export const createSenioritiesAttendance = createAsyncThunk(
  "attendance/createSenioritiesAttendance",
  async (payload: any, thunkAPI) => {
    try {
        const {token, years_required, days_granted} = payload;
      const response = await apiAxiosInstance.post(
        "/cms/attendance/leave/seniorities/create",
        { years_required, days_granted },
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

export const deleteSenioritiesAttendance = createAsyncThunk(
  "attendance/deleteSenioritiesAttendance",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id } = payload;
      const response = await apiAxiosInstance.delete(
        `/cms/attendance/leave/seniorities/delete`,
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

export const listHolidayAttendance = createAsyncThunk(
  "attendance/listHolidayAttendance",
  async (token: any, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/cms/attendance/holiday`,{
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

export const updateHolidayAttendance = createAsyncThunk(
  "attendance/updateHolidayAttendance",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id, name, start_date, end_date } = payload;

      const response = await apiAxiosInstance.put(
        `/cms/attendance/holiday/edit`,
        { id, name, start_date, end_date },
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

export const createHolidayAttendance = createAsyncThunk(
  "attendance/createHolidayAttendance",
  async (payload: any, thunkAPI) => {
    try {
        const {token, name, start_date, end_date} = payload;
      const response = await apiAxiosInstance.post(
        "/cms/attendance/holiday/create",
        { name, start_date, end_date },
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

export const deleteHolidayAttendance = createAsyncThunk(
  "attendance/deleteHolidayAttendance",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id } = payload;
      const response = await apiAxiosInstance.delete(
        `/cms/attendance/holiday/delete`,
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

export const listPlaceAttendance = createAsyncThunk(
  "attendance/listPlaceAttendance",
  async (token: any, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/cms/attendance/place`,{
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

export const updatePlaceAttendance = createAsyncThunk(
  "attendance/updatePlaceAttendance",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id, name, long, lat, distance } = payload;

      const response = await apiAxiosInstance.put(
        `/cms/attendance/place/edit`,
        { id, name, long, lat, distance },
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

export const createPlaceAttendance = createAsyncThunk(
  "attendance/createPlaceAttendance",
  async (payload: any, thunkAPI) => {
    try {
        const {token, name, long, lat, distance} = payload;
      const response = await apiAxiosInstance.post(
        "/cms/attendance/place/create",
        { name, long, lat, distance },
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

export const deletePlaceAttendance = createAsyncThunk(
  "attendance/deletePlaceAttendance",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id } = payload;
      const response = await apiAxiosInstance.delete(
        `/cms/attendance/place/delete`,
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