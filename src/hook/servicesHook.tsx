import { useSelector } from 'react-redux';

export const useServicesData = () => {
  const service = useSelector((state: any) => state.services);

  return {
    // Data 
    services: service.services.data,
    servicesTypes: service.servicesTypes.data,
  
    // Loading states
    isLoadingServices: service.services.loading,
   
    // Error states
    ErrorServices: service.services.error,
   
    // Status codes
    StatusServices: service.services.status,
  
  };
};