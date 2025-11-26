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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Search,
  FileText,
  Edit,
  Loader2,
  Trash2,
  Download,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { usePolicyData } from "@/src/hook/policyHook";
import { useDepartmentData } from "@/src/hook/departmentHook";
import {
  createPolicy,
  listPolicy,
  listPolicyType,
  updatePolicy,
} from "@/src/features/policy/policyApi";
import { listDepartment } from "@/src/features/department/departmentApi";
import Pagination from "@/components/pagination";

interface PolicyDocument {
  id: number;
  name: string;
  file_url: string;
}

interface PolicyDepartment {
  id: number;
  name: string;
}

interface PolicyType {
  id: number;
  name: string;
}

interface Policy {
  id: string;
  policy_type_id: number;
  status: boolean;
  created_at: string;
  updated_at: string;
  title: string;
  description?: string;
  policy_type: PolicyType;
  policy_departments: PolicyDepartment[];
  policy_documents: PolicyDocument[];
}

interface Department {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export default function PolicyPage() {
  const dispatch = useDispatch();
  const { policies, totalPolicy, policyTypes } = usePolicyData();
  const { departments, totalDepartment } = useDepartmentData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingPolicy, setDeletingPolicy] = useState<Policy | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    policy_type_id: "",
    department_ids: [] as number[],
    documents: [] as File[],
    status: true,
  });

  useEffect(() => {
    dispatch(listDepartment({ limit: totalDepartment, page: 1 } as any) as any);
    dispatch(listPolicyType() as any);
  }, [dispatch, totalDepartment]);

  useEffect(() => {
    dispatch(
      listPolicy({ limit: itemsPerPage, page: currentPage } as any) as any
    );
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreate = () => {
    setEditingPolicy(null);
    setFormData({
      title: "",
      description: "",
      policy_type_id: "",
      department_ids: [],
      documents: [],
      status: true,
    });
    setShowCreateModal(true);
  };

  const handleEdit = (policy: Policy) => {
    setEditingPolicy(policy);
    setFormData({
      title: policy.title,
      description: policy.description || "",
      policy_type_id: policy.policy_type_id.toString(),
      department_ids: policy?.policy_departments?.map((d) => d.id),
      documents: [],
      status: policy.status,
    });
    setShowCreateModal(true);
  };

  const handleDepartmentToggle = (departmentId: number) => {
    setFormData((prev) => ({
      ...prev,
      department_ids: prev.department_ids.includes(departmentId)
        ? prev.department_ids.filter((id) => id !== departmentId)
        : [...prev.department_ids, departmentId],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...fileArray],
      }));
    }
  };

  const handleRemoveFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề chính sách");
      return;
    }

    if (!formData.policy_type_id) {
      toast.error("Vui lòng chọn loại chính sách");
      return;
    }

    if (formData?.department_ids?.length === 0) {
      toast.error("Vui lòng chọn ít nhất một phòng ban");
      return;
    }

    setCreating(true);
    try {
      const apiFormData = new FormData();
      apiFormData.append("title", formData.title);
      apiFormData.append("description", formData.description);
      apiFormData.append("policy_type_id", formData.policy_type_id);
      apiFormData.append(
        "departments",
        JSON.stringify(formData.department_ids)
      );
      apiFormData.append("status", formData.status.toString());

      formData.documents.forEach((file) => {
        apiFormData.append("documents", file);
      });

      if (editingPolicy) {
        const res = await dispatch(
          updatePolicy({
            id: editingPolicy.id,
            data: apiFormData,
          } as any) as any
        );
        if (res.payload.status == 200 || res.payload.status == 201) {
          await dispatch(
            listPolicy({ limit: itemsPerPage, page: currentPage } as any) as any
          );
          toast.success(res.payload.data.message);
        }
      } else {
        const res = await dispatch(createPolicy(apiFormData as any) as any);
        if (res.payload.status == 200 || res.payload.status == 201) {
          await dispatch(
            listPolicy({ limit: itemsPerPage, page: currentPage } as any) as any
          );
          toast.success(res.payload.data.message);
        }
      }

      setShowCreateModal(false);
    } catch (error) {
      console.error("Error saving policy:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPolicy) return;

    console.log("Deleting policy:", deletingPolicy);
    setDeleting(true);
    try {
      toast.success("Xóa chính sách thành công!");
      setDeletingPolicy(null);
    } catch (error) {
      console.error("Error deleting policy:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setDeleting(false);
    }
  };

  // Filter policies (chỉ filter trên dữ liệu đã được phân trang từ server)
  const filteredPolicies = policies.filter((policy: Policy) => {
    const matchesSearch =
      policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (policy.description &&
        policy.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      selectedType === "all" ||
      policy.policy_type_id.toString() === selectedType;
    const matchesStatus = !showActiveOnly || policy.status;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Tính tổng số trang từ totalPolicy (tổng số từ server)
  const totalPages = Math.ceil(totalPolicy / itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, showActiveOnly]);

  // Calculate stats
  const activePolicies = policies.filter((p: Policy) => p.status).length;
  const policiesByType = policyTypes.map((type: PolicyType) => ({
    ...type,
    count: policies.filter((p: Policy) => p.policy_type_id === type.id).length,
  }));

  const getTypeColor = (typeId: number) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
    ];
    return colors[(typeId - 1) % colors.length];
  };

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Quản Lý Chính Sách
            </h1>
            <p className="text-white/80">
              Quản lý các chính sách và quy định trong tổ chức
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm Chính Sách
          </Button>
        </div>

        {/* Type breakdown */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">
              Phân Bố Theo Loại Chính Sách
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {policiesByType.map((type: any) => (
                <div key={type.id} className="text-center">
                  <Badge className={`${getTypeColor(type.id)} text-white mb-2`}>
                    {type.name}
                  </Badge>
                  <p className="text-2xl font-bold text-white">{type.count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm chính sách..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
                />
              </div>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-black/30 border-purple-500/30 text-white min-w-[200px]">
                  <SelectValue placeholder="Chọn loại chính sách" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  {policyTypes.map((type: PolicyType) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active-only"
                  checked={showActiveOnly}
                  onCheckedChange={(checked) =>
                    setShowActiveOnly(checked as boolean)
                  }
                />
                <Label htmlFor="active-only" className="text-white text-sm">
                  Chỉ hiển thị đang hoạt động
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Policies Table */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Danh Sách Chính Sách</CardTitle>
            <CardDescription className="text-white/80">
              Hiển thị {filteredPolicies.length} chính sách trên trang này -
              Tổng cộng {totalPolicy} chính sách
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-purple-500/30">
                  <TableHead className="text-white">Tiêu Đề</TableHead>
                  <TableHead className="text-white">Loại</TableHead>
                  <TableHead className="text-white">Phòng Ban</TableHead>
                  <TableHead className="text-white">Tài Liệu</TableHead>
                  <TableHead className="text-white">Trạng Thái</TableHead>
                  <TableHead className="text-white">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolicies.length > 0 ? (
                  filteredPolicies.map((policy: Policy) => (
                    <TableRow
                      key={policy.id}
                      className="border-b border-purple-500/30 hover:bg-white/5"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">
                            {policy.title}
                          </p>
                          {policy.description && (
                            <p className="text-sm text-white/60 mt-1">
                              {policy.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getTypeColor(
                            policy.policy_type_id
                          )} text-white`}
                        >
                          {policy.policy_type.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {policy?.policy_departments?.map((dept) => (
                            <Badge
                              key={dept.id}
                              className="bg-blue-600/20 text-blue-400 border-blue-500/30"
                            >
                              {dept.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {policy?.policy_documents?.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-purple-400" />
                            <span className="text-white text-sm">
                              {policy?.policy_documents?.length} tài liệu
                            </span>
                          </div>
                        ) : (
                          <span className="text-white/40 text-sm">
                            Không có
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            policy.status
                              ? "bg-green-600/20 text-green-400 border-green-500/30"
                              : "bg-red-600/20 text-red-400 border-red-500/30"
                          }
                        >
                          {policy.status ? "Hoạt động" : "Không hoạt động"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(policy)}
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-white/60"
                    >
                      Không tìm thấy chính sách nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalPolicy}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
            />
          </CardContent>
        </Card>

        {/* Create/Edit Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {editingPolicy ? "Chỉnh Sửa Chính Sách" : "Thêm Chính Sách Mới"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">
                  Tiêu Đề <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="bg-black/50 border-purple-500/30 text-white"
                  placeholder="VD: Quy trình tuyển dụng nội bộ"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white">
                  Mô Tả
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="bg-black/50 border-purple-500/30 text-white"
                  placeholder="Mô tả về chính sách này..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="policy_type" className="text-white">
                  Loại Chính Sách <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.policy_type_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, policy_type_id: value }))
                  }
                >
                  <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                    <SelectValue placeholder="Chọn loại chính sách" />
                  </SelectTrigger>
                  <SelectContent>
                    {policyTypes.map((type: PolicyType) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white mb-3 block">
                  Phòng Ban Áp Dụng <span className="text-red-400">*</span>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-black/30 p-4 rounded-lg border border-purple-500/30">
                  {departments.map((dept: Department) => (
                    <div key={dept.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dept-${dept.id}`}
                        checked={formData?.department_ids?.includes(dept.id)}
                        onCheckedChange={() => handleDepartmentToggle(dept.id)}
                      />
                      <Label
                        htmlFor={`dept-${dept.id}`}
                        className="text-white text-sm cursor-pointer"
                      >
                        {dept.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData?.department_ids?.length > 0 && (
                  <p className="text-sm text-white/60 mt-2">
                    Đã chọn {formData?.department_ids?.length} phòng ban
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="documents" className="text-white mb-3 block">
                  Tài Liệu Đính Kèm
                </Label>
                <div className="space-y-3">
                  <div className="relative">
                    <Input
                      id="documents"
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="bg-black/50 border-purple-500/30 text-white file:mr-4 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                    />
                  </div>

                  {formData.documents.length > 0 && (
                    <div className="bg-black/30 p-4 rounded-lg border border-purple-500/30 space-y-2">
                      <p className="text-white text-sm font-medium mb-2">
                        Đã chọn {formData.documents.length} tài liệu
                      </p>
                      {formData.documents.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-black/40 p-3 rounded-lg"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <FileText className="h-4 w-4 text-purple-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm truncate">
                                {file.name}
                              </p>
                              <p className="text-white/60 text-xs">
                                {(file.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {editingPolicy &&
                    editingPolicy?.policy_documents?.length > 0 && (
                      <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
                        <p className="text-blue-400 text-sm font-medium mb-2">
                          Tài liệu hiện có (
                          {editingPolicy?.policy_documents?.length})
                        </p>
                        {editingPolicy?.policy_documents?.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center gap-3 bg-black/40 p-3 rounded-lg mb-2"
                          >
                            <FileText className="h-4 w-4 text-blue-400" />
                            <p className="text-white text-sm flex-1 truncate">
                              {doc.name}
                            </p>
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          </div>
                        ))}
                        <p className="text-white/60 text-xs mt-2">
                          * Tài liệu mới sẽ được thêm vào danh sách hiện có
                        </p>
                      </div>
                    )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status"
                  checked={formData.status}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="status" className="text-white">
                  Hoạt động
                </Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="bg-transparent border-white/20 text-white hover:bg-white/10"
              >
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
                ) : editingPolicy ? (
                  "Cập nhật"
                ) : (
                  "Tạo mới"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog
          open={!!deletingPolicy}
          onOpenChange={() => setDeletingPolicy(null)}
        >
          <DialogContent className="bg-black/90 border-red-500/30 text-white">
            <DialogHeader>
              <DialogTitle className="text-red-400">Xác Nhận Xóa</DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <p className="text-white/80">
                Bạn có chắc chắn muốn xóa chính sách{" "}
                <strong className="text-white">
                  "{deletingPolicy?.title}"
                </strong>
                ?
              </p>
              <p className="text-red-400 text-sm mt-2">
                Hành động này không thể hoàn tác!
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setDeletingPolicy(null)}
                className="bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Hủy
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  "Xóa"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
