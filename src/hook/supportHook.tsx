import { useSelector } from 'react-redux';

export const useSupportData = () => {
  const support = useSelector((state: any) => state.support);

  return {
    // Data 
    supports: support.supports.data,
    totalSupport: support?.totalSupport?.paginations?.total,
    supportTypes: support.supportTypes.data,
  
    // Loading states
    isLoadingSupports: support.supports.loading,
   
    // Error states
    ErrorSupports: support.supports.error,
   

    // Status codes
    StatusSupports: support.supports.status,
  
  };
};