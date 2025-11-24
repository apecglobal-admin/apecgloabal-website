import { useSelector } from "react-redux";

export const useRoleData = () => {
  const role = useSelector((state: any) => state.role);

  return {
    // Data
    roleById: role.roleById.data,
    users: role.users.data,

    // Loading states
    isLoadingRole: role.roleById.loading,

    // Error states
    ErrorRole: role.roleById.error,

    // Status codes
    StatusRole: role.roleById.status,
  };
};
