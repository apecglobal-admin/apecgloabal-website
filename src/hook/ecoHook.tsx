import { useSelector } from 'react-redux';

export const useEcoSystemData = () => {
  const ecoSystem = useSelector((state: any) => state.ecosystem);

  return {
    // Data 
    listEcoSystem: ecoSystem.eco.data,

    // Loading states
    isLoadingEcoSystems: ecoSystem.eco.loading,

    // Error states
    ErrorEcoSystems: ecoSystem.eco.error,

    // Status codes
    StatusEcoSystems: ecoSystem.eco.status,
  };
};
