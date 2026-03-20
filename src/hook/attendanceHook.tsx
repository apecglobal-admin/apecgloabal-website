import { useSelector } from 'react-redux';

export const useAttendanceData = () => {
  const attendance = useSelector((state: any) => state.attendance);

  return {
    // Data 
    absenceTypes: attendance.absenceType.data,
    policyAttendance: attendance.policyAttendance.data,
    shiftWorkAttendance: attendance.shiftWorkAttendance.data,
    shiftWorkSaturdayAttendance: attendance.shiftWorkSaturdayAttendance.data,
    statusAbsence: attendance.statusAbsence.data,
    listTypeAbsences: attendance.listTypeAbsence.data,
    listEmployeeAbsence: attendance.listEmployeeAbsence.data.data,
    listEmployeeAbsenceById: attendance.listEmployeeAbsenceById.data,
    totalEmployeeAbsence: attendance.listEmployeeAbsence.data?.pagination?.total,
    senioritiesAttendance: attendance.senioritiesAttendance.data,
    holidayAttendance: attendance.holidayAttendance.data,
    placeAttendance: attendance.placeAttendance.data,
    timeSheet: attendance.timeSheet.data,
    settings: attendance.settings.data,
  

    // Loading states
    isLoadingAbsenceTypes: attendance.absenceType.loading,

    // Error states
    ErrorAbsenceTypes: attendance.absenceType.error,

    // Status codes
    StatusAbsenceTypes: attendance.absenceType.status,
  };
};
