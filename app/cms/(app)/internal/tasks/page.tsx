"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useEmployeeData } from "@/src/hook/employeeHook";
import { Pagination } from "@/components/ui/pagination";
import { 
  Calendar, 
  User, 
  FolderKanban, 
  ChevronRight,
  CheckCircle2,
  Circle,
  XCircle,
  Clock,
  ArrowLeft
} from "lucide-react";
import { listTasks, listTasksById } from "@/src/features/task/taskApi";
import { useTaskData } from "@/src/hook/taskHook";

const TasksPage: React.FC = () => {
  const dispatch = useDispatch();
  const { tasks, totalTasks, taskById } = useTaskData();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Extract tasks data array
  const tasksData = tasks?.data || [];
  const pagination = tasks?.pagination || null;

  useEffect(() => {
    dispatch(listTasks({limit: itemsPerPage, page: currentPage} as any) as any);
  }, [currentPage, dispatch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedTaskId(null);
  };

  const handleViewTaskDetail = (taskId: string) => {
    setSelectedTaskId(taskId);
    dispatch(listTasksById(taskId as any) as any);
  };

  const handleBackToList = () => {
    setSelectedTaskId(null);
  };

  const getStatusColor = (statusName: string) => {
    const statusMap: { [key: string]: string } = {
      "Lập kế hoạch": "bg-blue-600/20 text-blue-400 border-blue-500/30",
      "Đang thực hiện": "bg-yellow-600/20 text-yellow-400 border-yellow-500/30",
      "Hoàn thành": "bg-green-600/20 text-green-400 border-green-500/30",
      "Tạm dừng": "bg-orange-600/20 text-orange-400 border-orange-500/30",
      "Hủy": "bg-red-600/20 text-red-400 border-red-500/30",
    };
    return statusMap[statusName] || "bg-gray-600/20 text-gray-400 border-gray-500/30";
  };

  const getPriorityColor = (priorityName: string) => {
    const priorityMap: { [key: string]: string } = {
      "Cao": "bg-red-600/20 text-red-400 border-red-500/30",
      "Trung bình": "bg-yellow-600/20 text-yellow-400 border-yellow-500/30",
      "Thấp": "bg-green-600/20 text-green-400 border-green-500/30",
    };
    return priorityMap[priorityName] || "bg-gray-600/20 text-gray-400 border-gray-500/30";
  };

  const getSubtaskStatusIcon = (statusName: string) => {
    switch (statusName) {
      case "Hoàn thành":
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "Hủy":
        return <XCircle className="w-4 h-4 text-red-400" />;
      case "Đang thực hiện":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  if (selectedTaskId && taskById) {
    return (
      <div className="min-h-screen p-3 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <Button
            onClick={handleBackToList}
            variant="ghost"
            className="mb-3 sm:mb-6 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>

          <Card className="bg-black/50 border-purple-500/30 text-white">
            <CardHeader className="p-3 sm:p-6">
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="space-y-2 flex-1">
                  <CardTitle className="text-lg sm:text-2xl">
                    {taskById?.name ?? ""}
                  </CardTitle>

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      className={`${getStatusColor(taskById?.status?.name)} border text-xs sm:text-sm`}
                    >
                      {taskById?.status?.name ?? ""}
                    </Badge>

                    {taskById?.priority && (
                      <Badge
                        className={`${getPriorityColor(
                          taskById?.priority?.name
                        )} border text-xs sm:text-sm`}
                      >
                        Ưu tiên: {taskById?.priority?.name}
                      </Badge>
                    )}

                    {taskById?.type && (
                      <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30 border text-xs sm:text-sm">
                        {taskById?.type?.name}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-400">
                    {taskById?.process
                      ? parseFloat(taskById?.process).toFixed(0)
                      : 0}
                    %
                  </div>
                  <div className="text-xs sm:text-sm text-white/60">Tiến độ</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6 pt-0 sm:pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-black/30 rounded-lg p-3 sm:p-4 border border-purple-500/20">
                  <div className="flex items-center gap-2 text-white/60 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">Thời gian</span>
                  </div>
                  <div className="text-white text-xs sm:text-base">
                    {formatDate(taskById?.date_start)} -{" "}
                    {formatDate(taskById?.date_end)}
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-3 sm:p-4 border border-purple-500/20">
                  <div className="flex items-center gap-2 text-white/60 mb-2">
                    <FolderKanban className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">Dự án</span>
                  </div>
                  <div className="text-white text-xs sm:text-base">
                    {taskById?.project?.name ?? ""}
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-3 sm:p-4 border border-purple-500/20">
                  <div className="flex items-center gap-2 text-white/60 mb-2">
                    <User className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">Người giao việc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      src={taskById?.assignee?.avatar}
                      alt={taskById?.assignee?.name}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                    />
                    <span className="text-white text-xs sm:text-base">
                      {taskById?.assignee?.name ?? ""}
                    </span>
                  </div>
                </div>

                {taskById?.kpi_item && (
                  <div className="bg-black/30 rounded-lg p-3 sm:p-4 border border-purple-500/20">
                    <div className="flex items-center gap-2 text-white/60 mb-2">
                      <span className="text-xs sm:text-sm">KPI</span>
                    </div>
                    <div className="text-white text-xs sm:text-base">
                      {taskById?.kpi_item?.name}
                    </div>
                  </div>
                )}
              </div>

              {taskById?.employee_assignments?.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-white">
                    Phân công thực hiện
                  </h3>

                  {taskById?.employee_assignments?.map(
                    (assignment: any) => (
                      <div
                        key={assignment?.id}
                        className="bg-black/30 rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4 border border-purple-500/20"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={assignment?.employee?.avatar}
                              alt={assignment?.employee?.name}
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                            />
                            <div>
                              <div className="text-white font-medium text-xs sm:text-base">
                                {assignment?.employee?.name}
                              </div>
                              <Badge
                                className={`${getStatusColor(
                                  assignment?.status?.name
                                )} border text-[10px] sm:text-xs`}
                              >
                                {assignment?.status?.name}
                              </Badge>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xl sm:text-2xl font-bold text-blue-400">
                              {assignment?.process ?? 0}%
                            </div>
                            <div className="text-[10px] sm:text-xs text-white/60">
                              Tiến độ cá nhân
                            </div>
                          </div>
                        </div>

                        {assignment?.subtasks?.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-xs sm:text-sm font-semibold text-white/80">
                              Công việc con (
                              {assignment?.subtasks?.length})
                            </h4>

                            <div className="space-y-2">
                              {assignment?.subtasks?.map(
                                (subtask: any) => (
                                  <div
                                    key={subtask?.id}
                                    className="flex items-center justify-between bg-black/20 rounded p-2 sm:p-3 hover:bg-black/30 transition-colors border border-purple-500/10"
                                  >
                                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                      {getSubtaskStatusIcon(
                                        subtask?.status?.name
                                      )}
                                      <span className="text-white text-xs sm:text-base truncate">
                                        {subtask?.name}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
                                      <Badge
                                        className={`${getStatusColor(
                                          subtask?.status?.name
                                        )} border text-[10px] sm:text-xs`}
                                      >
                                        {subtask?.status?.name}
                                      </Badge>
                                      <span className="text-xs sm:text-sm text-blue-400 font-medium">
                                        {subtask?.process ?? 0}%
                                      </span>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl sm:text-3xl font-bold text-white">Danh sách công việc</h1>
          <div className="text-white/60 text-xs sm:text-base">
            Tổng số: <span className="text-white font-semibold">{pagination?.total || 0}</span> công việc
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {tasksData && tasksData.length > 0 ? (
            tasksData.map((task: any) => (
              <Card
                key={task.id}
                className="bg-black/50 border-purple-500/30 hover:bg-black/40 transition-all cursor-pointer group"
                onClick={() => handleViewTaskDetail(task.id)}
              >
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base sm:text-xl font-semibold text-white group-hover:text-blue-400 transition-colors flex-1">
                          {task.name}
                        </h3>
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge className={`${getStatusColor(task.status.name)} border text-[10px] sm:text-xs`}>
                          {task.status.name}
                        </Badge>
                        <div className="flex items-center gap-2 bg-black/30 rounded-full px-2 sm:px-3 py-1 border border-purple-500/20">
                          <FolderKanban className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
                          <span className="text-[10px] sm:text-sm text-white/80">{task.project.name}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-sm text-white/60">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{formatDate(task.date_start)} - {formatDate(task.date_end)}</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <img
                            src={task.assignee.avatar}
                            alt={task.assignee.name}
                            className="w-4 h-4 sm:w-6 sm:h-6 rounded-full"
                          />
                          <span>{task.assignee.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-2xl sm:text-3xl font-bold text-blue-400">
                        {parseFloat(task.process).toFixed(0)}%
                      </div>
                      <div className="text-[10px] sm:text-sm text-white/60">Tiến độ</div>
                      <div className="mt-1 sm:mt-2 w-16 sm:w-24 h-1.5 sm:h-2 bg-black/30 rounded-full overflow-hidden border border-purple-500/20">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                          style={{ width: `${parseFloat(task.process)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-black/50 border-purple-500/30">
              <CardContent className="p-8 sm:p-12 text-center">
                <p className="text-white/60 text-sm sm:text-lg">Không có công việc nào</p>
              </CardContent>
            </Card>
          )}
        </div>

        {pagination && pagination.total > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.total_pages}
            totalItems={pagination.total}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>
    </div>
  );
};

export default TasksPage;