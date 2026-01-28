import { useSelector } from 'react-redux';

export const useTaskData = () => {
  const task = useSelector((state: any) => state.task);

  return {
    // Data 

    tasks: task.tasks.data,
    totalTasks: task.totalTasks.data,
    taskById: task.taskById.data,

 

    // Loading states
    isLoadingTasks: task.tasks.loading,
   

    // Error states
    ErrorTasks: task.tasks.error,
 
    // Status codes
    StatusTasks: task.tasks.status,

  };
};