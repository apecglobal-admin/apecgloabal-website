import { useSelector } from 'react-redux';

export const usePolicyData = () => {
  const policy = useSelector((state: any) => state.policy);

  return {
    // Data 
    policies: policy.policies.data,
    totalPolicy: policy?.totalPolicy?.paginations?.total,
    policyTypes: policy.policyTypes.data,
  
    // Loading states
    isLoadingPositions: policy.policies.loading,
   
    // Error states
    ErrorPositions: policy.policies.error,
   
    // Status codes
    StatusPositions: policy.policies.status,
  
  };
};