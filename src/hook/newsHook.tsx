import { useSelector } from 'react-redux';

export const useNewsData = () => {
  const news = useSelector((state: any) => state.news);

  return {
    // Data 
    news: news.news.data,
    totalNews: news?.totalNews?.paginations?.total,
    newsTypes: news.newsTypes.data,
  
    // Loading states
    isLoadingImages: news.news.loading,
   
    // Error states
    ErrorImages: news.news.error,
   
    // Status codes
    StatusImages: news.news.status,
  
  };
};