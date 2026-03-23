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
  ClipboardList,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { usePayrollData } from "@/src/hook/payrollHook";
import { useDispatch } from "react-redux";
import {
  listContractPayroll,
  createContractPayroll,
  updateContractPayroll,
  deleteContractPayroll,
} from "@/src/features/payroll/payrollApi";
import Pagination from "@/components/pagination";

interface ContractType {
  id: string;
  name: string;
  active: boolean;
  is_insurance: boolean;
}

export default function ContractPayrollPage() {
  const token = localStorage.getItem("cmsToken");
  const dispatch = useDispatch();
  const { contracts } = usePayrollData();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingContract, setEditingContract] = useState<ContractType | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingContract, setDeletingContract] = useState<ContractType | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [searchDebounce, setSearchDebounce] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [togglingActiveId, setTogglingActiveId] = useState<string | null>(null);
  const [togglingInsuranceId, setTogglingInsuranceId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setLoading(true);
    dispatch(listContractPayroll(token) as any).finally(() => setLoading(false));
  }, [dispatch]);

  const safeContracts = Array.isArray(contracts) ? contracts : [];

  const filteredContracts = useMemo(() => {
    let result = safeContracts;
    if (searchDebounce.trim()) {
      result = result.filter((c) =>
        c.name.toLowerCase().includes(searchDebounce.toLowerCase())
      );
    }
    if (filterStatus === "active") result = result.filter((c) => c.active);
    if (filterStatus === "inactive") result = result.filter((c) => !c.active);
    return result;
  }, [safeContracts, searchDebounce, filterStatus]);

  const totalPages = Math.ceil(filteredContracts.length / limit);
  const paginatedData = filteredContracts.slice((page - 1) * limit, page * limit);

  const totalCount = safeContracts.length;
  const activeCount = safeContracts.filter((c) => c.active).length;
  const inactiveCount = totalCount - activeCount;

  const hasActiveFilters = searchTerm.trim() !== "" || filterStatus !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setPage(1);
  };

  const handleCreate = () => {
    setEditingContract(null);
    setFormData({ name: "" });
    setShowCreateModal(true);
  };

  const handleEdit = (contract: ContractType) => {
    setEditingContract(contract);
    setFormData({ name: contract.name });
    setShowCreateModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên loại hợp đồng");
      return;
    }
    setCreating(true);
    try {
      if (editingContract) {
        const res = await dispatch(
          updateContractPayroll({
            token,
            id: editingContract.id,
            name: formData.name.trim(),
          }) as any
        );
        if (res.payload.status === 200 || res.payload.status === 201) {
          toast.success(res.payload.data.message);
          setShowCreateModal(false);
        }
      } else {
        const res = await dispatch(
          createContractPayroll({
            token,
            name: formData.name.trim(),
            is_insurance: false,
          }) as any
        );
        if (res.payload.status === 200 || res.payload.status === 201) {
          toast.success(res.payload.data.message);
          setShowCreateModal(false);
        }
      }
      await dispatch(listContractPayroll(token) as any);
    } catch {
      toast.error("Lỗi kết nối server");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (contract: ContractType) => {
    setTogglingActiveId(contract.id);
    try {
      const res = await dispatch(
        updateContractPayroll({
          token,
          id: contract.id,
          active: !contract.active,
        }) as any
      );
      if (res.payload.status === 200 || res.payload.status === 201) {
        toast.success(res.payload.data.message);
        await dispatch(listContractPayroll(token) as any);
      } else {
        toast.error("Cập nhật trạng thái thất bại");
      }
    } catch {
      toast.error("Lỗi kết nối server");
    } finally {
      setTogglingActiveId(null);
    }
  };

  const handleToggleInsurance = async (contract: ContractType) => {
    setTogglingInsuranceId(contract.id);
    try {
      const res = await dispatch(
        updateContractPayroll({
          token,
          id: contract.id,
          is_insurance: !contract.is_insurance,
        }) as any
      );
      if (res.payload.status === 200 || res.payload.status === 201) {
        toast.success(res.payload.data.message);
        await dispatch(listContractPayroll(token) as any);
      } else {
        toast.error("Cập nhật bảo hiểm thất bại");
      }
    } catch {
      toast.error("Lỗi kết nối server");
    } finally {
      setTogglingInsuranceId(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingContract) return;
    setDeleting(true);
    try {
      const res = await dispatch(
        deleteContractPayroll({ token, id: deletingContract.id }) as any
      );
      if (res.payload.status === 200 || res.payload.status === 201) {
        setDeletingContract(null);
        await dispatch(listContractPayroll(token) as any);
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

  const renderInsuranceToggle = (contract: ContractType) => {
    const isToggling = togglingInsuranceId === contract.id;
    return (
      <div className="flex items-center gap-2">
        {isToggling ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-white/50" />
        ) : (
          <Switch
            checked={contract.is_insurance}
            onCheckedChange={() => handleToggleInsurance(contract)}
            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-600"
          />
        )}
        {contract.is_insurance ? (
          <span className="text-xs text-green-400">Có</span>
        ) : (
          <span className="text-xs text-gray-400">Không</span>
        )}
      </div>
    );
  };

  const renderStatusToggle = (contract: ContractType) => {
    const isToggling = togglingActiveId === contract.id;
    return contract.active ? (
      <Button
        size="sm"
        disabled={isToggling}
        onClick={() => handleToggleActive(contract)}
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
        onClick={() => handleToggleActive(contract)}
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
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-white leading-tight">
            Quản Lý Loại Hợp Đồng
          </h1>
          <p className="text-white/60 text-xs sm:text-sm mt-0.5">
            Quản lý các loại hợp đồng lao động và chính sách bảo hiểm
          </p>
        </div>
        <Button
          onClick={handleCreate}
          size="sm"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shrink-0 h-9 px-3"
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Thêm Loại Hợp Đồng</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6">
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-white/60 text-xs">Tổng</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{totalCount}</p>
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
                <p className="text-xl sm:text-2xl font-bold text-white">{activeCount}</p>
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
                <p className="text-xl sm:text-2xl font-bold text-white">{inactiveCount}</p>
              </div>
              <ToggleLeft className="hidden sm:block h-8 w-8 text-orange-400" />
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
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 h-9 text-sm"
              />
            </div>

            {/* Mobile toggle */}
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

            {/* Desktop inline */}
            <div className="hidden sm:flex gap-2 items-center">
              <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
                <SelectTrigger className="w-[200px] bg-black/30 border-purple-500/30 text-white h-9">
                  <Filter className="h-4 w-4 mr-2 shrink-0" />
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả hợp đồng</SelectItem>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <ToggleRight className="h-4 w-4 text-green-400" /> Đang hoạt động
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center gap-2">
                      <ToggleLeft className="h-4 w-4 text-orange-400" /> Tạm ngưng
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

          {/* Mobile expandable */}
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
                  <SelectItem value="all">Tất cả hợp đồng</SelectItem>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <ToggleRight className="h-4 w-4 text-green-400" /> Đang hoạt động
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center gap-2">
                      <ToggleLeft className="h-4 w-4 text-orange-400" /> Tạm ngưng
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
                Danh Sách Loại Hợp Đồng
              </CardTitle>
              <CardDescription className="text-white/60 text-xs sm:text-sm">
                {paginatedData.length} loại hợp đồng
                {hasActiveFilters && ` / ${totalCount} tổng`}
              </CardDescription>
            </div>
            <Button
              onClick={handleCreate}
              size="sm"
              className="hidden sm:flex bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" /> Thêm Loại Hợp Đồng
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
                  paginatedData.map((contract) => (
                    <div
                      key={contract.id}
                      className="bg-white/5 border border-purple-500/20 rounded-xl p-3 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 min-w-0">
                          <FileText className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                          <p className="font-semibold text-white text-sm leading-tight">
                            {contract.name}
                          </p>
                        </div>
                        {renderStatusToggle(contract)}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-white/5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-white/40 text-xs">Bảo hiểm:</span>
                          {renderInsuranceToggle(contract)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(contract)}
                            className="h-7 w-7 p-0 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingContract(contract)}
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
                      ? "Không tìm thấy loại hợp đồng nào phù hợp"
                      : "Chưa có loại hợp đồng nào"}
                  </div>
                )}
              </div>

              {/* Desktop: table */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-purple-500/30">
                      <TableHead className="text-white">Tên Loại Hợp Đồng</TableHead>
                      <TableHead className="text-white">Trạng Thái</TableHead>
                      <TableHead className="text-white">Bảo Hiểm</TableHead>
                      <TableHead className="text-white">Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((contract) => (
                        <TableRow
                          key={contract.id}
                          className="border-b border-purple-500/30 hover:bg-white/5"
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-purple-400 shrink-0" />
                              <p className="font-medium text-white">{contract.name}</p>
                            </div>
                          </TableCell>
                          <TableCell>{renderStatusToggle(contract)}</TableCell>
                          <TableCell>{renderInsuranceToggle(contract)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(contract)}
                                className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeletingContract(contract)}
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
                        <TableCell colSpan={4} className="text-center py-8 text-white/60">
                          {hasActiveFilters
                            ? "Không tìm thấy loại hợp đồng nào phù hợp với bộ lọc"
                            : "Không tìm thấy loại hợp đồng nào"}
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
              totalItems={filteredContracts.length}
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
              {editingContract ? "Chỉnh Sửa Loại Hợp Đồng" : "Thêm Loại Hợp Đồng Mới"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-5">
            <div>
              <Label htmlFor="name" className="text-white text-sm">
                Tên Loại Hợp Đồng *
              </Label>
              <Input
                id="name"
                placeholder="Nhập tên loại hợp đồng..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 mt-1 h-9 text-sm"
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
                  {editingContract ? "Cập Nhật" : "Tạo Hợp Đồng"}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingContract} onOpenChange={() => setDeletingContract(null)}>
        <DialogContent className="bg-black/90 border-red-500/30 text-white w-[calc(100vw-2rem)] max-w-md mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              Xác Nhận Xóa
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-white/80 text-sm">
              Bạn có chắc chắn muốn xóa loại hợp đồng{" "}
              <span className="text-white font-semibold">
                "{deletingContract?.name}"
              </span>
              ? Hành động này không thể hoàn tác.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-700/50">
              <Button
                variant="outline"
                onClick={() => setDeletingContract(null)}
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