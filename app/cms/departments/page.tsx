"use client";

import { useState, useEffect } from "react";
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
  Plus,
  Search,
  Users,
  Building2,
  Edit,
  Loader2,
  Briefcase,
  DollarSign,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useDepartmentData } from "@/src/hook/departmentHook";
import { useDispatch } from "react-redux";
import { createDepartment, deleteDepartments, listDepartment, updateDepartment } from "@/src/features/department/departmentApi";
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

function DepartmentsManagementContent() {
  const dispatch = useDispatch();
  const { departments, total } = useDepartmentData();
  const { managers } = useEmployeeData();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    manager_id: "",
  });

  useEffect(() => {
    dispatch(listManager() as any);
  }, [dispatch]);

  console.log(managers)

  useEffect(() => {
    setLoading(true);
    dispatch(listDepartment({ limit, page } as any) as any).finally(() =>
      setLoading(false)
    );
  }, [dispatch, page, limit]);

  const totalPages = Math.ceil((total || 0) / limit);

  const handleCreate = () => {
    setEditingDepartment(null);
    setFormData({
      name: "",
      description: "",
      manager_id: "",
    });
    setShowCreateModal(true);
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || "",
      manager_id: department.manager?.id?.toString() || "",
    });
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
        const res = await dispatch(updateDepartment({id: editingDepartment.id, name: formData.name.trim() as any, description: formData.description.trim() as any, manager_id: formData.manager_id}) as any)
        if(res.payload.status == 200 || res.payload.status == 201){
          toast.success(res.payload.data.message);
          setShowCreateModal(false);
        }
      } else {
        const res = await dispatch(createDepartment({name: formData.name.trim() as any, description: formData.description.trim() as any, manager_id: formData.manager_id})as any)
        if(res.payload.status == 200 || res.payload.status == 201){
          toast.success(res.payload.data.message);
          setShowCreateModal(false);
        }
      }
      await dispatch(listDepartment({ limit, page } as any) as any)
      
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
      console.log("Deleting department with ids:", ids);
      const res = await dispatch(deleteDepartments(ids as any) as any);

      if (res.payload.status == 200 ||res.payload.status == 201 ) {
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

  // Filter departments
  const filteredDepartments = safeDepartments.filter((department) => {
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

  // Calculate stats
  const totalDepartments = total || 0;
  const departmentsWithManagers = safeDepartments.filter(
    (d) => d.manager?.id !== null
  ).length;

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
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm Phòng Ban
        </Button>
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
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Chưa Có Trưởng Phòng</p>
                <p className="text-2xl font-bold text-white">
                  {totalDepartments - departmentsWithManagers}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-blue-400" />
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
          </div>
        </CardContent>
      </Card>

      {/* Departments Table */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Danh Sách Phòng Ban</CardTitle>
          <CardDescription className="text-white/80">
            Hiển thị {filteredDepartments.length} phòng ban
          </CardDescription>
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
                              className="w-8 h-8 rounded-full"
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
                    Không tìm thấy phòng ban nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 pb-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={total}
              onPageChange={setPage}
              maxVisiblePages={5}
              itemsPerPage={limit}
            />
          </div>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              {editingDepartment ? "Chỉnh Sửa Phòng Ban" : "Thêm Phòng Ban Mới"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
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
                className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
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
                className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="manager_id" className="text-white">
                Trưởng Phòng
              </Label>
              <div className="relative">
                <select
                  id="manager_id"
                  value={formData.manager_id}
                  onChange={(e) =>
                    setFormData({ ...formData, manager_id: e.target.value })
                  }
                  className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-slate-800 text-white">
                    -- Chưa phân công --
                  </option>
                  {Array.isArray(managers) && managers.length > 0 ? (
                    managers.map((manager) => (
                      <option 
                        key={manager.id} 
                        value={manager.id}
                        className="bg-slate-800 text-white py-2"
                      >
                        {manager.name} - {manager.email}
                        {manager.phone ? ` - ${manager.phone}` : ''}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled className="bg-slate-800 text-white/50">
                      Không có nhân viên nào
                    </option>
                  )}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Preview selected manager */}
              {formData.manager_id && Array.isArray(managers) && managers.length > 0 && (
                <div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  {(() => {
                    const selectedManager = managers.find(m => m.id.toString() === formData.manager_id);
                    if (!selectedManager) return null;
                    
                    return (
                      <div className="flex items-center gap-3">
                        {selectedManager.avatar_url ? (
                          <img
                            src={selectedManager.avatar_url}
                            alt={selectedManager.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {selectedManager.name?.charAt(0) || "?"}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-white font-medium">{selectedManager.name}</p>
                          <p className="text-white/60 text-sm">{selectedManager.email}</p>
                          {selectedManager.phone && (
                            <p className="text-white/50 text-xs">{selectedManager.phone}</p>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
              
              <p className="text-xs text-white/50 mt-2">
                Chọn trưởng phòng từ danh sách nhân viên
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="bg-transparent border-2 border-gray-500/50 text-white hover:bg-gray-500/20"
              >
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

export default function DepartmentsManagementPage() {
  return (
    <InternalLayout>
      <DepartmentsManagementContent />
    </InternalLayout>
  );
}
