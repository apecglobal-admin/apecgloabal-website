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
  Star,
  CalendarDays,
  Gift,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useAttendanceData } from "@/src/hook/attendanceHook";
import {
  listSenioritiesAttendance,
  createSenioritiesAttendance,
  updateSenioritiesAttendance,
  deleteSenioritiesAttendance,
} from "@/src/features/attendance/attendanceApi";

interface Seniority {
  id: string;
  years_required: number;
  days_granted: number;
}

export default function SenioritiesAttendancePage() {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { senioritiesAttendance } = useAttendanceData();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [searchDebounce, setSearchDebounce] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Seniority | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingItem, setDeletingItem] = useState<Seniority | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    years_required: "",
    days_granted: "",
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchTerm);

    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch list
  useEffect(() => {
    setLoading(true);
    dispatch(listSenioritiesAttendance(token) as any).finally(() =>
      setLoading(false),
    );
  }, [dispatch]);

  const safeData: Seniority[] = Array.isArray(senioritiesAttendance)
    ? senioritiesAttendance
    : [];

  // Local filter by search (years_required / days_granted)
  const filtered = safeData.filter((s) => {
    if (!searchDebounce.trim()) return true;
    const q = searchDebounce.toLowerCase();
    return (
      String(s.years_required).includes(q) ||
      String(s.days_granted).includes(q)
    );
  });

  const totalCount = safeData.length;
  const hasActiveFilters = searchTerm.trim() !== "";

  const clearFilters = () => {
    setSearchTerm("");

  };

  // Helpers
  const openCreate = () => {
    setEditingItem(null);
    setFormData({ years_required: "", days_granted: "" });
    setShowModal(true);
  };

  const openEdit = (item: Seniority) => {
    setEditingItem(item);
    setFormData({
      years_required: String(item.years_required),
      days_granted: String(item.days_granted),
    });
    setShowModal(true);
  };

  const onlyNumbers = (val: string) => val.replace(/[^0-9]/g, "");

  const handleSave = async () => {
    if (!formData.years_required || !formData.days_granted) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    setSaving(true);
    try {
      if (editingItem) {
        const res = await dispatch(
          updateSenioritiesAttendance({
            token,
            id: editingItem.id,
            years_required: Number(formData.years_required),
            days_granted: Number(formData.days_granted),
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
          createSenioritiesAttendance({
            token,
            years_required: Number(formData.years_required),
            days_granted: Number(formData.days_granted),
          }) as any,
        );
        if (res.payload?.status === 200 || res.payload?.status === 201) {
          toast.success(res.payload.data?.message ?? "Tạo thành công");
          setShowModal(false);
        } else {
          toast.error("Tạo thất bại");
        }
      }
      await dispatch(listSenioritiesAttendance(token) as any);
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
        deleteSenioritiesAttendance({ token, id: deletingItem.id }) as any,
      );
      if (res.payload?.status === 200 || res.payload?.status === 201) {
        toast.success(res.payload.data?.message ?? "Xóa thành công");
        setDeletingItem(null);
        await dispatch(listSenioritiesAttendance(token) as any);
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
            Thâm Niên & Ngày Phép
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-0.5">
            Cấu hình số ngày phép theo số năm thâm niên
          </p>
        </div>
        <Button
          onClick={openCreate}
          size="sm"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shrink-0 h-9 px-3"
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Thêm Thâm Niên</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6">
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">Tổng cấu hình</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{totalCount}</p>
              </div>
              <ClipboardList className="hidden sm:block h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-blue-500/30">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">Thâm niên cao nhất</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {safeData.length > 0
                    ? Math.max(...safeData.map((s) => s.years_required))
                    : "—"}
                  {safeData.length > 0 && (
                    <span className="text-sm font-normal text-white/60 ml-1">năm</span>
                  )}
                </p>
              </div>
              <Star className="hidden sm:block h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-green-500/30">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">Ngày phép cao nhất</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {safeData.length > 0
                    ? Math.max(...safeData.map((s) => s.days_granted))
                    : "—"}
                  {safeData.length > 0 && (
                    <span className="text-sm font-normal text-white/60 ml-1">ngày</span>
                  )}
                </p>
              </div>
              <Gift className="hidden sm:block h-8 w-8 text-green-400" />
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
                placeholder="Tìm theo số năm hoặc số ngày phép..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 h-9 text-sm"
              />
            </div>

            {/* Mobile toggle (future filters) */}
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
                Danh Sách Cấu Hình
              </CardTitle>
              <CardDescription className="text-white/60 text-xs sm:text-sm">
                {filtered.length} cấu hình
                {hasActiveFilters && ` / ${totalCount} tổng`}
              </CardDescription>
            </div>
            <Button
              onClick={openCreate}
              size="sm"
              className="hidden sm:flex bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" /> Thêm Thâm Niên
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
                  filtered.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white/5 border border-purple-500/20 rounded-xl p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          {/* Years badge */}
                          <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg px-2.5 py-1.5">
                            <CalendarDays className="h-3.5 w-3.5 text-blue-400" />
                            <span className="text-blue-300 text-sm font-semibold">
                              {item.years_required}
                            </span>
                            <span className="text-blue-400/70 text-xs">năm</span>
                          </div>
                          <span className="text-white/30 text-sm">→</span>
                          {/* Days badge */}
                          <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-lg px-2.5 py-1.5">
                            <Gift className="h-3.5 w-3.5 text-green-400" />
                            <span className="text-green-300 text-sm font-semibold">
                              {item.days_granted}
                            </span>
                            <span className="text-green-400/70 text-xs">ngày phép</span>
                          </div>
                        </div>
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
                  ))
                ) : (
                  <div className="text-center py-12 text-white/50 text-sm">
                    {hasActiveFilters
                      ? "Không tìm thấy cấu hình nào phù hợp"
                      : "Chưa có cấu hình nào"}
                  </div>
                )}
              </div>

              {/* Desktop: table */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-purple-500/30">
                      <TableHead className="text-white">Số Năm Thâm Niên</TableHead>
                      <TableHead className="text-white">Số Ngày Phép Được Cấp</TableHead>
                      <TableHead className="text-white">Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length > 0 ? (
                      filtered.map((item) => (
                        <TableRow
                          key={item.id}
                          className="border-b border-purple-500/30 hover:bg-white/5"
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-9 w-9 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                                <CalendarDays className="h-4 w-4 text-blue-400" />
                              </div>
                              <div>
                                <p className="text-white font-semibold text-base">
                                  {item.years_required}
                                  <span className="text-white/50 font-normal text-sm ml-1">
                                    năm
                                  </span>
                                </p>
                                <p className="text-white/40 text-xs">
                                  Yêu cầu thâm niên tối thiểu
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-9 w-9 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0">
                                <Gift className="h-4 w-4 text-green-400" />
                              </div>
                              <div>
                                <p className="text-white font-semibold text-base">
                                  {item.days_granted}
                                  <span className="text-white/50 font-normal text-sm ml-1">
                                    ngày
                                  </span>
                                </p>
                                <p className="text-white/40 text-xs">
                                  Số ngày phép được cấp thêm
                                </p>
                              </div>
                            </div>
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center py-8 text-white/60"
                        >
                          {hasActiveFilters
                            ? "Không tìm thấy cấu hình nào phù hợp với bộ lọc"
                            : "Chưa có cấu hình thâm niên nào"}
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
              {editingItem ? "Chỉnh Sửa Thâm Niên" : "Thêm Cấu Hình Thâm Niên"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-5">
            <div>
              <Label htmlFor="years_required" className="text-white text-sm">
                Số Năm Thâm Niên *
              </Label>
              <div className="relative mt-1">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                <Input
                  id="years_required"
                  inputMode="numeric"
                  placeholder="Nhập số năm..."
                  value={formData.years_required}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      years_required: onlyNumbers(e.target.value),
                    })
                  }
                  className="pl-9 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 h-9 text-sm"
                />
              </div>
              <p className="text-white/40 text-xs mt-1">
                Số năm làm việc tối thiểu để áp dụng chính sách này
              </p>
            </div>

            <div>
              <Label htmlFor="days_granted" className="text-white text-sm">
                Số Ngày Phép Được Cấp *
              </Label>
              <div className="relative mt-1">
                <Gift className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-400" />
                <Input
                  id="days_granted"
                  inputMode="numeric"
                  placeholder="Nhập số ngày phép..."
                  value={formData.days_granted}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      days_granted: onlyNumbers(e.target.value),
                    })
                  }
                  className="pl-9 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 h-9 text-sm"
                />
              </div>
              <p className="text-white/40 text-xs mt-1">
                Số ngày phép cộng thêm cho nhân viên đạt thâm niên này
              </p>
            </div>

            {/* Preview */}
            {(formData.years_required || formData.days_granted) && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300 font-semibold">
                    {formData.years_required || "?"}
                  </span>
                  <span className="text-white/50 text-xs">năm</span>
                </div>
                <span className="text-white/30">→</span>
                <div className="flex items-center gap-1.5">
                  <Gift className="h-4 w-4 text-green-400" />
                  <span className="text-green-300 font-semibold">
                    {formData.days_granted || "?"}
                  </span>
                  <span className="text-white/50 text-xs">ngày phép</span>
                </div>
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
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Đang lưu...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1.5" />
                  {editingItem ? "Cập Nhật" : "Tạo Cấu Hình"}
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
              Bạn có chắc chắn muốn xóa cấu hình thâm niên{" "}
              <span className="text-white font-semibold">
                {deletingItem?.years_required} năm → {deletingItem?.days_granted} ngày phép
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
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Đang xóa...
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