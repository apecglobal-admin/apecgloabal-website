"use client";

import { useState, useEffect, useMemo } from "react";
import InternalLayout from "@/components/cms-layout";
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
import {
  Plus,
  Search,
  Users,
  Building2,
  Edit,
  Loader2,
  Briefcase,
  DollarSign,
  Trash2,
  Filter,
  X,
  CheckCircle2,
  Circle,
  UserCheck,
  UserX,
} from "lucide-react";
import { toast } from "sonner";
import { useDepartmentData } from "@/src/hook/departmentHook";
import { useDispatch } from "react-redux";
import {
  createDepartment,
  deleteDepartments,
  listDepartment,
  updateDepartment,
} from "@/src/features/department/departmentApi";
import Pagination from "@/components/pagination";
import { useEmployeeData } from "@/src/hook/employeeHook";
import { listManager } from "@/src/features/employee/employeeApi";

interface Manager {
  id: number | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
}

interface Department {
  id: number;
  name: string;
  description: string;
  manager: Manager;
  created_at: string;
}

export default function DepartmentsManagementContent() {
  const dispatch = useDispatch();
  const { departments, totalDepartment } = useDepartmentData();
  const { managers } = useEmployeeData();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "with-manager" | "without-manager">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [creating, setCreating] = useState(false);
  const [deletingDepartment, setDeletingDepartment] =
    useState<Department | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);

  // Search state for manager selection
  const [managerSearchQuery, setManagerSearchQuery] = useState("");
  const [showOnlySelectedManager, setShowOnlySelectedManager] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    manager_id: "",
  });

  useEffect(() => {
    dispatch(listManager() as any);
  }, [dispatch]);

  useEffect(() => {
    setLoading(true);
    dispatch(listDepartment({ limit, page } as any) as any).finally(() =>
      setLoading(false)
    );
  }, [dispatch, page, limit]);

  const totalPages = Math.ceil((totalDepartment || 0) / limit);

  const handleCreate = () => {
    setEditingDepartment(null);
    setFormData({
      name: "",
      description: "",
      manager_id: "",
    });
    setManagerSearchQuery("");
    setShowOnlySelectedManager(false);
    setShowCreateModal(true);
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || "",
      manager_id: department.manager?.id?.toString() || "",
    });
    setManagerSearchQuery("");
    setShowOnlySelectedManager(false);
    setShowCreateModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên phòng ban");
      return;
    }

    setCreating(true);
    try {
      if (editingDepartment) {
        const res = await dispatch(
          updateDepartment({
            id: editingDepartment.id,
            name: formData.name.trim() as any,
            description: formData.description.trim() as any,
            manager_id: formData.manager_id,
          }) as any
        );
        if (res.payload.status == 200 || res.payload.status == 201) {
          toast.success(res.payload.data.message);
          setShowCreateModal(false);
        }
      } else {
        const res = await dispatch(
          createDepartment({
            name: formData.name.trim() as any,
            description: formData.description.trim() as any,
            manager_id: formData.manager_id,
          }) as any
        );
        if (res.payload.status == 200 || res.payload.status == 201) {
          toast.success(res.payload.data.message);
          setShowCreateModal(false);
        }
      }
      await dispatch(listDepartment({ limit, page } as any) as any);
    } catch (error) {
      console.error("Error saving department:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingDepartment) return;

    setDeleting(true);
    try {
      const ids = [deletingDepartment.id];
      const res = await dispatch(deleteDepartments(ids as any) as any);

      if (res.payload.status == 200 || res.payload.status == 201) {
        setDeletingDepartment(null);
        dispatch(listDepartment({ limit, page } as any) as any);
        toast.success(res.payload.data.message);
      } else {
        toast.error("Lỗi: " + res.error);
      }
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setDeleting(false);
    }
  };

  // Ensure departments is always an array
  const safeDepartments = Array.isArray(departments) ? departments : [];

  // Filter departments with useMemo
  const filteredDepartments = useMemo(() => {
    let result = safeDepartments;

    // Search filter
    if (searchTerm.trim()) {
      result = result.filter((department) => {
        const matchesSearch =
          department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (department.description &&
            department.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (department.manager?.name &&
            department.manager.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()));

        return matchesSearch;
      });
    }

    // Status filter
    if (filterStatus === "with-manager") {
      result = result.filter((d) => d.manager?.id !== null);
    } else if (filterStatus === "without-manager") {
      result = result.filter((d) => d.manager?.id === null);
    }

    return result;
  }, [safeDepartments, searchTerm, filterStatus]);

  // Filter managers for selection with search
  const filteredManagers = useMemo(() => {
    let result = Array.isArray(managers) ? managers : [];

    // Search filter
    if (managerSearchQuery.trim()) {
      result = result.filter(
        (manager) =>
          manager.name.toLowerCase().includes(managerSearchQuery.toLowerCase()) ||
          manager.email.toLowerCase().includes(managerSearchQuery.toLowerCase()) ||
          (manager.phone && manager.phone.includes(managerSearchQuery))
      );
    }

    // Selection filter
    if (showOnlySelectedManager && formData.manager_id) {
      result = result.filter(
        (manager) => manager.id.toString() === formData.manager_id
      );
    }

    return result;
  }, [managers, managerSearchQuery, showOnlySelectedManager, formData.manager_id]);

  // Calculate stats
  const totalDepartments = totalDepartment || 0;
  const departmentsWithManagers = safeDepartments.filter(
    (d) => d.manager?.id !== null
  ).length;

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
  };

  const hasActiveFilters = searchTerm.trim() !== "" || filterStatus !== "all";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <span className="ml-2 text-white">Đang tải phòng ban...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Quản Lý Phòng Ban
          </h1>
          <p className="text-white/80">
            Quản lý thông tin phòng ban của tất cả các công ty
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Tổng Phòng Ban</p>
                <p className="text-2xl font-bold text-white">
                  {totalDepartments}
                </p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Có Trưởng Phòng</p>
                <p className="text-2xl font-bold text-white">
                  {departmentsWithManagers}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Chưa Có Trưởng Phòng</p>
                <p className="text-2xl font-bold text-white">
                  {totalDepartments - departmentsWithManagers}
                </p>
              </div>
              <UserX className="h-8 w-8 text-orange-400" />
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
                placeholder="Tìm kiếm phòng ban, mô tả, trưởng phòng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
              />
            </div>

            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-full md:w-[240px] bg-black/30 border-purple-500/30 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Trạng thái trưởng phòng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phòng ban</SelectItem>
                <SelectItem value="with-manager">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-green-400" />
                    Có trưởng phòng
                  </div>
                </SelectItem>
                <SelectItem value="without-manager">
                  <div className="flex items-center gap-2">
                    <UserX className="h-4 w-4 text-orange-400" />
                    Chưa có trưởng phòng
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

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

      {/* Departments Table */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Danh Sách Phòng Ban</CardTitle>
              <CardDescription className="text-white/80">
                Hiển thị {filteredDepartments.length} phòng ban
                {hasActiveFilters && ` (đã lọc từ ${totalDepartments})`}
              </CardDescription>
            </div>
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm Phòng Ban
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-purple-500/30">
                <TableHead className="text-white">Phòng Ban</TableHead>
                <TableHead className="text-white">Trưởng Phòng</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Ngày Tạo</TableHead>
                <TableHead className="text-white">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((department) => (
                  <TableRow
                    key={department.id}
                    className="border-b border-purple-500/30 hover:bg-white/5"
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">
                          {department.name}
                        </p>
                        <p className="text-sm text-white/60">
                          {department.description || "Không có mô tả"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {department.manager?.id ? (
                        <div className="flex items-center gap-2">
                          {department.manager.avatar_url ? (
                            <img
                              src={department.manager.avatar_url}
                              alt={department.manager.name || ""}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                              <span className="text-white text-sm font-semibold">
                                {department.manager.name?.charAt(0) || "?"}
                              </span>
                            </div>
                          )}
                          <span className="text-white/80">
                            {department.manager.name}
                          </span>
                        </div>
                      ) : (
                        <Badge className="bg-gray-600/20 text-gray-400 border-gray-500/30">
                          Chưa phân công
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-white/60">
                      {department.manager?.email || "—"}
                    </TableCell>
                    <TableCell className="text-white/60">
                      {new Date(department.created_at).toLocaleDateString(
                        "vi-VN"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(department)}
                          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingDepartment(department)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50"
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
                      ? "Không tìm thấy phòng ban nào phù hợp với bộ lọc"
                      : "Không tìm thấy phòng ban nào"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Pagination */}
        <div className="px-6 pb-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalDepartment}
            onPageChange={setPage}
            maxVisiblePages={5}
            itemsPerPage={limit}
          />
        </div>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              {editingDepartment ? "Chỉnh Sửa Phòng Ban" : "Thêm Phòng Ban Mới"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Department Info */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-white">
                  Tên Phòng Ban *
                </Label>
                <Input
                  id="name"
                  placeholder="Nhập tên phòng ban..."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white">
                  Mô Tả
                </Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả chức năng và nhiệm vụ của phòng ban..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 mt-1"
                  rows={5}
                />
              </div>
            </div>

            {/* Right Column - Manager Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="manager_id" className="text-white font-semibold">
                  Trưởng Phòng
                </Label>
                {formData.manager_id && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setFormData({ ...formData, manager_id: "" })}
                    className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Bỏ chọn
                  </Button>
                )}
              </div>

              {/* Search and Filter for Managers */}
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={managerSearchQuery}
                    onChange={(e) => setManagerSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm trưởng phòng (tên, email, SĐT)..."
                    className="bg-black/30 border-purple-500/30 text-white pl-10 h-9"
                  />
                </div>
                {formData.manager_id && (
                  <Button
                    type="button"
                    size="sm"
                    variant={showOnlySelectedManager ? "default" : "outline"}
                    onClick={() =>
                      setShowOnlySelectedManager(!showOnlySelectedManager)
                    }
                    className={`h-9 ${
                      showOnlySelectedManager
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "bg-transparent border-purple-500/30 text-white hover:bg-purple-500/10"
                    }`}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Managers List */}
              <div className="bg-black/30 border border-purple-500/30 rounded-lg p-2 max-h-[400px] overflow-y-auto">
                {filteredManagers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-gray-400 text-sm">
                    <Users className="h-8 w-8 mb-2 text-gray-500" />
                    {managerSearchQuery || showOnlySelectedManager
                      ? "Không tìm thấy trưởng phòng"
                      : "Không có nhân viên nào"}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {/* Option for no manager */}
                    <div
                      onClick={() =>
                        setFormData({ ...formData, manager_id: "" })
                      }
                      className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg transition-all ${
                        formData.manager_id === ""
                          ? "bg-gray-500/20 border border-gray-500/50"
                          : "hover:bg-gray-500/10 border border-transparent"
                      }`}
                    >
                      {formData.manager_id === "" ? (
                        <CheckCircle2 className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      )}
                      <UserX className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span
                        className={`text-sm ${
                          formData.manager_id === ""
                            ? "text-white font-medium"
                            : "text-gray-400"
                        }`}
                      >
                        Chưa phân công trưởng phòng
                      </span>
                    </div>

                    {/* Manager options */}
                    {filteredManagers.map((manager) => {
                      const isSelected =
                        formData.manager_id === manager.id.toString();
                      return (
                        <div
                          key={manager.id}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              manager_id: manager.id.toString(),
                            })
                          }
                          className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg transition-all ${
                            isSelected
                              ? "bg-purple-500/20 border border-purple-500/50"
                              : "hover:bg-purple-500/10 border border-transparent"
                          }`}
                        >
                          {isSelected ? (
                            <CheckCircle2 className="h-5 w-5 text-purple-400 flex-shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          )}
                          {manager.avatar_url ? (
                            <img
                              src={manager.avatar_url}
                              alt={manager.name}
                              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-semibold text-sm">
                                {manager.name?.charAt(0) || "?"}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm ${
                                isSelected
                                  ? "text-white font-medium"
                                  : "text-gray-300"
                              }`}
                            >
                              {manager.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {manager.email}
                            </p>
                            {manager.phone && (
                              <p className="text-xs text-gray-600">
                                {manager.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <p className="text-xs text-white/50">
                Chọn trưởng phòng từ danh sách nhân viên hoặc để trống nếu chưa
                phân công
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700/50">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              className="bg-transparent border-2 border-gray-500/50 text-white hover:bg-gray-500/20"
            >
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              disabled={creating}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {editingDepartment ? "Cập Nhật" : "Tạo Phòng Ban"}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingDepartment}
        onOpenChange={() => setDeletingDepartment(null)}
      >
        <DialogContent className="bg-black/90 border-red-500/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Xác Nhận Xóa Phòng Ban
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-white/80">
              Bạn có chắc chắn muốn xóa phòng ban{" "}
              <span className="font-semibold text-red-400">
                {deletingDepartment?.name}
              </span>{" "}
              không?
            </p>
            <p className="text-sm text-red-400">
              ⚠️ Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên
              quan.
            </p>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setDeletingDepartment(null)}
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
                    Xóa Phòng Ban
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