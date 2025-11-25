import { useSelector } from 'react-redux';

export const useContactData = () => {
  const contact = useSelector((state: any) => state.contact);

  return {
    // Data 
    contacts: contact.contacts.data,

    // Loading states
    isLoadingContacts: contact.contacts.loading,

    // Error states
    ErrorContacts: contact.contacts.error,

    // Status codes
    StatusContacts: contact.contacts.status,
  };
};
