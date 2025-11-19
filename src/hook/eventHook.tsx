import { useSelector } from 'react-redux';

export const useEventData = () => {
  const event = useSelector((state: any) => state.event);

  console.log("event", event.events.data)
  return {
    // Data 
    events: event.events.data,
    totalEvent:  event?.totalEvents?.paginations?.total,
   
 

    // Loading states
    isLoadingevents: event.events.loading,
    isLoadingTotal: event.totalEvents.loading,
   
    // Error states
    Errorevents: event.events.error,
   ErrorTotal: event.totalEvents.error,

    // Status codes
    Statusevents: event.events.status,
    StatusTotal: event.totalEvents.status
  
  };
};