import { useSelector } from 'react-redux';

export const useImageData = () => {
  const image = useSelector((state: any) => state.image);

  return {
    // Data 
    images: image.images.data,
    totalImage: image?.totalImage?.paginations?.total,
    imageTypes: image.imageTypes.data,
    pageImages: image.pageImages.data,
  
    // Loading states
    isLoadingPolicy: image.images.loading,
   
    // Error states
    ErrorPolicy: image.images.error,
   
    // Status codes
    StatusPolicy: image.images.status,
  
  };
};