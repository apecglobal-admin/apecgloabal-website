"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EmployeeProjectsProps {
  employee: any;
  performanceData: { month: string; scores: number }[];
  projectStatusData: { status: string; value: number }[];
}

const EmployeeProjects: React.FC<EmployeeProjectsProps> = ({
  employee,
  performanceData,
  projectStatusData,
}) => {

  console.log("abc", employee.projects.project_list)
  return (
    <div className="space-y-3 sm:space-y-4 mt-0 overflow-x-hidden">
      {/* --- Biểu đồ hiệu suất và trạng thái dự án --- */}
      <div className="flex flex-col lg:flex-row w-full gap-3 sm:gap-4 overflow-x-hidden">
        {/* --- Hiệu suất 6 tháng --- */}
        <Card className="bg-black/50 border-purple-500/30 w-full lg:w-1/2 overflow-x-hidden">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-white text-sm sm:text-lg">
              Hiệu suất 6 tháng gần nhất
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0 overflow-x-hidden">
            {performanceData.length > 0 ? (
              <div className="w-full overflow-x-hidden">
                <ResponsiveContainer width="100%" height={250} className="sm:h-[350px]">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#a855f7" strokeOpacity={0.2} />
                    <XAxis dataKey="month" stroke="#fff" tick={{ fill: "#fff", fontSize: 10 }} />
                    <YAxis stroke="#fff" tick={{ fill: "#fff", fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#000",
                        border: "1px solid #a855f7",
                        fontSize: "11px",
                      }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend wrapperStyle={{ color: "#fff", fontSize: "11px" }} />
                    <Line
                      type="monotone"
                      dataKey="scores"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ fill: "#8b5cf6", r: 3 }}
                      activeDot={{ r: 5 }}
                      name="Điểm hiệu suất"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-white/60 text-center py-8 text-xs sm:text-base">
                Chưa có dữ liệu hiệu suất
              </p>
            )}
          </CardContent>
        </Card>

        {/* --- Biểu đồ trạng thái dự án --- */}
        <Card className="bg-black/50 border-purple-500/30 w-full lg:w-1/2">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-white text-sm sm:text-lg">
              Biểu đồ trạng thái dự án
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
            {projectStatusData.length > 0 && projectStatusData.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={250} className="sm:h-[350px]">
                <RadarChart data={projectStatusData}>
                  <PolarGrid stroke="#3b82f6" strokeOpacity={0.3} />
                  <PolarAngleAxis
                    dataKey="status"
                    tick={{ fill: "#fff", fontSize: 10 }}
                    tickLine={{ stroke: "#3b82f6" }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[
                      0,
                      Math.max(...projectStatusData.map((d) => d.value)) + 2,
                    ]}
                    tick={{ fill: "#fff", fontSize: 10 }}
                    tickLine={{ stroke: "#3b82f6" }}
                  />
                  <Radar
                    name="Số dự án"
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#000",
                      border: "1px solid #3b82f6",
                      fontSize: "11px",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend wrapperStyle={{ color: "#fff", fontSize: "11px" }} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-white/60 text-center py-8 text-xs sm:text-base">
                Chưa có dữ liệu dự án
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* --- Danh sách dự án --- */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-white text-sm sm:text-lg">Danh sách dự án</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <div className="space-y-2 sm:space-y-3">
            {employee.projects?.project_list?.length > 0 ? (
              employee.projects.project_list.map((project: any) => (
                <div
                  key={project.id}
                  className="bg-black/30 p-3 sm:p-4 rounded-lg border border-purple-500/20"
                >
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h4 className="text-white font-semibold text-xs sm:text-base flex-1">
                      {project.name}
                    </h4>
                    <Badge
                      className={
                        project.project_status_id === 2
                          ? "bg-blue-600/20 text-blue-400 border-blue-500/30 text-[10px] sm:text-xs shrink-0"
                          : project.project_status_id === 3
                          ? "bg-yellow-600/20 text-yellow-400 border-yellow-500/30 text-[10px] sm:text-xs shrink-0"
                          : "bg-green-600/20 text-green-400 border-green-500/30 text-[10px] sm:text-xs shrink-0"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-white/60 text-xs sm:text-sm mb-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-4 text-[10px] sm:text-xs text-white/50">
                    <span>Team: {project.team_size} người</span>
                    <span>Tiến độ: {project.progress}%</span>
                    {project.role && <span>Vai trò: {project.role}</span>}
                  </div>
                  {project.budget > 0 && (
                    <div className="text-[10px] sm:text-xs text-white/50 mt-1">
                      Ngân sách:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(project.budget)}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-white/60 text-center py-4 text-xs sm:text-base">
                Chưa tham gia dự án nào
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeProjects;
