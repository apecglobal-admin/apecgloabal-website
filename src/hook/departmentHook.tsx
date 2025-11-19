import { useSelector } from "react-redux";

export const useDepartmentData = () => {
  const department = useSelector((state: any) => state.department);

  return {
    // Data
    departments: department.departments.data,
    totalDepartment: department?.totalDepartments?.paginations?.total,

    // Loading states
    isLoadingDepartments: department.departments.loading,
    isLoadingTotal: department.totalDepartments.loading,

    // Error states
    ErrorDepartments: department.departments.error,
    ErrorTotal: department.totalDepartments.error,

    // Status codes
    StatusDepartments: department.departments.status,
    StatusTotal: department.totalDepartments.status,
  };
};
