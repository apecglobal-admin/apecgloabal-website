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
  Plus,
  Search,
  Edit,
  Loader2,
  Trash2,
  X,
  FileText,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { useAttendanceData } from "@/src/hook/attendanceHook";
import { useDispatch } from "react-redux";
import {
  listPolicyAttendance,
  createPolicyAttendance,
  updatePolicyAttendance,
  deletePolicyAttendance,
} from "@/src/features/attendance/attendanceApi";
import Pagination from "@/components/pagination";

interface PolicyAttendance {
  id: string;
  name: string;
  description: string | null;
}

export default function PolicyAttendancePage() {
  const token = localStorage.getItem("cmsToken");
  const dispatch = useDispatch();
  const { policyAttendance } = useAttendanceData();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDebounce, setSearchDebounce] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<PolicyAttendance | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingPolicy, setDeletingPolicy] = useState<PolicyAttendance | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [showFilters, setShowFilters] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
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
    dispatch(listPolicyAttendance(token) as any).finally(() => setLoading(false));
  }, [dispatch]);

  const safePolicies = Array.isArray(policyAttendance) ? policyAttendance : [];

  const filteredPolicies = useMemo(() => {
    if (!searchDebounce.trim()) return safePolicies;
    return safePolicies.filter(
      (p) =>
        p.name.toLowerCase().includes(searchDebounce.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchDebounce.toLowerCase())
    );
  }, [safePolicies, searchDebounce]);

  const totalPages = Math.ceil(filteredPolicies.length / limit);
  const paginatedData = filteredPolicies.slice((page - 1) * limit, page * limit);
  const totalCount = safePolicies.length;
  const hasActiveFilters = searchTerm.trim() !== "";

  const clearFilters = () => {
    setSearchTerm("");
    setPage(1);
  };

  const handleCreate = () => {
    setEditingPolicy(null);
    setFormData({ name: "", description: "" });
    setShowCreateModal(true);
  };

  const handleEdit = (policy: PolicyAttendance) => {
    setEditingPolicy(policy);
    setFormData({
      name: policy.name,
      description: policy.description || "",
    });
    setShowCreateModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên chính sách");
      return;
    }
    setCreating(true);
    try {
      if (editingPolicy) {
        const res = await dispatch(
          updatePolicyAttendance({
            token,
            id: editingPolicy.id,
            name: formData.name.trim(),
            description: formData.description.trim(),
          }) as any
        );
        if (res.payload.status === 200 || res.payload.status === 201) {
          toast.success(res.payload.data.message);
          setShowCreateModal(false);
        }
      } else {
        const res = await dispatch(
          createPolicyAttendance({
            token,
            name: formData.name.trim(),
            description: formData.description.trim(),
          }) as any
        );
        if (res.payload.status === 200 || res.payload.status === 201) {
          toast.success(res.payload.data.message);
          setShowCreateModal(false);
        }
      }
      await dispatch(listPolicyAttendance(token) as any);
    } catch {
      toast.error("Lỗi kết nối server");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPolicy) return;
    setDeleting(true);
    try {
      const res = await dispatch(
        deletePolicyAttendance({ token, id: deletingPolicy.id }) as any
      );
      if (res.payload.status === 200 || res.payload.status === 201) {
        setDeletingPolicy(null);
        await dispatch(listPolicyAttendance(token) as any);
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
            Quản Lý Chính Sách Công
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-0.5">
            Quản lý các chính sách chấm công và nghỉ phép
          </p>
        </div>
        <Button
          onClick={handleCreate}
          size="sm"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shrink-0 h-9 px-3"
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Thêm Chính Sách</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6">
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">Tổng Chính Sách</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {totalCount}
                </p>
              </div>
              <ClipboardList className="hidden sm:block h-8 w-8 text-purple-400" />
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
                placeholder="Tìm kiếm chính sách..."
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
              className={`sm:hidden shrink-0 h-9 px-3 border-purple-500/30 text-white/70 bg-black/30 hover:bg-white/10 ${hasActiveFilters ? "border-purple-400 text-purple-300" : ""}`}
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
                Danh Sách Chính Sách
              </CardTitle>
              <CardDescription className="text-white/60 text-xs sm:text-sm">
                {paginatedData.length} chính sách
                {hasActiveFilters && ` / ${totalCount} tổng`}
              </CardDescription>
            </div>
            <Button
              onClick={handleCreate}
              size="sm"
              className="hidden sm:flex bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" /> Thêm Chính Sách
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
                  paginatedData.map((policy) => (
                    <div
                      key={policy.id}
                      className="bg-white/5 border border-purple-500/20 rounded-xl p-3 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 min-w-0">
                          <FileText className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-semibold text-white text-sm leading-tight">
                              {policy.name}
                            </p>
                            {policy.description && (
                              <p className="text-xs text-white/50 mt-0.5 line-clamp-2">
                                {policy.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(policy)}
                            className="h-7 w-7 p-0 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingPolicy(policy)}
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
                      ? "Không tìm thấy chính sách nào phù hợp"
                      : "Chưa có chính sách nào"}
                  </div>
                )}
              </div>

              {/* Desktop: table */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-purple-500/30">
                      <TableHead className="text-white">Tên Chính Sách</TableHead>
                      <TableHead className="text-white">Mô Tả</TableHead>
                      <TableHead className="text-white">Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((policy) => (
                        <TableRow
                          key={policy.id}
                          className="border-b border-purple-500/30 hover:bg-white/5"
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-purple-400 shrink-0" />
                              <p className="font-medium text-white">{policy.name}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-white/60 max-w-xs line-clamp-2">
                              {policy.description || "Không có mô tả"}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(policy)}
                                className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeletingPolicy(policy)}
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
                            ? "Không tìm thấy chính sách nào phù hợp với bộ lọc"
                            : "Không tìm thấy chính sách nào"}
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
              totalItems={filteredPolicies.length}
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
              {editingPolicy ? "Chỉnh Sửa Chính Sách" : "Thêm Chính Sách Mới"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-5">
            <div>
              <Label htmlFor="name" className="text-white text-sm">
                Tên Chính Sách *
              </Label>
              <Input
                id="name"
                placeholder="Nhập tên chính sách..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 mt-1 h-9 text-sm"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-white text-sm">
                Mô Tả
              </Label>
              <Textarea
                id="description"
                placeholder="Mô tả chính sách này..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 mt-1 text-sm"
                rows={3}
              />
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
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Đang lưu...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1.5" />
                  {editingPolicy ? "Cập Nhật" : "Tạo Chính Sách"}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingPolicy} onOpenChange={() => setDeletingPolicy(null)}>
        <DialogContent className="bg-black/90 border-red-500/30 text-white w-[calc(100vw-2rem)] max-w-md mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              Xác Nhận Xóa
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-white/80 text-sm">
              Bạn có chắc chắn muốn xóa chính sách{" "}
              <span className="text-white font-semibold">
                "{deletingPolicy?.name}"
              </span>
              ? Hành động này không thể hoàn tác.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-700/50">
              <Button
                variant="outline"
                onClick={() => setDeletingPolicy(null)}
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
                        <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Đang xóa...
                    </>
                ) : (
                    <>
                        <Trash2 className="h-4 w-4 mr-1.5" /> Xóa Chính Sách
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