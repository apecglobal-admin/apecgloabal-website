import { useSelector } from 'react-redux';

export const useApplicationData = () => {
  const application = useSelector((state: any) => state.application);

  return {
    // Data 
    applications: application.applications.data,
    totalApplication: application?.totalApplication?.paginations?.total,
    applicationStatus: application.applicationStatus.data,
  
    // Loading states
    isLoadingApplication: application.applications.loading,
   
    // Error states
    ErrorApplication: application.applications.error,
   
    // Status codes
    StatusApplication: application.applications.status,
  
  };
};