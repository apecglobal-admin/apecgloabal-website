import { useSelector } from 'react-redux';

export const useDepartmentData = () => {
  const department = useSelector((state: any) => state.department);

  return {
    // Data 
    departments: department.departments.data,

    // Loading states
    isLoadingDepartments: department.departments.loading,
   
    // Error states
    ErrorDepartments: department.departments.error,
   

    // Status codes
    StatusDepartments: department.departments.status,
  
  };
};