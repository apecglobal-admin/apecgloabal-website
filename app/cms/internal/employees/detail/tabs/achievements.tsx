"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp } from "lucide-react";

interface EmployeeAchievementsProps {
  employee: any;
}

const EmployeeAchievements: React.FC<EmployeeAchievementsProps> = ({ employee }) => {
  return (
    <div className="space-y-3 sm:space-y-4 mt-0">
      {/* --- Thành tích & Giải thưởng --- */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-lg">
            <Award className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
            Thành tích & Giải thưởng
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
            {employee.achievements?.length > 0 ? (
              employee.achievements.map((achievement: any) => (
                <div
                  key={achievement.id}
                  className="bg-black/30 p-3 sm:p-4 rounded-lg border border-yellow-500/20"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Award className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold text-xs sm:text-base truncate">
                        {achievement.title}
                      </h4>
                      <p className="text-white/60 text-[10px] sm:text-sm truncate">
                        {achievement.achievement_category?.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/60 text-center py-4 col-span-2 text-xs sm:text-base">
                Chưa có thành tích nào
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* --- Career Path --- */}
      {employee.careers && employee.careers.length > 0 && (
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
              Tiến độ Career Path
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
            {employee.careers.map((career: any) => (
              <div key={career.career_level_id} className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-white font-semibold text-xs sm:text-base">
                      {career.career_level}
                    </h4>
                    <p className="text-white/60 text-[10px] sm:text-sm">
                      Level Order: {career.level_order}
                    </p>
                  </div>
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 text-[10px] sm:text-xs">
                    {career.progress.percent}%
                  </Badge>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] sm:text-sm text-white/60 mb-1">
                    <span>
                      Hoàn thành: {career.progress.completed}/{career.progress.total}
                    </span>
                  </div>
                  <div className="w-full bg-black/50 rounded-full h-1.5 sm:h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-1.5 sm:h-2 rounded-full transition-all"
                      style={{ width: `${career.progress.percent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmployeeAchievements;
