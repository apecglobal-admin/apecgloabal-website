import { useSelector } from 'react-redux';

export const useStatisticsData = () => {
  const statistic = useSelector((state: any) => state.statistic);

  return {
    // Data 
    statistics: statistic.statistics.data,

  
    // Loading states
    isLoadingImages: statistic.statistics.loading,
   
    // Error states
    ErrorImages: statistic.statistics.error,
   
    // Status codes
    StatusImages: statistic.statistics.status,
  
  };
};