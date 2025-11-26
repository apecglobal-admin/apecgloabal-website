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
import {
  Plus,
  Search,
  Edit,
  Loader2,
  Trash2,
  MessageSquare,
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import InternalLayout from "@/components/cms-layout";
import Pagination from "@/components/pagination";
import { useSupportData } from "@/src/hook/supportHook";
import {
  deleteSupport,
  listSupport,
  listSupportType,
  updateSupport,
} from "@/src/features/support/supportApi";

interface SupportStatus {
  id: number;
  name: string;
}

interface Support {
  id: string;
  name: string;
  phone: string;
  email: string;
  title: string;
  content: string;
  created_at: string;
  employee_reviewed: string | null;
  status: SupportStatus;
}

export default function SupportPage() {
  const dispatch = useDispatch();
  const { supports, totalSupport, supportTypes } = useSupportData();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSupport, setSelectedSupport] = useState<Support | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deletingSupport, setDeletingSupport] = useState<Support | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    status_id: "",
    employee_reviewed: "",
  });

  useEffect(() => {
    dispatch(
      listSupport({ limit: itemsPerPage, page: currentPage } as any) as any
    );
    dispatch(listSupportType() as any);
  }, [dispatch, currentPage]);

  const handleViewDetail = (support: Support) => {
    setSelectedSupport(support);
    setFormData({
      status_id: support.status.id.toString(),
      employee_reviewed: support.employee_reviewed || "",
    });
    setShowDetailModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedSupport) return;

    if (!formData.status_id) {
      toast.error("Vui lòng chọn trạng thái");
      return;
    }

    setUpdating(true);
    // console.log(selectedSupport.id)
    try {
      const res = await dispatch(
        updateSupport({
          id: selectedSupport.id,
          status_id: formData.status_id,
        } as any) as any
      );

      if (res.payload.status == 200 || res.payload.status == 201) {
        await dispatch(
          listSupport({ limit: itemsPerPage, page: currentPage } as any) as any
        );
        toast.success(res.payload.data.message);
        setShowDetailModal(false);
      }
    } catch (error) {
      console.error("Error updating support:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSupport) return;
    const id = [deletingSupport.id];
    setDeleting(true);
    try {
      // Replace with actual API call
      const res = await dispatch(deleteSupport(id as any) as any);
      if (res.payload.status == 200 || res.payload.status == 201) {
        await dispatch(
          listSupport({ limit: itemsPerPage, page: currentPage } as any) as any
        );
        toast.success("Xóa yêu cầu hỗ trợ thành công!");
        setDeletingSupport(null);
      }
    } catch (error) {
      console.error("Error deleting support:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setDeleting(false);
    }
  };

  // Filter supports
  const filteredSupports = supports.filter((support: Support) => {
    const matchesSearch =
      support.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      support.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      support.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      support.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      selectedType === "all" || support.status.id.toString() === selectedType;

    return matchesSearch && matchesType;
  });

  // Pagination logic - Sử dụng totalSupport từ API thay vì filteredSupports.length
  const totalItems = totalSupport || filteredSupports.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // Chỉ hiển thị data hiện có trên trang (không slice vì data đã được paginate từ API)
  const paginatedSupports = supports;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate stats
  const totalRequests = supports.length;
  const supportsByStatus = supportTypes.map((type: SupportStatus) => ({
    ...type,
    count: supports.filter((s: Support) => s.status.id === type.id).length,
  }));

  const getStatusColor = (statusId: number) => {
    const colors: Record<number, string> = {
      1: "bg-yellow-500", // Đang xử lý
      2: "bg-blue-500", // Đã tiếp nhận
      3: "bg-green-500", // Đã phản hồi
    };
    return colors[statusId] || "bg-gray-500";
  };

  const getStatusIcon = (statusId: number) => {
    const icons: Record<number, any> = {
      1: Clock, // Đang xử lý
      2: AlertCircle, // Đã tiếp nhận
      3: CheckCircle2, // Đã phản hồi
    };
    const Icon = icons[statusId] || Clock;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Quản Lý Hỗ Trợ
            </h1>
            <p className="text-white/80">
              Quản lý các yêu cầu hỗ trợ từ khách hàng
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white/80">
                Tổng Yêu Cầu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{totalRequests}</p>
            </CardContent>
          </Card>

          {supportsByStatus.map((status: any) => (
            <Card key={status.id} className="bg-black/50 border-purple-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white/80">
                  {status.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold text-white">
                    {status.count}
                  </p>
                  <Badge className={`${getStatusColor(status.id)} text-white`}>
                    {getStatusIcon(status.id)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo tên, email, tiêu đề..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
                />
              </div>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-black/30 border-purple-500/30 text-white min-w-[200px]">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {supportTypes.map((type: SupportStatus) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Supports Table */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">
              Danh Sách Yêu Cầu Hỗ Trợ
            </CardTitle>
            <CardDescription className="text-white/80">
              Hiển thị {supports.length} trên tổng số{" "}
              {totalSupport || supports.length} yêu cầu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-purple-500/30">
                  <TableHead className="text-white">Khách Hàng</TableHead>
                  <TableHead className="text-white">Liên Hệ</TableHead>
                  <TableHead className="text-white">Tiêu Đề</TableHead>
                  <TableHead className="text-white">Ngày Tạo</TableHead>
                  <TableHead className="text-white">Trạng Thái</TableHead>
                  <TableHead className="text-white">NV Xử Lý</TableHead>
                  <TableHead className="text-white">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSupports.length > 0 ? (
                  paginatedSupports.map((support: Support) => (
                    <TableRow
                      key={support.id}
                      className="border-b border-purple-500/30 hover:bg-white/5"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-purple-400" />
                          <p className="font-medium text-white">
                            {support.name}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-white/60" />
                            <p className="text-sm text-white/80">
                              {support.email}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-white/60" />
                            <p className="text-sm text-white/80">
                              {support.phone}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">
                            {support.title}
                          </p>
                          <p className="text-sm text-white/60 mt-1 line-clamp-2">
                            {support.content}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-white/60" />
                          <span className="text-white text-sm">
                            {support.created_at}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(
                            support.status.id
                          )} text-white flex items-center gap-1 w-fit`}
                        >
                          {getStatusIcon(support.status.id)}
                          {support.status.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {support.employee_reviewed ? (
                          <span className="text-white text-sm">
                            {support.employee_reviewed}
                          </span>
                        ) : (
                          <span className="text-white/40 text-sm">
                            Chưa phân công
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(support)}
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingSupport(support)}
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
                      colSpan={7}
                      className="text-center py-8 text-white/60"
                    >
                      Không tìm thấy yêu cầu hỗ trợ nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              maxVisiblePages={5}
            />
          </CardContent>
        </Card>

        {/* Detail Modal */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                Chi Tiết Yêu Cầu Hỗ Trợ
              </DialogTitle>
            </DialogHeader>

            {selectedSupport && (
              <div className="space-y-4">
                <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/30">
                  <h3 className="text-white font-semibold mb-3">
                    Thông Tin Khách Hàng
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-purple-400" />
                      <span className="text-white/60">Họ tên:</span>
                      <span className="text-white">{selectedSupport.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-purple-400" />
                      <span className="text-white/60">Email:</span>
                      <span className="text-white">
                        {selectedSupport.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-purple-400" />
                      <span className="text-white/60">Số điện thoại:</span>
                      <span className="text-white">
                        {selectedSupport.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-400" />
                      <span className="text-white/60">Ngày tạo:</span>
                      <span className="text-white">
                        {selectedSupport.created_at}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-white font-semibold mb-2 block">
                    Tiêu Đề
                  </Label>
                  <p className="text-white bg-black/30 p-3 rounded-lg border border-purple-500/30">
                    {selectedSupport.title}
                  </p>
                </div>

                <div>
                  <Label className="text-white font-semibold mb-2 block">
                    Nội Dung
                  </Label>
                  <div className="text-white bg-black/30 p-3 rounded-lg border border-purple-500/30 whitespace-pre-wrap">
                    {selectedSupport.content}
                  </div>
                </div>

                <div>
                  <Label htmlFor="status" className="text-white">
                    Trạng Thái <span className="text-red-400">*</span>
                  </Label>
                  <Select
                    value={formData.status_id}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, status_id: value }))
                    }
                  >
                    <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportTypes.map((type: SupportStatus) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="employee_reviewed" className="text-white">
                    Nhân Viên Xử Lý
                  </Label>
                  <Input
                    id="employee_reviewed"
                    value={formData.employee_reviewed}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        employee_reviewed: e.target.value,
                      }))
                    }
                    className="bg-black/50 border-purple-500/30 text-white"
                    placeholder="Nhập tên nhân viên xử lý"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowDetailModal(false)}
                className="bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Đóng
              </Button>
              <Button
                onClick={handleUpdateStatus}
                disabled={updating}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {updating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  "Cập nhật"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog
          open={!!deletingSupport}
          onOpenChange={() => setDeletingSupport(null)}
        >
          <DialogContent className="bg-black/90 border-red-500/30 text-white">
            <DialogHeader>
              <DialogTitle className="text-red-400">Xác Nhận Xóa</DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <p className="text-white/80">
                Bạn có chắc chắn muốn xóa yêu cầu hỗ trợ từ{" "}
                <strong className="text-white">
                  "{deletingSupport?.name}"
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
                onClick={() => setDeletingSupport(null)}
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

