import { useSelector } from 'react-redux';

export const useAchievementData = () => {
  const achievement = useSelector((state: any) => state.achievement);

  return {
    // Data 
    achievements: achievement.achievements.data,
    totalAchievements: achievement.totalAchievements.data,
    achievementById: achievement.achievementById.data,
    listAchivementCategories: achievement.listAchivementCategories.data,
 

    // Loading states
    isLoadingAchievements: achievement.achievements.loading,
    
    // Error states
    ErrorAchievements: achievement.achievements.error,
    
    // Status codes
    StatusAchievements: achievement.achievements.status,
    
  };
};