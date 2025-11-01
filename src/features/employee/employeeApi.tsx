import apiAxiosInstance from "@/src/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const listEmployee = createAsyncThunk(
  "employee/listEmployee",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/employees`);
      return response.data.data.employees;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
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
  }
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
  }
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
  }
);

export const listEmployeeById = createAsyncThunk(
  "employee/listEmployeeById",
  async (id, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/employees/profile/${id}`);
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const createOrUpdateEmployee = createAsyncThunk(
  "employee/createOrUpdateEmployee",
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
      const response = await apiAxiosInstance.put(`/cms/employees/info`, {
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
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);
