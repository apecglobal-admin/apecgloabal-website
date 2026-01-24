import { useSelector } from 'react-redux';

export const useEmployeeData = () => {
  const employee = useSelector((state: any) => state.employee);

  return {
    // Data 
    employees: employee.employees.data,
    totalEmployees: employee.totalEmployees.total,
    skills: employee.skills.data,
    contacts: employee.contacts.data,
    managers: employee.managers.data,
    employeeById: employee.employeeById.data,
    statuses: employee.statuses.data,
    tasks: employee.tasks.data,
    totalTasks: employee.totalTasks.data,
    taskById: employee.taskById.data,

 

    // Loading states
    isLoadingEmployees: employee.employees.loading,
    isLoadingSkills: employee.skills.loading,
    isLoadingContacts: employee.contacts.loading,
    isLoadingManagers: employee.managers.loading,
    isLoadingEmployeeById: employee.employeeById.loading,

    // Error states
    ErrorEmployees: employee.employees.error,
    ErrorSkills: employee.skills.error,
    ErrorContacts: employee.contacts.error,
    ErrorManagers: employee.managers.error,
    ErrorEmployeeById: employee.employeeById.error,

    // Status codes
    StatusEmployees: employee.employees.status,
    StatusSkills: employee.skills.status,
    StatusContacts: employee.contacts.status,
    StatusManagers: employee.managers.status,
    StatusEmployeeById: employee.employeeById.status,
  };
};