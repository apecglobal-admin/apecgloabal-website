import { useSelector } from 'react-redux';

export const usePayrollData = () => {
  const payroll = useSelector((state: any) => state.payroll);

  return {
    // Data 
    contracts: payroll.contracts.data,
    allowances: payroll.allowances.data,
    bonus: payroll.bonus.data,
    deductions: payroll.deductions.data,
    insurances: payroll.insurances.data,

    // Loading states
    isLoadingListContractPayroll: payroll.contracts.loading,

    // Error states
    ErrorListContractPayroll: payroll.contracts.error,

    // Status codes
    StatusListContractPayroll: payroll.contracts.status,
  };
};
