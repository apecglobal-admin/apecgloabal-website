import { useSelector } from 'react-redux';

export const useNotificationData = () => {
  const notification = useSelector((state: any) => state.notification);

  return {
    // Data 
    notifications: notification.notifications.data,
    totalNotification: notification?.totalNotification?.paginations?.total,
    notificationTypes: notification.notificationTypes.data,
  
    // Loading states
    isLoadingNotification: notification.notifications.loading,
   
    // Error states
    ErrorNotification: notification.notifications.error,
   
    // Status codes
    StatusNotification: notification.notifications.status,
  
  };
};