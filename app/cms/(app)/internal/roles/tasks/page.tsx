"use client";

import {
  listRoleDepartments,
  listRoleEmployee,
  listRoleEmployeeLevels,
  updateRoleDepartments,
} from "@/src/features/role/roleApi";
import { useRoleData } from "@/src/hook/roleHook";
import { useEffect, useState, memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Search,
  User,
  Save,
  Loader2,
  ChevronRight,
  Building2,
  CheckCircle2,
  XCircle,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type FilterMode = "employee" | "level";

interface Department {
  id: number;
  name: string;
  description: string | null;
  status: boolean;
}

interface DepartmentPanelProps {
  selectedItemName: string | undefined;
  enabledCount: number;
  totalCount: number;
  deptSearch: string;
  onDeptSearchChange: (v: string) => void;
  filteredDepts: Department[];
  allEnabled: boolean;
  onToggleAll: () => void;
  onToggleDept: (id: number) => void;
  onMobileBack: () => void;
  isSaving: boolean;
  onSave: () => void;
}

const DepartmentPanel = memo(function DepartmentPanel({
  selectedItemName,
  enabledCount,
  totalCount,
  deptSearch,
  onDeptSearchChange,
  filteredDepts,
  allEnabled,
  onToggleAll,
  onToggleDept,
  onMobileBack,
  isSaving,
  onSave,
}: DepartmentPanelProps) {
  return (
    <>
      {/* Header */}
      <div className="p-4 sm:p-6 pb-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={onMobileBack}
              className="sm:hidden p-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white mr-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white mb-0.5">
                {selectedItemName}
              </h2>
              <p className="text-xs text-gray-400">
                {enabledCount}/{totalCount} phòng ban được kích hoạt
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <Input
                placeholder="Tìm phòng ban..."
                value={deptSearch}
                onChange={(e) => onDeptSearchChange(e.target.value)}
                className="pl-8 h-9 w-full sm:w-52 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 text-xs"
              />
            </div>
            {totalCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleAll}
                className="border-gray-700 hover:bg-purple-500/10 hover:border-purple-500 text-purple-400 text-xs h-9 whitespace-nowrap"
              >
                {allEnabled ? "Tắt tất cả" : "Bật tất cả"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Department list — ScrollArea stays mounted, only items change */}
      <ScrollArea className="flex-1 px-3 sm:px-6">
        <div className="py-3 sm:py-4">
          {filteredDepts.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Không tìm thấy phòng ban</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
              {filteredDepts.map((dept) => (
                <div
                  key={dept.id}
                  onClick={() => onToggleDept(dept.id)}
                  className={cn(
                    "flex items-center justify-between gap-3 p-3 sm:p-4 rounded-lg border transition-all duration-200 cursor-pointer",
                    dept.status
                      ? "border-purple-500/30 bg-purple-500/10"
                      : "border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 hover:border-gray-600"
                  )}
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div
                      className={cn(
                        "w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        dept.status ? "bg-purple-500/20" : "bg-gray-700"
                      )}
                    >
                      <Building2
                        className={cn(
                          "w-3.5 h-3.5 sm:w-4 sm:h-4",
                          dept.status ? "text-purple-400" : "text-gray-500"
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-white truncate">
                        {dept.name}
                      </p>
                      {dept.description && (
                        <p className="text-xs text-gray-500 truncate">
                          {dept.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    {dept.status ? (
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                    )}
                    <Switch
                      checked={dept.status}
                      onCheckedChange={() => onToggleDept(dept.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="data-[state=checked]:bg-purple-500 scale-90 sm:scale-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-gray-800 p-3 sm:p-6 bg-gray-900/50 flex-shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs sm:text-sm text-gray-400">
            Đã bật:{" "}
            <span className="text-white font-semibold">{enabledCount}</span>
            {" / "}
            <span className="text-white font-semibold">{totalCount}</span>{" "}
            phòng ban
          </div>
          <Button
            onClick={onSave}
            disabled={isSaving}
            size="sm"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-xs sm:text-sm h-9"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
});

interface SidebarListProps {
  filterMode: FilterMode;
  sourceList: any[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const SidebarList = memo(function SidebarList({
  filterMode,
  sourceList,
  selectedId,
  onSelect,
}: SidebarListProps) {
  return (
    <div className="p-2 sm:p-3">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
        {filterMode === "employee" ? "Nhân viên" : "Cấp bậc"}
      </h3>
      <div className="space-y-1">
        {sourceList?.length === 0 ? (
          <p className="text-gray-500 text-xs text-center py-4">Không tìm thấy</p>
        ) : (
          sourceList?.map((item: any) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 group",
                selectedId === item.id
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                  : "hover:bg-gray-700/50 border border-transparent"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {filterMode === "employee" ? (
                    <User
                      className={cn(
                        "w-3.5 h-3.5 flex-shrink-0",
                        selectedId === item.id
                          ? "text-purple-400"
                          : "text-gray-500 group-hover:text-gray-400"
                      )}
                    />
                  ) : (
                    <Layers
                      className={cn(
                        "w-3.5 h-3.5 flex-shrink-0",
                        selectedId === item.id
                          ? "text-purple-400"
                          : "text-gray-500 group-hover:text-gray-400"
                      )}
                    />
                  )}
                  <p
                    className={cn(
                      "text-sm font-medium truncate",
                      selectedId === item.id ? "text-white" : "text-gray-300"
                    )}
                  >
                    {item.name}
                  </p>
                </div>
                <ChevronRight
                  className={cn(
                    "w-3.5 h-3.5 flex-shrink-0 transition-transform",
                    selectedId === item.id
                      ? "text-purple-400 translate-x-0.5"
                      : "text-gray-600 group-hover:text-gray-500"
                  )}
                />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
});

export default function RolesTasksPage() {
  const dispatch = useDispatch();
  const { employeesTasks, levelTasks, departmentTask } = useRoleData();

  const [filterMode, setFilterMode] = useState<FilterMode>("employee");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [localDepartments, setLocalDepartments] = useState<Department[]>([]);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [deptSearch, setDeptSearch] = useState("");
  const [isLoadingDepts, setIsLoadingDepts] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mobileShowDepts, setMobileShowDepts] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filterMode === "employee") {
        dispatch(listRoleEmployee(sidebarSearch) as any);
      } else {
        dispatch(listRoleEmployeeLevels(sidebarSearch) as any);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [dispatch, sidebarSearch, filterMode]);

  useEffect(() => {
    if (selectedId === null) return;
    setIsLoadingDepts(true);
    const param =
      filterMode === "employee"
        ? { employee_id: selectedId }
        : { level_id: selectedId };
    dispatch(listRoleDepartments(param) as any).finally(() => {
      setIsLoadingDepts(false);
    });
  }, [selectedId, filterMode, dispatch]);

  useEffect(() => {
    if (departmentTask && Array.isArray(departmentTask)) {
      setLocalDepartments(departmentTask.map((d: Department) => ({ ...d })));
    }
  }, [departmentTask]);

  const handleModeSwitch = (mode: FilterMode) => {
    setFilterMode(mode);
    setSelectedId(null);
    setLocalDepartments([]);
    setSidebarSearch("");
    setDeptSearch("");
    setMobileShowDepts(false);
  };

  const handleSelectItem = useCallback((id: number) => {
    setSelectedId(id);
    setMobileShowDepts(true);
  }, []);

  const handleMobileBack = useCallback(() => {
    setMobileShowDepts(false);
    setSelectedId(null);
  }, []);

  // useCallback ensures stable function references so memo'd DepartmentPanel
  // doesn't see new prop references → no re-mount → scroll position preserved
  const handleToggleDept = useCallback((id: number) => {
    setLocalDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: !d.status } : d))
    );
  }, []);

  const handleToggleAll = useCallback(() => {
    setLocalDepartments((prev) => {
      const allEnabled = prev.every((d) => d.status);
      return prev.map((d) => ({ ...d, status: !allEnabled }));
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (selectedId === null) return;
    setIsSaving(true);
    try {
      const params =
        filterMode === "employee"
          ? { employee_id: selectedId, level_id: undefined }
          : { employee_id: undefined, level_id: selectedId };

      const payload = {
        params,
        departments: localDepartments.map((d) => ({ id: d.id, status: d.status })),
      };

      const res = await dispatch(updateRoleDepartments(payload) as any);
      if (res.payload?.status === 200 || res.payload?.status === 201) {
        toast.success(res.payload.data?.message || "Cập nhật thành công");
      } else {
        toast.error(res.payload?.data?.message || "Đã có lỗi xảy ra");
      }
    } catch (error: any) {
      toast.error(error?.message || "Đã có lỗi xảy ra khi lưu");
    } finally {
      setIsSaving(false);
    }
  }, [selectedId, filterMode, localDepartments, dispatch]);

  const sourceList = filterMode === "employee" ? employeesTasks : levelTasks;
  const filteredDepts = localDepartments.filter((d) =>
    d.name?.toLowerCase().includes(deptSearch.toLowerCase())
  );
  const selectedItem = sourceList?.find((item: any) => item.id === selectedId);
  const enabledCount = localDepartments.filter((d) => d.status).length;
  const allEnabled = localDepartments.length > 0 && localDepartments.every((d) => d.status);

  const deptPanelProps: DepartmentPanelProps = {
    selectedItemName: selectedItem?.name,
    enabledCount,
    totalCount: localDepartments.length,
    deptSearch,
    onDeptSearchChange: setDeptSearch,
    filteredDepts,
    allEnabled,
    onToggleAll: handleToggleAll,
    onToggleDept: handleToggleDept,
    onMobileBack: handleMobileBack,
    isSaving,
    onSave: handleSave,
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl">
          <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg sm:text-3xl font-bold text-white">
            Phân quyền phòng ban
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Cấu hình quyền truy cập phòng ban theo nhân viên hoặc cấp bậc
          </p>
        </div>
      </div>

      {/* Mode Switch */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
        <CardContent className="p-3 sm:p-4">
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleModeSwitch("employee")}
              className={cn(
                "flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs sm:text-sm transition-all",
                filterMode === "employee"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  : "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
              )}
            >
              <User className="w-3.5 h-3.5" />
              Theo nhân viên
            </Button>
            <Button
              size="sm"
              onClick={() => handleModeSwitch("level")}
              className={cn(
                "flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs sm:text-sm transition-all",
                filterMode === "level"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  : "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              Theo cấp bậc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main layout */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur overflow-hidden">

        {/* ── MOBILE ── */}
        <div className="sm:hidden flex flex-col" style={{ minHeight: "calc(100vh - 260px)" }}>
          {mobileShowDepts && selectedId !== null ? (
            <div className="flex flex-col flex-1">
              {isLoadingDepts ? (
                <div className="flex-1 flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
              ) : (
                <DepartmentPanel {...deptPanelProps} />
              )}
            </div>
          ) : (
            <div className="flex flex-col flex-1">
              <div className="p-3 border-b border-gray-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                  <Input
                    placeholder={filterMode === "employee" ? "Tìm nhân viên..." : "Tìm cấp bậc..."}
                    value={sidebarSearch}
                    onChange={(e) => setSidebarSearch(e.target.value)}
                    className="pl-8 h-9 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 text-xs"
                  />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <SidebarList
                  filterMode={filterMode}
                  sourceList={sourceList ?? []}
                  selectedId={selectedId}
                  onSelect={handleSelectItem}
                />
              </ScrollArea>
            </div>
          )}
        </div>

        {/* ── DESKTOP ── */}
        <div className="hidden sm:flex" style={{ height: "calc(100vh - 320px)", minHeight: 700 }}>
          <div className="w-72 border-r border-gray-800 bg-gray-800/30 flex flex-col">
            <div className="p-4 border-b border-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                <Input
                  placeholder={filterMode === "employee" ? "Tìm nhân viên..." : "Tìm cấp bậc..."}
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  className="pl-8 h-8 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 text-xs"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <SidebarList
                filterMode={filterMode}
                sourceList={sourceList ?? []}
                selectedId={selectedId}
                onSelect={handleSelectItem}
              />
            </ScrollArea>
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            {selectedId === null ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-sm">
                    Chọn {filterMode === "employee" ? "nhân viên" : "cấp bậc"} để xem phòng ban
                  </p>
                </div>
              </div>
            ) : isLoadingDepts ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              </div>
            ) : (
              <DepartmentPanel {...deptPanelProps} />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}