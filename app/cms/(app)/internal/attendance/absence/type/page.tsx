"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Search,
  Edit,
  Loader2,
  Trash2,
  Filter,
  X,
  FileText,
  CheckCircle2,
  XCircle,
  ClipboardList,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { useAttendanceData } from "@/src/hook/attendanceHook";
import { useDispatch } from "react-redux";
import {
  listAbsences,
  createAbsence,
  updateAbsence,
  deleteAbsence,
  updateAbsenceStatus,
} from "@/src/features/attendance/attendanceApi";
import Pagination from "@/components/pagination";

interface AbsenceType {
  id: string;
  name: string;
  description: string;
  active: boolean;
  is_attendance_added: boolean | null;
  is_leave_deducted: boolean | null;
}

export default function AbsenceTypeAttendancePage() {
  const token = localStorage.getItem("cmsToken");
  const dispatch = useDispatch();
  const { absenceTypes } = useAttendanceData();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAbsence, setEditingAbsence] = useState<AbsenceType | null>(
    null,
  );
  const [creating, setCreating] = useState(false);
  const [deletingAbsence, setDeletingAbsence] = useState<AbsenceType | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [searchDebounce, setSearchDebounce] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_attendance_added: false,
    is_leave_deducted: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setLoading(true);
    dispatch(listAbsences(token) as any).finally(() => setLoading(false));
  }, [dispatch]);

  const safeAbsenceTypes = Array.isArray(absenceTypes) ? absenceTypes : [];

  const filteredAbsenceTypes = useMemo(() => {
    let result = safeAbsenceTypes;
    if (searchDebounce.trim()) {
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(searchDebounce.toLowerCase()) ||
          a.description?.toLowerCase().includes(searchDebounce.toLowerCase()),
      );
    }
    if (filterStatus === "active") result = result.filter((a) => a.active);
    if (filterStatus === "inactive") result = result.filter((a) => !a.active);
    return result;
  }, [safeAbsenceTypes, searchDebounce, filterStatus]);

  const totalPages = Math.ceil(filteredAbsenceTypes.length / limit);
  const paginatedData = filteredAbsenceTypes.slice(
    (page - 1) * limit,
    page * limit,
  );

  const totalCount = safeAbsenceTypes.length;
  const activeCount = safeAbsenceTypes.filter((a) => a.active).length;
  const inactiveCount = totalCount - activeCount;

  const hasActiveFilters = searchTerm.trim() !== "" || filterStatus !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setPage(1);
  };

  const handleCreate = () => {
    setEditingAbsence(null);
    setFormData({
      name: "",
      description: "",
      is_attendance_added: false,
      is_leave_deducted: false,
    });
    setShowCreateModal(true);
  };

  const handleEdit = (absence: AbsenceType) => {
    setEditingAbsence(absence);
    setFormData({
      name: absence.name,
      description: absence.description || "",
      is_attendance_added: absence.is_attendance_added ?? false,
      is_leave_deducted: absence.is_leave_deducted ?? false,
    });
    setShowCreateModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên loại đơn");
      return;
    }
    setCreating(true);
    try {
      if (editingAbsence) {
        const res = await dispatch(
          updateAbsence({
            token,
            id: editingAbsence.id,
            name: formData.name.trim(),
            description: formData.description.trim(),
            is_attendance_added: formData.is_attendance_added,
            is_leave_deducted: formData.is_leave_deducted,
          }) as any,
        );
        if (res.payload.status === 200 || res.payload.status === 201) {
          toast.success(res.payload.data.message);
          setShowCreateModal(false);
        }
      } else {
        const res = await dispatch(
          createAbsence({
            token,
            name: formData.name.trim(),
            description: formData.description.trim(),
            is_attendance_added: formData.is_attendance_added,
            is_leave_deducted: formData.is_leave_deducted,
          }) as any,
        );
        if (res.payload.status === 200 || res.payload.status === 201) {
          toast.success(res.payload.data.message);
          setShowCreateModal(false);
        }
      }
      await dispatch(listAbsences(token) as any);
    } catch (error) {
      toast.error("Lỗi kết nối server");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingAbsence) return;
    setDeleting(true);
    try {
      const res = await dispatch(
        deleteAbsence({ token, id: deletingAbsence.id }) as any,
      );
      if (res.payload.status === 200 || res.payload.status === 201) {
        setDeletingAbsence(null);
        await dispatch(listAbsences(token) as any);
        toast.success(res.payload.data.message);
      } else {
        toast.error("Lỗi: " + res.error);
      }
    } catch (error) {
      toast.error("Lỗi kết nối server");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (absence: AbsenceType) => {
    setTogglingId(absence.id);
    try {
      const res = await dispatch(
        updateAbsenceStatus({ token, id: absence.id }) as any,
      );
      if (res.payload.status === 200 || res.payload.status === 201) {
        toast.success(res.payload.data.message);
        await dispatch(listAbsences(token) as any);
      } else {
        toast.error("Cập nhật trạng thái thất bại");
      }
    } catch {
      toast.error("Lỗi kết nối server");
    } finally {
      setTogglingId(null);
    }
  };

  const renderBoolBadge = (value: boolean | null) =>
    value === null || value === undefined ? (
      <Badge className="bg-gray-600/20 text-gray-400 border-gray-500/30 text-xs">
        —
      </Badge>
    ) : value ? (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 flex items-center gap-1 w-fit text-xs">
        <CheckCircle2 className="h-3 w-3" /> Có
      </Badge>
    ) : (
      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 flex items-center gap-1 w-fit text-xs">
        <XCircle className="h-3 w-3" /> Không
      </Badge>
    );

  // Component toggle button — dùng chung cho cả mobile & desktop
  const renderStatusToggle = (absence: AbsenceType) => {
    const isToggling = togglingId === absence.id;
    return absence.active ? (
      <Button
        size="sm"
        disabled={isToggling}
        onClick={() => handleToggleStatus(absence)}
        className="h-7 px-2.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-full text-xs font-medium gap-1 disabled:opacity-60"
      >
        {isToggling ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <ToggleRight className="h-3.5 w-3.5" />
        )}
        Hoạt động
      </Button>
    ) : (
      <Button
        size="sm"
        disabled={isToggling}
        onClick={() => handleToggleStatus(absence)}
        className="h-7 px-2.5 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 border border-gray-500/30 rounded-full text-xs font-medium gap-1 disabled:opacity-60"
      >
        {isToggling ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <ToggleLeft className="h-3.5 w-3.5" />
        )}
        Tạm ngưng
      </Button>
    );
  };

  return (
    <div className="space-y-4 px-2 sm:px-0">
      {/* Header — mobile: title left, button right */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-white leading-tight">
            Quản Lý Loại Đơn
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-0.5">
            Quản lý các loại đơn nghỉ phép và vắng mặt
          </p>
        </div>
        <Button
          onClick={handleCreate}
          size="sm"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shrink-0 h-9 px-3"
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Thêm Loại Đơn</span>
        </Button>
      </div>

      {/* Stats — 3 col on all sizes, compact on mobile */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6">
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">Tổng</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {totalCount}
                </p>
              </div>
              <ClipboardList className="hidden sm:block h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-green-500/30">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">Hoạt động</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {activeCount}
                </p>
              </div>
              <ToggleRight className="hidden sm:block h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-orange-500/30">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">Tạm ngưng</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {inactiveCount}
                </p>
              </div>
              <ToggleLeft className="hidden sm:block h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardContent className="p-3 sm:p-6">
          {/* Mobile: search + toggle */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 h-9 text-sm"
              />
            </div>

            {/* Mobile: toggle filter button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`sm:hidden shrink-0 h-9 px-3 border-purple-500/30 text-white/70 bg-black/30 hover:bg-white/10 ${hasActiveFilters ? "border-purple-400 text-purple-300" : ""}`}
            >
              <Filter className="h-4 w-4" />
              {showFilters ? (
                <ChevronUp className="h-3 w-3 ml-1" />
              ) : (
                <ChevronDown className="h-3 w-3 ml-1" />
              )}
            </Button>

            {/* Desktop: inline select */}
            <div className="hidden sm:flex gap-2 items-center">
              <Select
                value={filterStatus}
                onValueChange={(v: any) => setFilterStatus(v)}
              >
                <SelectTrigger className="w-[200px] bg-black/30 border-purple-500/30 text-white h-9">
                  <Filter className="h-4 w-4 mr-2 shrink-0" />
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại đơn</SelectItem>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <ToggleRight className="h-4 w-4 text-green-400" /> Đang
                      hoạt động
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center gap-2">
                      <ToggleLeft className="h-4 w-4 text-orange-400" /> Tạm
                      ngưng
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 h-9"
                >
                  <X className="h-4 w-4 mr-1" /> Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>

          {/* Mobile: expandable filter panel */}
          {showFilters && (
            <div className="sm:hidden mt-3 flex flex-col gap-2">
              <Select
                value={filterStatus}
                onValueChange={(v: any) => {
                  setFilterStatus(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full bg-black/30 border-purple-500/30 text-white h-9 text-sm">
                  <SelectValue placeholder="Lọc trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại đơn</SelectItem>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <ToggleRight className="h-4 w-4 text-green-400" /> Đang
                      hoạt động
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center gap-2">
                      <ToggleLeft className="h-4 w-4 text-orange-400" /> Tạm
                      ngưng
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 w-full h-9 text-sm"
                >
                  <X className="h-4 w-4 mr-2" /> Xóa bộ lọc
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* List */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-base sm:text-xl">
                Danh Sách Loại Đơn
              </CardTitle>
              <CardDescription className="text-white/60 text-xs sm:text-sm">
                {paginatedData.length} loại đơn
                {hasActiveFilters && ` / ${totalCount} tổng`}
              </CardDescription>
            </div>
            {/* Desktop add button (duplicate for context, hidden on mobile) */}
            <Button
              onClick={handleCreate}
              size="sm"
              className="hidden sm:flex bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" /> Thêm Loại Đơn
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-2 sm:px-6 pb-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-7 w-7 animate-spin text-white" />
              <span className="ml-2 text-white text-sm">Đang tải...</span>
            </div>
          ) : (
            <>
              {/* Mobile: card list */}
              <div className="sm:hidden space-y-2">
                {paginatedData.length > 0 ? (
                  paginatedData.map((absence) => (
                    <div
                      key={absence.id}
                      className="bg-white/5 border border-purple-500/20 rounded-xl p-3 space-y-2"
                    >
                      {/* Row 1: icon + name + status */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 min-w-0">
                          <FileText className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-semibold text-white text-sm leading-tight">
                              {absence.name}
                            </p>
                            {absence.description && (
                              <p className="text-xs text-white/50 mt-0.5 line-clamp-2">
                                {absence.description}
                              </p>
                            )}
                          </div>
                        </div>
                        {renderStatusToggle(absence)}
                      </div>

                      {/* Row 2: policy badges + actions */}
                      <div className="flex items-center justify-between pt-1 border-t border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-white/40 text-xs">
                              Tính công:
                            </span>
                            {renderBoolBadge(absence.is_attendance_added)}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-white/40 text-xs">
                              Trừ phép:
                            </span>
                            {renderBoolBadge(absence.is_leave_deducted)}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(absence)}
                            className="h-7 w-7 p-0 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingAbsence(absence)}
                            className="h-7 w-7 p-0 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-white/50 text-sm">
                    {hasActiveFilters
                      ? "Không tìm thấy loại đơn nào phù hợp"
                      : "Chưa có loại đơn nào"}
                  </div>
                )}
              </div>

              {/* Desktop: table */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-purple-500/30">
                      <TableHead className="text-white">Tên Loại Đơn</TableHead>
                      <TableHead className="text-white">Trạng Thái</TableHead>
                      <TableHead className="text-white">Tính Công</TableHead>
                      <TableHead className="text-white">Trừ Phép</TableHead>
                      <TableHead className="text-white">Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((absence) => (
                        <TableRow
                          key={absence.id}
                          className="border-b border-purple-500/30 hover:bg-white/5"
                        >
                          <TableCell>
                            <div className="flex items-start gap-2">
                              <FileText className="h-4 w-4 text-purple-400 mt-1 shrink-0" />
                              <div>
                                <p className="font-medium text-white">
                                  {absence.name}
                                </p>
                                <p className="text-sm text-white/60 max-w-xs line-clamp-2">
                                  {absence.description || "Không có mô tả"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {renderStatusToggle(absence)}
                          </TableCell>
                          <TableCell>
                            {renderBoolBadge(absence.is_attendance_added)}
                          </TableCell>
                          <TableCell>
                            {renderBoolBadge(absence.is_leave_deducted)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(absence)}
                                className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeletingAbsence(absence)}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-white/60"
                        >
                          {hasActiveFilters
                            ? "Không tìm thấy loại đơn nào phù hợp với bộ lọc"
                            : "Không tìm thấy loại đơn nào"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>

        {totalPages > 1 && (
          <div className="px-3 sm:px-6 pb-4 sm:pb-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={filteredAbsenceTypes.length}
              onPageChange={setPage}
              maxVisiblePages={5}
              itemsPerPage={limit}
            />
          </div>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-black/90 border-purple-500/30 text-white w-[calc(100vw-2rem)] max-w-lg mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold text-white">
              {editingAbsence ? "Chỉnh Sửa Loại Đơn" : "Thêm Loại Đơn Mới"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-5">
            <div>
              <Label htmlFor="name" className="text-white text-sm">
                Tên Loại Đơn *
              </Label>
              <Input
                id="name"
                placeholder="Nhập tên loại đơn..."
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 mt-1 h-9 text-sm"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-white text-sm">
                Mô Tả
              </Label>
              <Textarea
                id="description"
                placeholder="Mô tả loại đơn này..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 mt-1 text-sm"
                rows={3}
              />
            </div>

            <div className="space-y-3 border border-purple-500/20 rounded-xl p-3 sm:p-4 bg-purple-500/5">
              <p className="text-xs sm:text-sm font-semibold text-white/80">
                Cấu Hình Chính Sách
              </p>

              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-white">Tính Công</p>
                  <p className="text-xs text-white/50 leading-tight">
                    Được tính vào công?
                  </p>
                </div>
                <Switch
                  checked={formData.is_attendance_added}
                  onCheckedChange={(val) =>
                    setFormData({ ...formData, is_attendance_added: val })
                  }
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-white">Trừ Phép</p>
                  <p className="text-xs text-white/50 leading-tight">
                    Trừ vào ngày phép?
                  </p>
                </div>
                <Switch
                  checked={formData.is_leave_deducted}
                  onCheckedChange={(val) =>
                    setFormData({ ...formData, is_leave_deducted: val })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-700/50">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              className="bg-transparent border-2 border-gray-500/50 text-white hover:bg-gray-500/20 h-9 text-sm"
            >
              <X className="h-4 w-4 mr-1.5" /> Hủy
            </Button>
            <Button
              onClick={handleSave}
              disabled={creating}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 h-9 text-sm"
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Đang
                  lưu...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1.5" />
                  {editingAbsence ? "Cập Nhật" : "Tạo Loại Đơn"}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingAbsence}
        onOpenChange={() => setDeletingAbsence(null)}
      >
        <DialogContent className="bg-black/90 border-red-500/30 text-white w-[calc(100vw-2rem)] max-w-md mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              Xác Nhận Xóa
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-white/80 text-sm">
              Bạn có chắc chắn muốn xóa loại đơn{" "}
              <span className="text-white font-semibold">
                "{deletingAbsence?.name}"
              </span>
              ? Hành động này không thể hoàn tác.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-700/50">
              <Button
                variant="outline"
                onClick={() => setDeletingAbsence(null)}
                className="bg-transparent border-gray-500/50 text-white hover:bg-gray-500/20 h-9 text-sm"
              >
                Hủy
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white border-0 h-9 text-sm"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Đang
                    xóa...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-1.5" /> Xóa
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
