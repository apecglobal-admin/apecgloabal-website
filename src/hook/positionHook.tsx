import { useSelector } from 'react-redux';

export const usePositionData = () => {
  const position = useSelector((state: any) => state.position);

  return {
    // Data 
    positions: position.positions.data,
   
 

    // Loading states
    isLoadingPositions: position.positions.loading,
   
    // Error states
    ErrorPositions: position.positions.error,
   

    // Status codes
    StatusPositions: position.positions.status,
  
  };
};