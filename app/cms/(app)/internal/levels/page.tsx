"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Plus,
  Search,
  Edit,
  Loader2,
  Trash2,
  X,
  TrendingUp,
  Award,
  ArrowRight,
  Target,
  Users,
  Crown,
} from "lucide-react";
import { toast } from "sonner";
import { useLevelData } from "@/src/hook/levelHook";
import {
  createLevel,
  deleteLevel,
  listLevels,
  listOptionLevels,
  updateLevel,
} from "@/src/features/levels/levelApi";
import { useDispatch } from "react-redux";
import Pagination from "@/components/pagination";

interface Level {
  id: number;
  name: string;
  next_level: {
    id: number | null;
    name: string | null;
  };
}

interface OptionLevel {
  id: number;
  name: string;
}

export default function LevelPage() {
  const dispatch = useDispatch();
  const { levels, totalLevels, optionLevels } = useLevelData();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingLevel, setEditingLevel] = useState<Level | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingLevel, setDeletingLevel] = useState<Level | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounce search
  const [searchDebounce, setSearchDebounce] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    next_level: null as number | null,
  });

  // Debounce effect for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch levels when filters change
  useEffect(() => {
    setLoading(true);
    const params: any = {
      limit: itemsPerPage,
      page: currentPage,
      search: searchDebounce.trim() || "",
    };

    dispatch(listLevels(params as any) as any).finally(() => setLoading(false));
    dispatch(listOptionLevels() as any);
  }, [dispatch, currentPage, searchDebounce]);

  const handleCreate = () => {
    setEditingLevel(null);
    setFormData({
      name: "",
      next_level: null,
    });
    setShowCreateModal(true);
  };

  const handleEdit = (level: Level) => {
    setEditingLevel(level);
    setFormData({
      name: level.name,
      next_level: level.next_level?.id || null,
    });
    setShowCreateModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên cấp bậc");
      return;
    }

    setCreating(true);
    try {
      if (editingLevel) {
        const res = await dispatch(
          updateLevel({
            id: editingLevel.id,
            name: formData.name,
            next_level: "", // Send empty string instead of null
          } as any) as any
        );
        if (res.payload.status == 200 || res.payload.status == 201) {
          setShowCreateModal(false);

          // Re-fetch with current filters
          const params: any = {
            limit: itemsPerPage,
            page: currentPage,
            search: searchDebounce.trim() || "",
          };
          dispatch(listLevels(params as any) as any);
          toast.success(res.payload.data.message || "Cập nhật cấp bậc thành công!");
        }
      } else {
        const res = await dispatch(
          createLevel({
            name: formData.name,
            next_level: "", // Send empty string instead of null
          } as any) as any
        );
        if (res.payload.status == 200 || res.payload.status == 201) {
          setShowCreateModal(false);

          // Re-fetch with current filters
          const params: any = {
            limit: itemsPerPage,
            page: currentPage,
            search: searchDebounce.trim() || "",
          };
          dispatch(listLevels(params as any) as any);
          toast.success(res.payload.data.message || "Tạo cấp bậc thành công!");
        }
      }
    } catch (error) {
      console.error("Error saving level:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingLevel) return;

    setDeleting(true);
    try {
      const res = await dispatch(deleteLevel([deletingLevel.id] as any) as any);
      if (res.payload.status == 200 || res.payload.status == 201) {
        setDeletingLevel(null);

        // Re-fetch with current filters
        const params: any = {
          limit: itemsPerPage,
          page: currentPage,
          search: searchDebounce.trim() || "",
        };
        dispatch(listLevels(params as any) as any);
        toast.success("Xóa cấp bậc thành công!");
      }
    } catch (error) {
      console.error("Error deleting level:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setDeleting(false);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm.trim() !== "";

  // Pagination info
  const totalItems = totalLevels || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Safe levels array
  const safeLevels = Array.isArray(levels) ? levels : [];
  const safeOptionLevels = Array.isArray(optionLevels) ? optionLevels : [];

  // Calculate stats
  const totalLevelsCount = totalItems;
  const levelsWithNext = safeLevels.filter((l: any) => l.next_level?.id !== null).length;
  const levelsWithoutNext = totalLevelsCount - levelsWithNext;

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Quản Lý Cấp Bậc
          </h1>
          <p className="text-white/80">
            Quản lý các cấp bậc và lộ trình thăng tiến trong tổ chức
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-black/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Tổng Cấp Bậc</p>
                  <p className="text-2xl font-bold text-white">
                    {totalLevelsCount}
                  </p>
                </div>
                <Award className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Có Lộ Trình Thăng Tiến</p>
                  <p className="text-2xl font-bold text-white">
                    {levelsWithNext}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Cấp Bậc Cao Nhất</p>
                  <p className="text-2xl font-bold text-white">
                    {levelsWithoutNext}
                  </p>
                </div>
                <Crown className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm cấp bậc..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
                />
              </div>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Levels Table */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-white">Danh Sách Cấp Bậc</CardTitle>
                <CardDescription className="text-white/80">
                  Hiển thị {safeLevels.length} cấp bậc
                  {hasActiveFilters && ` (đã lọc từ ${totalLevelsCount})`}
                </CardDescription>
              </div>
              <Button
                onClick={handleCreate}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm Cấp Bậc
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
                <span className="ml-2 text-white">Đang tải cấp bậc...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-purple-500/30">
                    <TableHead className="text-white">Cấp Bậc</TableHead>
                    <TableHead className="text-white">Lộ Trình Thăng Tiến</TableHead>
                    <TableHead className="text-white">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {safeLevels.length > 0 ? (
                    safeLevels.map((level: any) => {
                      return (
                        <TableRow
                          key={level.id}
                          className="border-b border-purple-500/30 hover:bg-white/5"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                                <Award className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-white">
                                  {level.name}
                                </p>
                                <p className="text-xs text-white/60">
                                  ID: {level.id}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            {level.next_level?.id ? (
                              <div className="flex items-center gap-2">
                                <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                                  {level.next_level.name}
                                </Badge>
                                <ArrowRight className="h-4 w-4 text-green-400" />
                              </div>
                            ) : (
                              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/50">
                                Cấp bậc cao nhất
                              </Badge>
                            )}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(level)}
                                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeletingLevel(level)}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50"
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
                        colSpan={3}
                        className="text-center py-8 text-white/60"
                      >
                        {hasActiveFilters
                          ? "Không tìm thấy cấp bậc nào phù hợp với bộ lọc"
                          : "Không tìm thấy cấp bậc nào"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {editingLevel ? "Chỉnh Sửa Cấp Bậc" : "Thêm Cấp Bậc Mới"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">
                  Tên Cấp Bậc <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="bg-black/50 border-purple-500/30 text-white mt-1"
                  placeholder="VD: Trưởng nhóm, Quản lý, Giám đốc..."
                />
              </div>

              {/* <div>
                <Label htmlFor="next_level" className="text-white">
                  Cấp Bậc Tiếp Theo (Lộ Trình Thăng Tiến)
                </Label>
                <Select
                  value={formData.next_level?.toString() || "none"}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      next_level: value === "none" ? null : parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger className="w-full bg-black/50 border-purple-500/30 text-white mt-1">
                    <SelectValue placeholder="Chọn cấp bậc tiếp theo" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-purple-500/30 text-white">
                    <SelectItem value="none" className="text-white/60">
                      Không có (Cấp bậc cao nhất)
                    </SelectItem>
                    {safeOptionLevels
                      .filter((option: OptionLevel) => option.id !== editingLevel?.id)
                      .map((option: OptionLevel) => (
                        <SelectItem
                          key={option.id}
                          value={option.id.toString()}
                          className="text-white hover:bg-white/10"
                        >
                          {option.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-white/50 mt-1">
                  Chọn cấp bậc tiếp theo trong lộ trình thăng tiến. Để trống nếu đây là cấp bậc cao nhất.
                </p>
              </div> */}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                disabled={creating}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    {editingLevel ? "Cập nhật" : "Tạo mới"}
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog
          open={!!deletingLevel}
          onOpenChange={() => setDeletingLevel(null)}
        >
          <DialogContent className="bg-black/90 border-red-500/30 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                Xác Nhận Xóa Cấp Bậc
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-white/80">
                Bạn có chắc chắn muốn xóa cấp bậc{" "}
                <span className="font-semibold text-red-400">
                  "{deletingLevel?.name}"
                </span>{" "}
                không?
              </p>
              <p className="text-sm text-red-400">
                ⚠️ Hành động này không thể hoàn tác và có thể ảnh hưởng đến dữ
                liệu nhân viên liên quan.
              </p>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setDeletingLevel(null)}
                  className="bg-transparent border-2 border-gray-500/50 text-white hover:bg-gray-500/20"
                  disabled={deleting}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang xóa...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa Cấp Bậc
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}