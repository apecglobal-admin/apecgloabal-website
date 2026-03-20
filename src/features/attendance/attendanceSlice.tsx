import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer } from "@/src/ulti/createAsyncReducerHelper";
import { listAbsences, listEmployeeAbsences, listEmployeeAbsencesById, listHolidayAttendance, listPlaceAttendance, listPolicyAttendance, listSenioritiesAttendance, listSettingAttdence, listShiftWorkAttendance, listShiftWorkSaturdayAttendance, listStatusAbsence, listTimeSheet, listTypeAbsence } from "./attendanceApi";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface AttendanceState {
  absenceType: InitState<any[]>;
  policyAttendance: InitState<any[]>;
  shiftWorkAttendance: InitState<any[]>;
  shiftWorkSaturdayAttendance: InitState<any[]>;
  statusAbsence: InitState<any[]>;
  listTypeAbsence: InitState<any[]>;
  listEmployeeAbsence: InitState<any[]>;
  listEmployeeAbsenceById: InitState<any[]>;
  totalEmployeeAbsence: InitState<any[]>;
  senioritiesAttendance: InitState<any[]>;
  holidayAttendance: InitState<any[]>;
  placeAttendance: InitState<any[]>;
  timeSheet: InitState<any[]>;
  settings: InitState<any[]>;

}

const initialState: AttendanceState = {
  absenceType: { data: [], loading: false, error: null, status: null },
  policyAttendance: { data: [], loading: false, error: null, status: null },
  shiftWorkAttendance: { data: [], loading: false, error: null, status: null },
  shiftWorkSaturdayAttendance: { data: [], loading: false, error: null, status: null },
  statusAbsence: { data: [], loading: false, error: null, status: null },
  listTypeAbsence: { data: [], loading: false, error: null, status: null },
  listEmployeeAbsence: { data: [], loading: false, error: null, status: null },
  listEmployeeAbsenceById: { data: [], loading: false, error: null, status: null },
  totalEmployeeAbsence: { data: [], loading: false, error: null, status: null },
  senioritiesAttendance: { data: [], loading: false, error: null, status: null },
  holidayAttendance: { data: [], loading: false, error: null, status: null },
  placeAttendance: { data: [], loading: false, error: null, status: null },
  timeSheet: { data: [], loading: false, error: null, status: null },
  settings: { data: [], loading: false, error: null, status: null },

};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {},
  extraReducers(builder) {
    createAsyncReducer(builder, listAbsences, "absenceType");
    createAsyncReducer(builder, listPolicyAttendance, "policyAttendance");
    createAsyncReducer(builder, listShiftWorkAttendance, "shiftWorkAttendance");
    createAsyncReducer(builder, listShiftWorkSaturdayAttendance, "shiftWorkSaturdayAttendance");    
    createAsyncReducer(builder, listStatusAbsence, "statusAbsence");
    createAsyncReducer(builder, listTypeAbsence, "listTypeAbsence");
    createAsyncReducer(builder, listEmployeeAbsences, ["listEmployeeAbsence", "totalEmployeeAbsence"]);
    createAsyncReducer(builder, listEmployeeAbsencesById, "listEmployeeAbsenceById");
    createAsyncReducer(builder, listSenioritiesAttendance, "senioritiesAttendance");
    createAsyncReducer(builder, listHolidayAttendance, "holidayAttendance");
    createAsyncReducer(builder, listPlaceAttendance, "placeAttendance");
    createAsyncReducer(builder, listTimeSheet, "timeSheet");
    createAsyncReducer(builder, listSettingAttdence, "settings");

  },
});

export default attendanceSlice.reducer;
