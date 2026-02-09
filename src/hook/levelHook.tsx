import { useSelector } from 'react-redux';

export const useLevelData = () => {
  const level = useSelector((state: any) => state.level);

  return {
    // Data 
    levels: level.levels.data.data,
    totalLevels: level.totalLevels?.data?.paginations?.total,
    levelId: level.levelId.data,
    optionLevels: level.optionLevels.data,
  
    // Loading states
    isLoadingLevels: level.levels.loading,
   
    // Error states
    ErrorLevels: level.levels.error,
   
    // Status codes
    StatusLevels: level.levels.status,
  
  };
};