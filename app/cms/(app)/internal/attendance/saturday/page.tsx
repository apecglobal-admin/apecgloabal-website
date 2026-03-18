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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Edit,
  Loader2,
  Trash2,
  X,
  Clock,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { useAttendanceData } from "@/src/hook/attendanceHook";
import { useDispatch } from "react-redux";
import {
  createShiftWorkSaturdayAttendance,
  updateShiftWorkSaturdayAttendance,
  deleteShiftWorkSaturdayAttendance,
  listShiftWorkSaturdayAttendance,
} from "@/src/features/attendance/attendanceApi";
import Pagination from "@/components/pagination";

interface ShiftWork {
  id: string;
  name: string;
  checkin: string;
  checkout: string;
}

// Format "HH:mm:ss" → "HH:mm"
const formatTime = (time: string) => time?.slice(0, 5) ?? "--:--";

// Format "HH:mm" → "HH:mm:ss"
const toTimeString = (time: string) =>
  time.length === 5 ? `${time}:00` : time;

export default function ShiftWorkSaturdayAttendancePage() {
  const token = localStorage.getItem("cmsToken");
  const dispatch = useDispatch();
  const { shiftWorkSaturdayAttendance } = useAttendanceData();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDebounce, setSearchDebounce] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingShift, setEditingShift] = useState<ShiftWork | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingShift, setDeletingShift] = useState<ShiftWork | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [showFilters, setShowFilters] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    checkin: "",
    checkout: "",
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Initial load
  useEffect(() => {
    setLoading(true);
    dispatch(listShiftWorkSaturdayAttendance(token) as any).finally(() =>
      setLoading(false)
    );
  }, [dispatch]);

  const safeShifts = Array.isArray(shiftWorkSaturdayAttendance)
    ? shiftWorkSaturdayAttendance
    : [];

  const filteredShifts = useMemo(() => {
    if (!searchDebounce.trim()) return safeShifts;
    return safeShifts.filter((s) =>
      s.name.toLowerCase().includes(searchDebounce.toLowerCase())
    );
  }, [safeShifts, searchDebounce]);

  const totalPages = Math.ceil(filteredShifts.length / limit);
  const paginatedData = filteredShifts.slice((page - 1) * limit, page * limit);
  const totalCount = safeShifts.length;
  const hasActiveFilters = searchTerm.trim() !== "";

  const clearFilters = () => {
    setSearchTerm("");
    setPage(1);
  };

  const handleCreate = () => {
    setEditingShift(null);
    setFormData({ name: "", checkin: "", checkout: "" });
    setShowCreateModal(true);
  };

  const handleEdit = (shift: ShiftWork) => {
    setEditingShift(shift);
    setFormData({
      name: shift.name,
      checkin: formatTime(shift.checkin),
      checkout: formatTime(shift.checkout),
    });
    setShowCreateModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên ca làm việc");
      return;
    }
    if (!formData.checkin) {
      toast.error("Vui lòng nhập giờ vào ca");
      return;
    }
    if (!formData.checkout) {
      toast.error("Vui lòng nhập giờ kết ca");
      return;
    }

    setCreating(true);
    try {
      if (editingShift) {
        const res = await dispatch(
          updateShiftWorkSaturdayAttendance({
            token,
            id: editingShift.id,
            name: formData.name.trim(),
            checkin: toTimeString(formData.checkin),
            checkout: toTimeString(formData.checkout),
          }) as any
        );
        if (res.payload.status === 200 || res.payload.status === 201) {
          toast.success(res.payload.data.message);
          setShowCreateModal(false);
        }
      } else {
        const res = await dispatch(
          createShiftWorkSaturdayAttendance({
            token,
            name: formData.name.trim(),
            checkin: toTimeString(formData.checkin),
            checkout: toTimeString(formData.checkout),
          }) as any
        );
        if (res.payload.status === 200 || res.payload.status === 201) {
          toast.success(res.payload.data.message);
          setShowCreateModal(false);
        }
      }
      await dispatch(listShiftWorkSaturdayAttendance(token) as any);
    } catch {
      toast.error("Lỗi kết nối server");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingShift) return;
    setDeleting(true);
    try {
      const res = await dispatch(
        deleteShiftWorkSaturdayAttendance({ token, id: deletingShift.id }) as any
      );
      if (res.payload.status === 200 || res.payload.status === 201) {
        setDeletingShift(null);
        await dispatch(listShiftWorkSaturdayAttendance(token) as any);
        toast.success(res.payload.data.message);
      } else {
        toast.error("Lỗi: " + res.error);
      }
    } catch {
      toast.error("Lỗi kết nối server");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4 px-2 sm:px-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-white leading-tight">
            Quản Lý Ca Làm Việc
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-0.5">
            Quản lý các ca làm việc và thời gian chấm công
          </p>
        </div>
        <Button
          onClick={handleCreate}
          size="sm"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shrink-0 h-9 px-3"
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Thêm Ca Làm Việc</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6">
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">Tổng Ca Làm Việc</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {totalCount}
                </p>
              </div>
              <CalendarClock className="hidden sm:block h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardContent className="p-3 sm:p-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm ca làm việc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 h-9 text-sm"
              />
            </div>

            {/* Mobile: toggle filter */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`sm:hidden shrink-0 h-9 px-3 border-purple-500/30 text-white/70 bg-black/30 hover:bg-white/10 ${
                hasActiveFilters ? "border-purple-400 text-purple-300" : ""
              }`}
            >
              <Filter className="h-4 w-4" />
              {showFilters ? (
                <ChevronUp className="h-3 w-3 ml-1" />
              ) : (
                <ChevronDown className="h-3 w-3 ml-1" />
              )}
            </Button>

            {/* Desktop: clear filter */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="hidden sm:flex bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 h-9"
              >
                <X className="h-4 w-4 mr-1" /> Xóa bộ lọc
              </Button>
            )}
          </div>

          {/* Mobile: expandable clear filter */}
          {showFilters && hasActiveFilters && (
            <div className="sm:hidden mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 w-full h-9 text-sm"
              >
                <X className="h-4 w-4 mr-2" /> Xóa bộ lọc
              </Button>
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
                Danh Sách Ca Làm Việc
              </CardTitle>
              <CardDescription className="text-white/60 text-xs sm:text-sm">
                {paginatedData.length} ca làm việc
                {hasActiveFilters && ` / ${totalCount} tổng`}
              </CardDescription>
            </div>
            <Button
              onClick={handleCreate}
              size="sm"
              className="hidden sm:flex bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" /> Thêm Ca Làm Việc
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
                  paginatedData.map((shift) => (
                    <div
                      key={shift.id}
                      className="bg-white/5 border border-purple-500/20 rounded-xl p-3 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 min-w-0">
                          <Clock className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-semibold text-white text-sm leading-tight">
                              {shift.name}
                            </p>
                            <p className="text-xs text-white/50 mt-0.5">
                              {formatTime(shift.checkin)} -{" "}
                              {formatTime(shift.checkout)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(shift)}
                            className="h-7 w-7 p-0 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingShift(shift)}
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
                      ? "Không tìm thấy ca làm việc nào phù hợp"
                      : "Chưa có ca làm việc nào"}
                  </div>
                )}
              </div>

              {/* Desktop: table */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-purple-500/30">
                      <TableHead className="text-white">Tên Ca</TableHead>
                      <TableHead className="text-white">Giờ Vào</TableHead>
                      <TableHead className="text-white">Giờ Ra</TableHead>
                      <TableHead className="text-white">Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((shift) => (
                        <TableRow
                          key={shift.id}
                          className="border-b border-purple-500/30 hover:bg-white/5"
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-purple-400 shrink-0" />
                              <p className="font-medium text-white">
                                {shift.name}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-white/80 font-mono">
                              {formatTime(shift.checkin)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-white/80 font-mono">
                              {formatTime(shift.checkout)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(shift)}
                                className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeletingShift(shift)}
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
                          colSpan={4}
                          className="text-center py-8 text-white/60"
                        >
                          {hasActiveFilters
                            ? "Không tìm thấy ca làm việc nào phù hợp với bộ lọc"
                            : "Không tìm thấy ca làm việc nào"}
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
              totalItems={filteredShifts.length}
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
              {editingShift ? "Chỉnh Sửa Ca Làm Việc" : "Thêm Ca Làm Việc Mới"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-5">
            <div>
              <Label htmlFor="name" className="text-white text-sm">
                Tên Ca Làm Việc *
              </Label>
              <Input
                id="name"
                placeholder="Nhập tên ca làm việc..."
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 mt-1 h-9 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="checkin" className="text-white text-sm">
                  Giờ Vào Ca *
                </Label>
                <Input
                  id="checkin"
                  type="time"
                  value={formData.checkin}
                  onChange={(e) =>
                    setFormData({ ...formData, checkin: e.target.value })
                  }
                  className="bg-black/30 border-purple-500/30 text-white mt-1 h-9 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="checkout" className="text-white text-sm">
                  Giờ Kết Ca *
                </Label>
                <Input
                  id="checkout"
                  type="time"
                  value={formData.checkout}
                  onChange={(e) =>
                    setFormData({ ...formData, checkout: e.target.value })
                  }
                  className="bg-black/30 border-purple-500/30 text-white mt-1 h-9 text-sm"
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
                  {editingShift ? "Cập Nhật" : "Tạo Ca Làm Việc"}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingShift}
        onOpenChange={() => setDeletingShift(null)}
      >
        <DialogContent className="bg-black/90 border-red-500/30 text-white w-[calc(100vw-2rem)] max-w-md mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              Xác Nhận Xóa
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-white/80 text-sm">
              Bạn có chắc chắn muốn xóa ca làm việc{" "}
              <span className="text-white font-semibold">
                "{deletingShift?.name}"
              </span>
              ? Hành động này không thể hoàn tác.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-700/50">
              <Button
                variant="outline"
                onClick={() => setDeletingShift(null)}
                className="bg-transparent border-gray-500/50 text-white hover:bg-gray-500/20 h-9 text-sm"
              >
                Hủy
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600/90 hover:bg-red-700 text-white border-0 h-9 text-sm"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Đang
                    xóa...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-1.5" /> Xóa Ca Làm Việc
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