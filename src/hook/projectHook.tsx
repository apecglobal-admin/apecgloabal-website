import { useSelector } from 'react-redux';

export const useProjectData = () => {
  const projectState = useSelector((state: any) => state.project);

  return {
    // Data
    projects: projectState.projects.data,
    project: projectState.project.data,
    statusProject: projectState.statusProject.data,

    // Loading states
    isLoadingProjects: projectState.projects.loading,
    isLoadingProject: projectState.project.loading,
    isLoadingStatusProject: projectState.statusProject.loading,

    // Error states
    errorProjects: projectState.projects.error,
    errorProject: projectState.project.error,
    errorStatusProject: projectState.statusProject.error,

    // Status codes
    statusCodeProjects: projectState.projects.status,
    statusCodeProject: projectState.project.status,
    statusCodeStatusProject: projectState.statusProject.status,
  };
};
