import { useSelector } from "react-redux";

export const usePriorityData = () => {
  const priority = useSelector((state: any) => state.priority);

  return {
    // Data
    priorities: priority.priorities.data,
   
    // Loading states
    isLoadingPriority: priority.priorities.loading,

    // Error states
    ErrorPriority: priority.priorities.error,

    // Status codes
    StatusPriority: priority.priorities.status,
  };
};
