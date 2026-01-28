import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

export const listEmployee = createAsyncThunk(
  "employee/listEmployee",
  async (payload, thunkAPI) => {
    try {
      const { limit, page }: any = payload;
      const response = await apiAxiosInstance.get(`/employees?limit=${limit}&page=${page}`);
      return {
        data: response.data.data.employees,
        total: response.data.data.pagination.total,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);

export const listSkill = createAsyncThunk(
  "employee/listSkill",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/skills`);
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);

export const listContact = createAsyncThunk(
  "employee/listContact",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/contract-types`);
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);

export const listManager = createAsyncThunk(
  "employee/listManager",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/employees/managers`);
      return response.data.data;
    } catch (error: any) {   
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);

export const listEmployeeById = createAsyncThunk(
  "employee/listEmployeeById",
  async (id, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/employees?id=${id}`);
      return response.data.data.employees[0];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);

export const createEmployee = createAsyncThunk(
  "employee/createEmployee",
  async (payload: any, thunkAPI) => {
    try {
      const {
        email,
        name,
        phone,
        join_date,
        birthday,
        address,
        manager_id,
        gen,
        birth_place,
        citizen_card,
        issue_date,
        issue_place,
        emergency_contract,
        degree_level,
        major,
        school_name,
        graduation_year,
        base_salary,
        allowance,
        contract_type,
        certificate_name,
        skills,
        skill_group_id,
        department_id,
        position_id,
      }: any = payload;
      const response = await apiAxiosInstance.post(`/cms/employees/create`, {
        email,
        name,
        phone,
        join_date,
        birthday,
        address,
        manager_id,
        gen,
        birth_place,
        citizen_card,
        issue_date,
        issue_place,
        emergency_contract,
        degree_level,
        major,
        school_name,
        graduation_year,
        base_salary,
        allowance,
        contract_type,
        certificate_name,
        skills,
        skill_group_id,
        department_id,
        position_id,
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

export const updateEmployee = createAsyncThunk(
  "employee/updateEmployee",
  async (payload: any, thunkAPI) => {
    try {
      const {
        id,
        email,
        name,
        phone,
        join_date,
        birthday,
        address,
        manager_id,
        gen,
        birth_place,
        citizen_card,
        issue_date,
        issue_place,
        emergency_contract,
        degree_level,
        major,
        school_name,
        graduation_year,
        base_salary,
        allowance,
        contract_type,
        certificate_name,
        skills,
        skill_group_id,
        department_id,
        position_id,
      }: any = payload;
      const response = await apiAxiosInstance.put(
        `/cms/employees/update?id=${id}`,
        {
          id,
          email,
          name,
          phone,
          join_date,
          birthday,
          address,
          manager_id,
          gen,
          birth_place,
          citizen_card,
          issue_date,
          issue_place,
          emergency_contract,
          degree_level,
          major,
          school_name,
          graduation_year,
          base_salary,
          allowance,
          contract_type,
          certificate_name,
          skills,
          skill_group_id,
          department_id,
          position_id,
        },
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
  },
);

export const updateSkills = createAsyncThunk(
  "employee/updateSkills",
  async (payload: any, thunkAPI) => {
    try {
      const { id, mainGroupId, skills }: any = payload;
      const response = await apiAxiosInstance.put(
        `/cms/skills/update/?id=${id}`,
        {
          id,
          mainGroupId,
          skills,
        },
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
  },
);

export const updateStatusCareer = createAsyncThunk(
  "employee/updateStatusCareer",
  async (payload: any, thunkAPI) => {
    try {
      const { id, status }: any = payload;
      const response = await apiAxiosInstance.put(
        `/cms/personal-requests/change?id=${id}&status=${status}`,
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
  },
);

export const listEmployeeStatus = createAsyncThunk(
  "employee/listEmployeeStatus",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/employees/status`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);

export const updateStatusEmployee = createAsyncThunk(
  "employee/updateStatusEmployee",
  async (payload: any, thunkAPI) => {
    try {
      const { id, status }: any = payload;
      const response = await apiAxiosInstance.put(
        `/cms/employees/status?id=${id}&status=${status}`,
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
  },
);

export const exportExcel = createAsyncThunk(
  "employee/exportExcel",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        "/cms/employees/template/export",
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "employees.xlsx";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error: any) {
      toast.error(error?.response?.data?.message, {
        position: "top-right",
      });
      return thunkAPI.rejectWithValue(error?.message);
    }
  }
);

export const importExcel = createAsyncThunk(
  "employee/importExcel",
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.post(
        "/cms/employees/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data; 
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Import thất bại");
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);