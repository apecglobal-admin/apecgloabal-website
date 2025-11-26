import { useSelector } from 'react-redux';

export const useCompanyData = () => {
  const company = useSelector((state: any) => state.company);

  return {
    // Data 
    companies: company.companies.data,
    totalCompany: company?.totalCompany?.paginations?.total,
    industries: company.industries.data,

    // Loading states
    isLoadingCompanies: company.companies.loading,

    // Error states
    ErrorCompanies: company.companies.error,

    // Status codes
    StatusCompanies: company.companies.status,
  };
};
