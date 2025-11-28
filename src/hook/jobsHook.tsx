import { useSelector } from 'react-redux';

export const useJobsData = () => {
  const job = useSelector((state: any) => state.jobs);

  return {
    // Data 
    jobs: job.jobs.data,
    totalJobs: job?.totalJobs?.paginations?.total,
    jobStatus: job.jobStatus.data,
  
    // Loading states
    isLoadingJobs: job.jobs.loading,
   
    // Error states
    ErrorJobs: job.jobs.error,
   
    // Status codes
    StatusJobs: job.jobs.status,
  
  };
};