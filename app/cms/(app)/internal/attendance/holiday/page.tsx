"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Trash2,
  Loader2,
  X,
  CalendarDays,
  PartyPopper,
  ClipboardList,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useAttendanceData } from "@/src/hook/attendanceHook";
import {
  listHolidayAttendance,
  createHolidayAttendance,
  updateHolidayAttendance,
  deleteHolidayAttendance,
} from "@/src/features/attendance/attendanceApi";

interface Holiday {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
}

function toInputDate(iso: string): string {
  // Convert ISO string → yyyy-mm-dd for <input type="date">
  return iso ? iso.slice(0, 10) : "";
}

function formatDisplay(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function daysBetween(start: string, end: string): number {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  return Math.round((e.getTime() - s.getTime()) / 86400000) + 1;
}

export default function HolidayAttendancePage() {
  const token = localStorage.getItem("cmsToken");
  const dispatch = useDispatch();
  const { holidayAttendance } = useAttendanceData();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDebounce, setSearchDebounce] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Holiday | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingItem, setDeletingItem] = useState<Holiday | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounce(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setLoading(true);
    dispatch(listHolidayAttendance(token) as any).finally(() =>
      setLoading(false),
    );
  }, [dispatch]);

  const safeData: Holiday[] = Array.isArray(holidayAttendance)
    ? holidayAttendance
    : [];

  const filtered = safeData.filter((h) => {
    if (!searchDebounce.trim()) return true;
    return h.name.toLowerCase().includes(searchDebounce.toLowerCase());
  });

  const totalCount = safeData.length;
  const hasActiveFilters = searchTerm.trim() !== "";

  const clearFilters = () => setSearchTerm("");

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ name: "", start_date: "", end_date: "" });
    setShowModal(true);
  };

  const openEdit = (item: Holiday) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      start_date: toInputDate(item.start_date),
      end_date: toInputDate(item.end_date),
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên ngày lễ");
      return;
    }
    if (!formData.start_date || !formData.end_date) {
      toast.error("Vui lòng chọn ngày bắt đầu và kết thúc");
      return;
    }
    if (formData.end_date < formData.start_date) {
      toast.error("Ngày kết thúc không thể trước ngày bắt đầu");
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        const res = await dispatch(
          updateHolidayAttendance({
            token,
            id: editingItem.id,
            name: formData.name.trim(),
            start_date: formData.start_date,
            end_date: formData.end_date,
          }) as any,
        );
        if (res.payload?.status === 200 || res.payload?.status === 201) {
          toast.success(res.payload.data?.message ?? "Cập nhật thành công");
          setShowModal(false);
        } else {
          toast.error("Cập nhật thất bại");
        }
      } else {
        const res = await dispatch(
          createHolidayAttendance({
            token,
            name: formData.name.trim(),
            start_date: formData.start_date,
            end_date: formData.end_date,
          }) as any,
        );
        if (res.payload?.status === 200 || res.payload?.status === 201) {
          toast.success(res.payload.data?.message ?? "Tạo thành công");
          setShowModal(false);
        } else {
          toast.error("Tạo thất bại");
        }
      }
      await dispatch(listHolidayAttendance(token) as any);
    } catch {
      toast.error("Lỗi kết nối server");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    try {
      const res = await dispatch(
        deleteHolidayAttendance({ token, id: deletingItem.id }) as any,
      );
      if (res.payload?.status === 200 || res.payload?.status === 201) {
        toast.success(res.payload.data?.message ?? "Xóa thành công");
        setDeletingItem(null);
        await dispatch(listHolidayAttendance(token) as any);
      } else {
        toast.error("Xóa thất bại");
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
            Quản Lý Ngày Lễ
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-0.5">
            Cấu hình các ngày lễ và nghỉ lễ trong năm
          </p>
        </div>
        <Button
          onClick={openCreate}
          size="sm"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shrink-0 h-9 px-3"
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Thêm Ngày Lễ</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6">
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">Tổng ngày lễ</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {totalCount}
                </p>
              </div>
              <ClipboardList className="hidden sm:block h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-blue-500/30">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">Tổng ngày nghỉ</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {safeData.reduce(
                    (acc, h) => acc + daysBetween(h.start_date, h.end_date),
                    0,
                  )}
                  <span className="text-sm font-normal text-white/60 ml-1">
                    ngày
                  </span>
                </p>
              </div>
              <CalendarDays className="hidden sm:block h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-pink-500/30">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">Ngày lễ sắp tới</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {
                    safeData.filter(
                      (h) => new Date(h.start_date) >= new Date(),
                    ).length
                  }
                </p>
              </div>
              <PartyPopper className="hidden sm:block h-8 w-8 text-pink-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardContent className="p-3 sm:p-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo tên ngày lễ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 h-9 text-sm"
              />
            </div>

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
                Danh Sách Ngày Lễ
              </CardTitle>
              <CardDescription className="text-white/60 text-xs sm:text-sm">
                {filtered.length} ngày lễ
                {hasActiveFilters && ` / ${totalCount} tổng`}
              </CardDescription>
            </div>
            <Button
              onClick={openCreate}
              size="sm"
              className="hidden sm:flex bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" /> Thêm Ngày Lễ
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
                {filtered.length > 0 ? (
                  filtered.map((item) => {
                    const days = daysBetween(item.start_date, item.end_date);
                    const isPast = new Date(item.end_date) < new Date();
                    return (
                      <div
                        key={item.id}
                        className="bg-white/5 border border-purple-500/20 rounded-xl p-3 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center shrink-0 mt-0.5">
                              <PartyPopper className="h-4 w-4 text-pink-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-white text-sm leading-tight">
                                {item.name}
                              </p>
                              <p className="text-xs text-white/50 mt-0.5 flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" />
                                {formatDisplay(item.start_date)}
                                {item.start_date !== item.end_date && (
                                  <> – {formatDisplay(item.end_date)}</>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                                isPast
                                  ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
                                  : "bg-green-500/20 text-green-400 border-green-500/30"
                              }`}
                            >
                              {isPast ? "Đã qua" : "Sắp tới"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-white/5">
                          <span className="text-xs text-white/40">
                            {days} ngày nghỉ
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEdit(item)}
                              className="h-7 w-7 p-0 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeletingItem(item)}
                              className="h-7 w-7 p-0 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-white/50 text-sm">
                    {hasActiveFilters
                      ? "Không tìm thấy ngày lễ nào phù hợp"
                      : "Chưa có ngày lễ nào"}
                  </div>
                )}
              </div>

              {/* Desktop: table */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-purple-500/30">
                      <TableHead className="text-white">Tên Ngày Lễ</TableHead>
                      <TableHead className="text-white">Ngày Bắt Đầu</TableHead>
                      <TableHead className="text-white">Ngày Kết Thúc</TableHead>
                      <TableHead className="text-white">Số Ngày</TableHead>
                      <TableHead className="text-white">Trạng Thái</TableHead>
                      <TableHead className="text-white">Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length > 0 ? (
                      filtered.map((item) => {
                        const days = daysBetween(
                          item.start_date,
                          item.end_date,
                        );
                        const isPast = new Date(item.end_date) < new Date();
                        return (
                          <TableRow
                            key={item.id}
                            className="border-b border-purple-500/30 hover:bg-white/5"
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center shrink-0">
                                  <PartyPopper className="h-4 w-4 text-pink-400" />
                                </div>
                                <span className="text-white font-medium text-sm">
                                  {item.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5 text-white/80 text-sm">
                                <CalendarDays className="h-3.5 w-3.5 text-purple-400" />
                                {formatDisplay(item.start_date)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5 text-white/80 text-sm">
                                <CalendarDays className="h-3.5 w-3.5 text-purple-400" />
                                {formatDisplay(item.end_date)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-white/80 text-sm">
                                {days}{" "}
                                <span className="text-white/40 text-xs">
                                  ngày
                                </span>
                              </span>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                                  isPast
                                    ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
                                    : "bg-green-500/20 text-green-400 border-green-500/30"
                                }`}
                              >
                                {isPast ? "Đã qua" : "Sắp tới"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEdit(item)}
                                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setDeletingItem(item)}
                                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-white/60"
                        >
                          {hasActiveFilters
                            ? "Không tìm thấy ngày lễ nào phù hợp với bộ lọc"
                            : "Chưa có ngày lễ nào"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-black/90 border-purple-500/30 text-white w-[calc(100vw-2rem)] max-w-md mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold text-white">
              {editingItem ? "Chỉnh Sửa Ngày Lễ" : "Thêm Ngày Lễ Mới"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-5">
            <div>
              <Label htmlFor="name" className="text-white text-sm">
                Tên Ngày Lễ *
              </Label>
              <Input
                id="name"
                placeholder="Nhập tên ngày lễ..."
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 mt-1 h-9 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="start_date" className="text-white text-sm">
                  Ngày Bắt Đầu *
                </Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({
                      ...formData,
                      start_date: val,
                      // Auto-set end_date if empty or before start
                      end_date:
                        !formData.end_date || formData.end_date < val
                          ? val
                          : formData.end_date,
                    });
                  }}
                  className="bg-black/30 border-purple-500/30 text-white mt-1 h-9 text-sm [color-scheme:dark]"
                />
              </div>

              <div>
                <Label htmlFor="end_date" className="text-white text-sm">
                  Ngày Kết Thúc *
                </Label>
                <Input
                  id="end_date"
                  type="date"
                  min={formData.start_date || undefined}
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  className="bg-black/30 border-purple-500/30 text-white mt-1 h-9 text-sm [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Preview */}
            {formData.start_date && formData.end_date && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-sm">
                <PartyPopper className="h-4 w-4 text-pink-400 shrink-0" />
                <span className="text-white/80">
                  <span className="text-white font-medium">
                    {formData.name || "Ngày lễ"}
                  </span>
                  {" · "}
                  {formatDisplay(formData.start_date)}
                  {formData.start_date !== formData.end_date && (
                    <> – {formatDisplay(formData.end_date)}</>
                  )}
                  {" · "}
                  <span className="text-blue-300">
                    {daysBetween(formData.start_date, formData.end_date)} ngày
                  </span>
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-700/50">
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              className="bg-transparent border-2 border-gray-500/50 text-white hover:bg-gray-500/20 h-9 text-sm"
            >
              <X className="h-4 w-4 mr-1.5" /> Hủy
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 h-9 text-sm"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Đang
                  lưu...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1.5" />
                  {editingItem ? "Cập Nhật" : "Tạo Ngày Lễ"}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deletingItem} onOpenChange={() => setDeletingItem(null)}>
        <DialogContent className="bg-black/90 border-red-500/30 text-white w-[calc(100vw-2rem)] max-w-md mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              Xác Nhận Xóa
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-white/80 text-sm">
              Bạn có chắc chắn muốn xóa ngày lễ{" "}
              <span className="text-white font-semibold">
                "{deletingItem?.name}"
              </span>
              ? Hành động này không thể hoàn tác.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-700/50">
              <Button
                variant="outline"
                onClick={() => setDeletingItem(null)}
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