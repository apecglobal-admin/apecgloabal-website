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
  MapPin,
  Navigation,
  Radar,
  ClipboardList,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useAttendanceData } from "@/src/hook/attendanceHook";
import {
  listPlaceAttendance,
  createPlaceAttendance,
  updatePlaceAttendance,
  deletePlaceAttendance,
} from "@/src/features/attendance/attendanceApi";

interface Place {
  id: string;
  name: string;
  long: string;
  lat: string;
  distance: string;
}

function onlyDecimal(val: string): string {
  // Allow digits and at most one dot
  return val.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
}

function onlyNumbers(val: string): string {
  return val.replace(/[^0-9]/g, "");
}

export default function PlaceAttendancePage() {
  const token = localStorage.getItem("cmsToken");
  const dispatch = useDispatch();
  const { placeAttendance } = useAttendanceData();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDebounce, setSearchDebounce] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Place | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingItem, setDeletingItem] = useState<Place | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    lat: "",
    long: "",
    distance: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounce(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setLoading(true);
    dispatch(listPlaceAttendance(token) as any).finally(() =>
      setLoading(false),
    );
  }, [dispatch]);

  const safeData: Place[] = Array.isArray(placeAttendance)
    ? placeAttendance
    : [];

  const filtered = safeData.filter((p) => {
    if (!searchDebounce.trim()) return true;
    return p.name.toLowerCase().includes(searchDebounce.toLowerCase());
  });

  const totalCount = safeData.length;
  const hasActiveFilters = searchTerm.trim() !== "";
  const clearFilters = () => setSearchTerm("");

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ name: "", lat: "", long: "", distance: "" });
    setShowModal(true);
  };

  const openEdit = (item: Place) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      lat: item.lat,
      long: item.long,
      distance: item.distance,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên địa điểm");
      return;
    }
    if (!formData.lat || !formData.long) {
      toast.error("Vui lòng nhập tọa độ (lat / long)");
      return;
    }
    if (!formData.distance) {
      toast.error("Vui lòng nhập bán kính cho phép");
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        const res = await dispatch(
          updatePlaceAttendance({
            token,
            id: editingItem.id,
            name: formData.name.trim(),
            lat: formData.lat,
            long: formData.long,
            distance: formData.distance,
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
          createPlaceAttendance({
            token,
            name: formData.name.trim(),
            lat: formData.lat,
            long: formData.long,
            distance: formData.distance,
          }) as any,
        );
        if (res.payload?.status === 200 || res.payload?.status === 201) {
          toast.success(res.payload.data?.message ?? "Tạo thành công");
          setShowModal(false);
        } else {
          toast.error("Tạo thất bại");
        }
      }
      await dispatch(listPlaceAttendance(token) as any);
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
        deletePlaceAttendance({ token, id: deletingItem.id }) as any,
      );
      if (res.payload?.status === 200 || res.payload?.status === 201) {
        toast.success(res.payload.data?.message ?? "Xóa thành công");
        setDeletingItem(null);
        await dispatch(listPlaceAttendance(token) as any);
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
            Quản Lý Địa Điểm Chấm Công
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-0.5">
            Cấu hình các địa điểm được phép chấm công
          </p>
        </div>
        <Button
          onClick={openCreate}
          size="sm"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shrink-0 h-9 px-3"
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Thêm Địa Điểm</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6">
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">Tổng địa điểm</p>
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
                <p className="text-white/60 text-xs">Bán kính tối thiểu</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {safeData.length > 0
                    ? Math.min(...safeData.map((p) => Number(p.distance)))
                    : "—"}
                  {safeData.length > 0 && (
                    <span className="text-sm font-normal text-white/60 ml-1">
                      m
                    </span>
                  )}
                </p>
              </div>
              <Radar className="hidden sm:block h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-green-500/30">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">Bán kính tối đa</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {safeData.length > 0
                    ? Math.max(...safeData.map((p) => Number(p.distance)))
                    : "—"}
                  {safeData.length > 0 && (
                    <span className="text-sm font-normal text-white/60 ml-1">
                      m
                    </span>
                  )}
                </p>
              </div>
              <Navigation className="hidden sm:block h-8 w-8 text-green-400" />
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
                placeholder="Tìm kiếm theo tên địa điểm..."
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
                Danh Sách Địa Điểm
              </CardTitle>
              <CardDescription className="text-white/60 text-xs sm:text-sm">
                {filtered.length} địa điểm
                {hasActiveFilters && ` / ${totalCount} tổng`}
              </CardDescription>
            </div>
            <Button
              onClick={openCreate}
              size="sm"
              className="hidden sm:flex bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" /> Thêm Địa Điểm
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
                      {/* Row 1: icon + name + distance badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 min-w-0">
                          <div className="h-8 w-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                            <MapPin className="h-4 w-4 text-blue-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-white text-sm leading-tight">
                              {item.name}
                            </p>
                            <p className="text-xs text-white/40 mt-0.5 font-mono">
                              {Number(item.lat).toFixed(6)},{" "}
                              {Number(item.long).toFixed(6)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-lg px-2 py-1 shrink-0">
                          <Radar className="h-3 w-3 text-green-400" />
                          <span className="text-green-300 text-xs font-medium">
                            {item.distance}m
                          </span>
                        </div>
                      </div>

                      {/* Row 2: actions */}
                      <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-white/5">
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
                  ))
                ) : (
                  <div className="text-center py-12 text-white/50 text-sm">
                    {hasActiveFilters
                      ? "Không tìm thấy địa điểm nào phù hợp"
                      : "Chưa có địa điểm nào"}
                  </div>
                )}
              </div>

              {/* Desktop: table */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-purple-500/30">
                      <TableHead className="text-white">Tên Địa Điểm</TableHead>
                      <TableHead className="text-white">Vĩ Độ (Lat)</TableHead>
                      <TableHead className="text-white">Kinh Độ (Long)</TableHead>
                      <TableHead className="text-white">Bán Kính</TableHead>
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
                              <div className="h-8 w-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                                <MapPin className="h-4 w-4 text-blue-400" />
                              </div>
                              <span className="text-white font-medium text-sm">
                                {item.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-white/80 text-sm font-mono">
                              {Number(item.lat).toFixed(6)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-white/80 text-sm font-mono">
                              {Number(item.long).toFixed(6)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-lg px-2.5 py-1 w-fit">
                              <Radar className="h-3.5 w-3.5 text-green-400" />
                              <span className="text-green-300 text-sm font-medium">
                                {item.distance}
                                <span className="text-green-400/60 text-xs ml-0.5">
                                  m
                                </span>
                              </span>
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
                          colSpan={5}
                          className="text-center py-8 text-white/60"
                        >
                          {hasActiveFilters
                            ? "Không tìm thấy địa điểm nào phù hợp với bộ lọc"
                            : "Chưa có địa điểm nào"}
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
        <DialogContent className="bg-black/90 border-purple-500/30 text-white w-[calc(100vw-2rem)] max-w-lg mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold text-white">
              {editingItem ? "Chỉnh Sửa Địa Điểm" : "Thêm Địa Điểm Mới"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-5">
            {/* Name */}
            <div>
              <Label htmlFor="place-name" className="text-white text-sm">
                Tên Địa Điểm *
              </Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                <Input
                  id="place-name"
                  placeholder="Nhập tên địa điểm..."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="pl-9 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 h-9 text-sm"
                />
              </div>
            </div>

            {/* Lat / Long */}
            <div className="space-y-3 border border-purple-500/20 rounded-xl p-3 sm:p-4 bg-purple-500/5">
              <p className="text-xs sm:text-sm font-semibold text-white/80 flex items-center gap-2">
                <Navigation className="h-4 w-4 text-purple-400" />
                Tọa Độ
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="lat" className="text-white/70 text-xs">
                    Vĩ Độ (Lat) *
                  </Label>
                  <Input
                    id="lat"
                    inputMode="decimal"
                    placeholder="10.748609..."
                    value={formData.lat}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lat: onlyDecimal(e.target.value),
                      })
                    }
                    className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/30 mt-1 h-9 text-sm font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="long" className="text-white/70 text-xs">
                    Kinh Độ (Long) *
                  </Label>
                  <Input
                    id="long"
                    inputMode="decimal"
                    placeholder="106.626514..."
                    value={formData.long}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        long: onlyDecimal(e.target.value),
                      })
                    }
                    className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/30 mt-1 h-9 text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Distance */}
            <div>
              <Label htmlFor="distance" className="text-white text-sm">
                Bán Kính Cho Phép *
              </Label>
              <div className="relative mt-1">
                <Radar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-400" />
                <Input
                  id="distance"
                  inputMode="numeric"
                  placeholder="50"
                  value={formData.distance}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      distance: onlyNumbers(e.target.value),
                    })
                  }
                  className="pl-9 pr-10 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 h-9 text-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 text-sm pointer-events-none">
                  m
                </span>
              </div>
              <p className="text-white/40 text-xs mt-1">
                Khoảng cách tối đa từ địa điểm để được phép chấm công
              </p>
            </div>

            {/* Preview */}
            {formData.lat && formData.long && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-sm">
                <MapPin className="h-4 w-4 text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm truncate">
                    {formData.name || "Địa điểm"}
                  </p>
                  <p className="text-white/50 text-xs font-mono">
                    {formData.lat}, {formData.long}
                    {formData.distance && (
                      <span className="text-green-400 ml-2">
                        · r = {formData.distance}m
                      </span>
                    )}
                  </p>
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
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Đang
                  lưu...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1.5" />
                  {editingItem ? "Cập Nhật" : "Tạo Địa Điểm"}
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
              Bạn có chắc chắn muốn xóa địa điểm{" "}
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