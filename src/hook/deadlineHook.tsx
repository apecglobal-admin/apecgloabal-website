import { useSelector } from "react-redux";

export const useDeadlineData = () => {
  const deadline = useSelector((state: any) => state.deadline);

  return {
    // Data
    deadlines: deadline.deadlines.data,

    // Loading states
    isLoadingDeadline: deadline.deadlines.loading,

    // Error states
    ErrorDeadline: deadline.deadlines.error,

    // Status codes
    StatusDeadline: deadline.deadlines.status,
  };
};
