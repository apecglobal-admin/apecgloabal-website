import { useSelector } from 'react-redux';

export const usePolicyData = () => {
  const policy = useSelector((state: any) => state.policy);

  return {
    // Data 
    policies: policy.policies.data,
    totalPolicy: policy?.totalPolicy?.paginations?.total,
    policyTypes: policy.policyTypes.data,
  
    // Loading states
    isLoadingPolicy: policy.policies.loading,
   
    // Error states
    ErrorPolicy: policy.policies.error,
   
    // Status codes
    StatusPolicy: policy.policies.status,
  
  };
};