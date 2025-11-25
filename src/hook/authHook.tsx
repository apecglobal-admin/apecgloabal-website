import { useSelector } from 'react-redux';

export const useAuthData = () => {
  const auth = useSelector((state: any) => state.auth);

  return {
    // Data 
    sidebars: auth.sidebars.data,
    userInfo: auth.userInfo.data,

    // Loading states
    isLoadingSideBar: auth.sidebars.loading,
    isLoadingUserInfo: auth.userInfo.loading,

    // Error states
    ErrorSideBar: auth.sidebars.error,
    ErrorUserInfo: auth.userInfo.error,

    // Status codes
    StatusSideBar: auth.sidebars.status,
    StatusUserInfo: auth.userInfo.status,
  };
};
