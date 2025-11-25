import { useSelector } from 'react-redux';

export const useAuthData = () => {
  const auth = useSelector((state: any) => state.auth);

  return {
    // Data 
    sidebars: auth.sidebars.data,

    // Loading states
    isLoadingSideBar: auth.sidebars.loading,

    // Error states
    ErrorSideBar: auth.sidebars.error,

    // Status codes
    StatusSideBar: auth.sidebars.status,
  };
};
