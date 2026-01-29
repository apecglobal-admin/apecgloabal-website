"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ArrowLeft,
  LayoutGrid,
  List,
  Search,
  Filter,
  X,
} from "lucide-react";
import { listTasks, listTasksById } from "@/src/features/task/taskApi";
import { useTaskData } from "@/src/hook/taskHook";

const TasksPage: React.FC = () => {
  const dispatch = useDispatch();
  const { tasks, totalTasks, taskById } = useTaskData();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 9;

  // Extract tasks data array
  const tasksData = tasks?.data || [];
  const pagination = tasks?.pagination || null;

  // Get unique statuses and priorities from tasks
  const statuses = Array.from(
    new Set(tasksData.map((task: any) => task.status.name)),
  );
  const priorities = Array.from(
    new Set(tasksData.map((task: any) => task.priority?.name).filter(Boolean)),
  );

  useEffect(() => {
    dispatch(
      listTasks({ limit: itemsPerPage, page: currentPage } as any) as any,
    );
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

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasksData.filter((task: any) => {
    const matchesSearch =
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || task.status.name === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority?.name === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (statusName: string) => {
    const statusMap: { [key: string]: string } = {
      "Lập kế hoạch": "bg-blue-600/20 text-blue-400 border-blue-500/30",
      "Đang thực hiện": "bg-yellow-600/20 text-yellow-400 border-yellow-500/30",
      "Hoàn thành": "bg-green-600/20 text-green-400 border-green-500/30",
      "Tạm dừng": "bg-orange-600/20 text-orange-400 border-orange-500/30",
      Hủy: "bg-red-600/20 text-red-400 border-red-500/30",
    };
    return (
      statusMap[statusName] || "bg-gray-600/20 text-gray-400 border-gray-500/30"
    );
  };

  const getPriorityColor = (priorityName: string) => {
    const priorityMap: { [key: string]: string } = {
      Cao: "bg-red-600/20 text-red-400 border-red-500/30",
      "Trung bình": "bg-yellow-600/20 text-yellow-400 border-yellow-500/30",
      Thấp: "bg-green-600/20 text-green-400 border-green-500/30",
    };
    return (
      priorityMap[priorityName] ||
      "bg-gray-600/20 text-gray-400 border-gray-500/30"
    );
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
                          taskById?.priority?.name,
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
                  <div className="text-xs sm:text-sm text-white/60">
                    Tiến độ
                  </div>
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

                  {taskById?.employee_assignments?.map((assignment: any) => (
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
                                assignment?.status?.name,
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
                            Công việc con ({assignment?.subtasks?.length})
                          </h4>

                          <div className="space-y-2">
                            {assignment?.subtasks?.map((subtask: any) => (
                              <div
                                key={subtask?.id}
                                className="flex items-center justify-between bg-black/20 rounded p-2 sm:p-3 hover:bg-black/30 transition-colors border border-purple-500/10"
                              >
                                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                  {getSubtaskStatusIcon(subtask?.status?.name)}
                                  <span className="text-white text-xs sm:text-base truncate">
                                    {subtask?.name}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
                                  <Badge
                                    className={`${getStatusColor(
                                      subtask?.status?.name,
                                    )} border text-[10px] sm:text-xs`}
                                  >
                                    {subtask?.status?.name}
                                  </Badge>
                                  <span className="text-xs sm:text-sm text-blue-400 font-medium">
                                    {subtask?.process ?? 0}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-3xl font-bold text-white">
              Danh sách công việc
            </h1>
            <div className="text-white/60 text-xs sm:text-base">
              Tổng số:{" "}
              <span className="text-white font-semibold">
                {pagination?.total || 0}
              </span>{" "}
              công việc
            </div>
          </div>

          {/* View Toggle Buttons */}
          <div className="flex items-center gap-2 bg-black/50 rounded-lg p-1 border border-purple-500/30">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("grid")}
              className={`${
                viewMode === "grid"
                  ? "bg-purple-600/30 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              } transition-all`}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Grid
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("list")}
              className={`${
                viewMode === "list"
                  ? "bg-purple-600/30 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              } transition-all`}
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-3 sm:p-4">
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm theo tên công việc, dự án, người giao việc..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-white/40 focus:border-purple-500/50"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`${
                    showFilters
                      ? "bg-purple-600/30 border-purple-500/50 text-white"
                      : "bg-black/30 border-purple-500/30 text-white/60"
                  } hover:bg-purple-600/20 hover:text-white transition-all`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Lọc
                </Button>
              </div>

              {/* Filter Options */}
              {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-purple-500/20">
                  <div className="space-y-2">
                    <label className="text-xs text-white/60">Trạng thái</label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                        <SelectValue placeholder="Tất cả trạng thái" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/95 border-purple-500/30">
                        <SelectItem
                          value="all"
                          className="text-white hover:bg-purple-600/20"
                        >
                          Tất cả trạng thái
                        </SelectItem>
                        {(statuses as string[]).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-white/60">Độ ưu tiên</label>
                    <Select
                      value={priorityFilter}
                      onValueChange={setPriorityFilter}
                    >
                      <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                        <SelectValue placeholder="Tất cả mức độ" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/95 border-purple-500/30">
                        <SelectItem
                          value="all"
                          className="text-white hover:bg-purple-600/20"
                        >
                          Tất cả mức độ
                        </SelectItem>
                        {(priorities as string[]).map((priority: string) => (
                          <SelectItem
                            key={priority}
                            value={priority}
                            className="text-white hover:bg-purple-600/20"
                          >
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      className="w-full bg-black/30 border-purple-500/30 text-white/60 hover:bg-red-600/20 hover:text-white hover:border-red-500/50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Xóa bộ lọc
                    </Button>
                  </div>
                </div>
              )}

              {/* Active Filters Display */}
              {(searchTerm ||
                statusFilter !== "all" ||
                priorityFilter !== "all") && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-purple-500/20">
                  <span className="text-xs text-white/60">Đang lọc:</span>
                  {searchTerm && (
                    <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 border text-xs">
                      Tìm kiếm: "{searchTerm}"
                    </Badge>
                  )}
                  {statusFilter !== "all" && (
                    <Badge
                      className={`${getStatusColor(statusFilter)} border text-xs`}
                    >
                      {statusFilter}
                    </Badge>
                  )}
                  {priorityFilter !== "all" && (
                    <Badge
                      className={`${getPriorityColor(priorityFilter)} border text-xs`}
                    >
                      Ưu tiên: {priorityFilter}
                    </Badge>
                  )}
                  <span className="text-xs text-white/60">
                    ({filteredTasks.length} kết quả)
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredTasks && filteredTasks.length > 0 ? (
              filteredTasks.map((task: any) => (
                <Card
                  key={task.id}
                  className="bg-black/50 border-purple-500/30 hover:bg-black/40 transition-all cursor-pointer group"
                  onClick={() => handleViewTaskDetail(task.id)}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2 flex-1">
                          {task.name}
                        </h3>
                        <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge
                          className={`${getStatusColor(task.status.name)} border text-[10px]`}
                        >
                          {task.status.name}
                        </Badge>
                        {task.priority && (
                          <Badge
                            className={`${getPriorityColor(task.priority.name)} border text-[10px]`}
                          >
                            {task.priority.name}
                          </Badge>
                        )}
                      </div>

                      <div className="bg-black/30 rounded p-2 border border-purple-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <FolderKanban className="w-3 h-3 text-white/60" />
                          <span className="text-xs text-white/80 truncate">
                            {task.project.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-white/60" />
                          <span className="text-xs text-white/60">
                            {formatDate(task.date_start)} -{" "}
                            {formatDate(task.date_end)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={task.assignee.avatar}
                            alt={task.assignee.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-xs text-white/80 truncate max-w-[100px]">
                            {task.assignee.name}
                          </span>
                        </div>

                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-400">
                            {parseFloat(task.process).toFixed(0)}%
                          </div>
                        </div>
                      </div>

                      <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden border border-purple-500/20">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                          style={{ width: `${parseFloat(task.process)}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-black/50 border-purple-500/30 col-span-full">
                <CardContent className="p-8 sm:p-12 text-center">
                  <p className="text-white/60 text-sm sm:text-lg">
                    {searchTerm ||
                    statusFilter !== "all" ||
                    priorityFilter !== "all"
                      ? "Không tìm thấy công việc nào phù hợp với bộ lọc"
                      : "Không có công việc nào"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {filteredTasks && filteredTasks.length > 0 ? (
              filteredTasks.map((task: any) => (
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
                          <Badge
                            className={`${getStatusColor(task.status.name)} border text-[10px] sm:text-xs`}
                          >
                            {task.status.name}
                          </Badge>
                          {task.priority && (
                            <Badge
                              className={`${getPriorityColor(task.priority.name)} border text-[10px] sm:text-xs`}
                            >
                              Ưu tiên: {task.priority.name}
                            </Badge>
                          )}
                          <div className="flex items-center gap-2 bg-black/30 rounded-full px-2 sm:px-3 py-1 border border-purple-500/20">
                            <FolderKanban className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
                            <span className="text-[10px] sm:text-sm text-white/80">
                              {task.project.name}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-sm text-white/60">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>
                              {formatDate(task.date_start)} -{" "}
                              {formatDate(task.date_end)}
                            </span>
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
                        <div className="text-[10px] sm:text-sm text-white/60">
                          Tiến độ
                        </div>
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
                  <p className="text-white/60 text-sm sm:text-lg">
                    {searchTerm ||
                    statusFilter !== "all" ||
                    priorityFilter !== "all"
                      ? "Không tìm thấy công việc nào phù hợp với bộ lọc"
                      : "Không có công việc nào"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

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
