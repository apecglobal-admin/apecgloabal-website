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
  Filter,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useDepartmentData } from "@/src/hook/departmentHook";
import { listDepartment } from "@/src/features/department/departmentApi";
import { useNotificationData } from "@/src/hook/notificationHook";
import {
  createNotification,
  listNotification,
  listNotificationType,
  updateNotification,
  deleteNotification,
} from "@/src/features/notification/notificationApi";
import Pagination from "@/components/pagination";

interface NotificationDocument {
  id: number;
  name: string;
  file_url: string;
}

interface NotificationDepartment {
  id: number | null;
  name: string | null;
}

interface NotificationType {
  id: string;
  name: string;
}

interface Notification {
  id: number;
  user_id: number | null;
  title: string;
  content: string;
  type: string | null;
  is_read: boolean;
  action_url: string | null;
  created_at: string;
  updated_at: string;
  type_id: number;
  department_id: number | null;
  name: string | null;
  employee_created: string | null;
  employee_deleted: string | null;
  notification_type: {
    id: number;
    name: string;
  };
  department: NotificationDepartment;
  document_notification: NotificationDocument[];
}

interface Department {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export default function NotificationPage() {
  const dispatch = useDispatch();
  const { notifications, totalNotification, notificationTypes } =
    useNotificationData();
  const { departments, totalDepartment } = useDepartmentData();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [editingNotification, setEditingNotification] =
    useState<Notification | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletedDocumentIds, setDeletedDocumentIds] = useState<number[]>([]);

  // Bulk delete states
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type_id: "",
    department_id: "all",
    documents: [] as File[],
  });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Đợi 500ms sau khi user ngừng typing

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset về trang 1 khi search
  useEffect(() => {
    if (debouncedSearchTerm) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    dispatch(listDepartment({ limit: totalDepartment, page: 1, search: "" } as any) as any);
  }, [dispatch, totalDepartment]);

  // Load notifications với search parameter
  useEffect(() => {
    dispatch(
      listNotification({
        limit: itemsPerPage,
        page: currentPage,
        search: debouncedSearchTerm || ""
      } as any) as any,
    );
    dispatch(listNotificationType() as any);
  }, [dispatch, currentPage, debouncedSearchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedIds([]);
  };

  const handleCreate = () => {
    setEditingNotification(null);
    setFormData({
      title: "",
      content: "",
      type_id: "",
      department_id: "all",
      documents: [],
    });
    setDeletedDocumentIds([]);
    setShowCreateModal(true);
  };

  const handleEdit = (notification: Notification) => {
    setEditingNotification({
      ...notification,
      document_notification: notification.document_notification || [],
    });
    setFormData({
      title: notification.title,
      content: notification.content || "",
      type_id: notification.type_id.toString(),
      department_id: notification.department_id?.toString() || "all",
      documents: [],
    });
    setDeletedDocumentIds([]);
    setShowCreateModal(true);
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

  const handleRemoveExistingDocument = (documentId: number) => {
    setDeletedDocumentIds((prev) => [...prev, documentId]);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề thông báo");
      return;
    }

    if (!formData.type_id) {
      toast.error("Vui lòng chọn loại thông báo");
      return;
    }

    setCreating(true);
    try {
      const apiFormData = new FormData();
      apiFormData.append("title", formData.title);
      apiFormData.append("content", formData.content);
      apiFormData.append("type_id", formData.type_id);
      if (formData.department_id && formData.department_id !== "all") {
        apiFormData.append("department_id", formData.department_id.toString());
      }

      formData.documents.forEach((file) => {
        apiFormData.append("documents", file);
      });

      if (editingNotification) {
        const remainingDocumentIds = editingNotification.document_notification
          .filter((doc) => !deletedDocumentIds.includes(doc.id))
          .map((doc) => doc.id);
        apiFormData.append("documents", JSON.stringify(remainingDocumentIds));
      }

      if (editingNotification) {
        const res = await dispatch(
          updateNotification({
            id: editingNotification.id,
            data: apiFormData,
          } as any) as any,
        );
        if (res.payload.status == 200 || res.payload.status == 201) {
          await dispatch(
            listNotification({
              limit: itemsPerPage,
              page: currentPage,
              search: debouncedSearchTerm || ""
            } as any) as any,
          );
          toast.success(res.payload.data.message);
        }
      } else {
        const res = await dispatch(
          createNotification(apiFormData as any) as any,
        );
        if (res.payload.status == 200 || res.payload.status == 201) {
          await dispatch(
            listNotification({
              limit: itemsPerPage,
              page: currentPage,
              search: debouncedSearchTerm || ""
            } as any) as any,
          );
          toast.success(res.payload.data.message);
        }
      }

      setShowCreateModal(false);
    } catch (error) {
      console.error("Error saving notification:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setCreating(false);
    }
  };

  const handleSelectAll = () => {
    if (
      selectedIds.length === filteredNotifications.length &&
      filteredNotifications.length > 0
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((n: Notification) => n.id));
    }
  };

  const handleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = async (ids: number[]) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${ids.length} thông báo?`)) {
      return;
    }

    setDeleting(true);
    try {
      const res = await dispatch(deleteNotification(ids as any) as any);

      if (res.payload.status === 200 || res.payload.status === 201) {
        toast.success(res.payload.data.message);
        await dispatch(
          listNotification({
            limit: itemsPerPage,
            page: currentPage,
            search: debouncedSearchTerm || ""
          } as any) as any,
        );
        setSelectedIds([]);
      } else {
        toast.error("Có lỗi xảy ra khi xóa thông báo");
      }
    } catch (error) {
      console.error("Error deleting notifications:", error);
      toast.error("Lỗi kết nối server");
    } finally {
      setDeleting(false);
    }
  };

  // Sử dụng data trực tiếp từ API (đã được filter qua search)
  // Chỉ filter thêm type và unread ở frontend
  const filteredNotifications = (notifications || [])
    .filter((notification: Notification) => {
      const matchesType =
        selectedType === "all" ||
        notification.type_id.toString() === selectedType;
      const matchesUnread = !showUnreadOnly || !notification.is_read;

      return matchesType && matchesUnread;
    })
    .sort((a: Notification, b: Notification) => {
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });

  const totalPages = Math.ceil(totalNotification / itemsPerPage);

  // Reset trang khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [selectedType, showUnreadOnly]);

  const unreadNotifications = notifications?.filter(
    (n: Notification) => !n.is_read,
  ).length || 0;
  
  const notificationsByType = notificationTypes?.map(
    (type: NotificationType) => ({
      ...type,
      count: notifications?.filter(
        (n: Notification) => n?.type_id?.toString() === type?.id,
      ).length || 0,
    }),
  );

  const getTypeColor = (typeId: number) => {
    const colors = [
      "bg-blue-500",
      "bg-red-500",
      "bg-purple-500",
      "bg-orange-500",
    ];
    return colors[(typeId - 1) % colors.length];
  };

  return (
    <div className="space-y-4 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header - Mobile Optimized */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Quản Lý Thông Báo
          </h1>
          <p className="text-sm md:text-base text-white/80">
            Quản lý các thông báo trong tổ chức
          </p>
        </div>

        {/* Type breakdown - Mobile Grid */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg text-white">
              Phân Bố Theo Loại
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {notificationsByType?.map((type: any) => (
                <div key={type.id} className="text-center p-3 bg-black/30 rounded-lg">
                  <Badge
                    className={`${getTypeColor(parseInt(type.id))} text-white text-xs mb-2`}
                  >
                    {type.name}
                  </Badge>
                  <p className="text-xl md:text-2xl font-bold text-white">{type.count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mobile Filter Button */}
        <div className="md:hidden">
          <Button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="w-full bg-black/50 border border-purple-500/30 text-white hover:bg-black/70"
            variant="outline"
          >
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc & Tìm kiếm
            <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${showFilterPanel ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Filters - Mobile Collapsible */}
        <Card className={`bg-black/50 border-purple-500/30 ${!showFilterPanel && 'hidden md:block'}`}>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50 text-sm md:text-base"
                />
              </div>

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-black/30 border-purple-500/30 text-white w-full md:w-[200px] text-sm md:text-base">
                  <SelectValue placeholder="Loại thông báo" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-purple-500/30 text-white">
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  {notificationTypes?.map((type: NotificationType) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Unread Filter */}
              <div className="flex items-center space-x-2 bg-black/30 p-3 rounded-md border border-purple-500/30 md:bg-transparent md:p-0 md:border-0">
                <Checkbox
                  id="unread-only"
                  checked={showUnreadOnly}
                  onCheckedChange={(checked) =>
                    setShowUnreadOnly(checked as boolean)
                  }
                />
                <Label htmlFor="unread-only" className="text-white text-sm">
                  Chỉ chưa đọc
                </Label>
              </div>
            </div>

            {/* Bulk Actions - Mobile Full Width */}
            {selectedIds.length > 0 && (
              <div className="mt-3 md:mt-4">
                <Button
                  variant="outline"
                  onClick={() => handleDelete(selectedIds)}
                  disabled={deleting}
                  className="w-full md:w-auto bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50"
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Xóa ({selectedIds.length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications List - Mobile Card View */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader className="p-4 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
              <div>
                <CardTitle className="text-base md:text-lg text-white">
                  Danh Sách Thông Báo
                </CardTitle>
                <CardDescription className="text-xs md:text-sm text-white/80 mt-1">
                  {filteredNotifications.length}/{totalNotification}
                  {selectedIds.length > 0 && (
                    <span className="ml-2 text-blue-400">
                      ({selectedIds.length} đã chọn)
                    </span>
                  )}
                </CardDescription>
              </div>
              <Button
                onClick={handleCreate}
                className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm Mới
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 md:p-6">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-purple-500/30">
                    <TableHead className="w-[50px] text-white">
                      <Checkbox
                        checked={
                          selectedIds.length === filteredNotifications.length &&
                          filteredNotifications.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                        className="border-white/30"
                      />
                    </TableHead>
                    <TableHead className="text-white">Tiêu Đề</TableHead>
                    <TableHead className="text-white">Loại</TableHead>
                    <TableHead className="text-white">Phòng Ban</TableHead>
                    <TableHead className="text-white">Tài Liệu</TableHead>
                    <TableHead className="text-white">Trạng Thái</TableHead>
                    <TableHead className="text-white text-right">
                      Thao Tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification: Notification) => (
                      <TableRow
                        key={notification.id}
                        className="border-b border-purple-500/30 hover:bg-white/5"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(notification.id)}
                            onCheckedChange={() =>
                              handleSelectOne(notification.id)
                            }
                            className="border-white/30"
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-white">
                              {notification.title}
                            </p>
                            {notification.content && (
                              <p className="text-sm text-white/60 mt-1">
                                {notification.content}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getTypeColor(
                              notification.type_id,
                            )} text-white`}
                          >
                            {notification.notification_type.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {notification.department?.name ? (
                            <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                              {notification.department.name}
                            </Badge>
                          ) : (
                            <span className="text-white/40 text-sm">
                              Tất cả
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {notification?.document_notification?.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-purple-400" />
                              <span className="text-white text-sm">
                                {notification?.document_notification?.length}{" "}
                                tài liệu
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
                              notification.is_read
                                ? "bg-gray-600/20 text-gray-400 border-gray-500/30"
                                : "bg-green-600/20 text-green-400 border-green-500/30"
                            }
                          >
                            {notification.is_read ? "Đã đọc" : "Chưa đọc"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(notification)}
                              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete([notification.id])}
                              disabled={deleting}
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
                        Không tìm thấy thông báo nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3 p-4">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification: Notification) => (
                  <Card
                    key={notification.id}
                    className="bg-black/30 border-purple-500/30"
                  >
                    <CardContent className="p-4">
                      {/* Checkbox & Title */}
                      <div className="flex items-start gap-3 mb-3">
                        <Checkbox
                          checked={selectedIds.includes(notification.id)}
                          onCheckedChange={() =>
                            handleSelectOne(notification.id)
                          }
                          className="border-white/30 mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white text-sm mb-1 break-words">
                            {notification.title}
                          </h3>
                          {notification.content && (
                            <p className="text-xs text-white/60 line-clamp-2 break-words">
                              {notification.content}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Badges Row */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge
                          className={`${getTypeColor(
                            notification.type_id,
                          )} text-white text-xs`}
                        >
                          {notification.notification_type.name}
                        </Badge>
                        {notification.department?.name && (
                          <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 text-xs">
                            {notification.department.name}
                          </Badge>
                        )}
                        <Badge
                          className={
                            notification.is_read
                              ? "bg-gray-600/20 text-gray-400 border-gray-500/30 text-xs"
                              : "bg-green-600/20 text-green-400 border-green-500/30 text-xs"
                          }
                        >
                          {notification.is_read ? "Đã đọc" : "Chưa đọc"}
                        </Badge>
                      </div>

                      {/* Documents Info */}
                      {notification?.document_notification?.length > 0 && (
                        <div className="flex items-center gap-2 mb-3 text-xs text-white/60">
                          <FileText className="h-3 w-3 text-purple-400" />
                          <span>
                            {notification?.document_notification?.length} tài liệu
                          </span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(notification)}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 text-xs"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Sửa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete([notification.id])}
                          disabled={deleting}
                          className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50 text-xs"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-white/60 text-sm">
                  Không tìm thấy thông báo nào
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="px-4 md:px-0">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalNotification}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </CardContent>
        </Card>

        {/* Create/Edit Modal - Mobile Optimized */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="bg-black/95 border-purple-500/30 text-white max-w-[95vw] w-full md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="px-4 md:px-6">
              <DialogTitle className="text-lg md:text-xl">
                {editingNotification
                  ? "Chỉnh Sửa Thông Báo"
                  : "Thêm Thông Báo Mới"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 px-4 md:px-6 pb-4">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-white text-sm">
                  Tiêu Đề <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="bg-black/50 border-purple-500/30 text-white text-sm mt-1.5"
                  placeholder="VD: Thông báo họp phòng ban"
                />
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content" className="text-white text-sm">
                  Nội Dung
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  className="bg-black/50 border-purple-500/30 text-white text-sm mt-1.5"
                  placeholder="Nội dung thông báo..."
                  rows={3}
                />
              </div>

              {/* Type */}
              <div>
                <Label htmlFor="notification_type" className="text-white text-sm">
                  Loại Thông Báo <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.type_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, type_id: value }))
                  }
                >
                  <SelectTrigger className="bg-black/50 border-purple-500/30 text-white w-full text-sm mt-1.5">
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-purple-500/30 text-white">
                    {notificationTypes?.map((type: NotificationType) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Department */}
              <div>
                <Label htmlFor="department" className="text-white text-sm">
                  Phòng Ban
                </Label>
                <Select
                  value={formData.department_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, department_id: value }))
                  }
                >
                  <SelectTrigger className="bg-black/50 border-purple-500/30 text-white w-full text-sm mt-1.5">
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] bg-black/90 border-purple-500/30 text-white">
                    <div className="px-2 pb-2 sticky top-0 bg-black z-10 border-b border-purple-500/30">
                      <Input
                        placeholder="Tìm kiếm..."
                        className="h-8 bg-purple-500/20 border-purple-500/50 text-white placeholder:text-white/70 text-sm"
                        onChange={(e) => {
                          const input = e.target;
                          const items = input
                            .closest('[role="listbox"]')
                            ?.querySelectorAll('[role="option"]');
                          const searchText = input.value.toLowerCase();

                          items?.forEach((item) => {
                            const text = item.textContent?.toLowerCase() || "";
                            (item as HTMLElement).style.display = text.includes(
                              searchText,
                            )
                              ? ""
                              : "none";
                          });
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </div>
                    <SelectItem value="all">Tất cả phòng ban</SelectItem>
                    {departments?.map((dept: Department) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Documents */}
              <div>
                <Label htmlFor="documents" className="text-white text-sm mb-2 block">
                  Tài Liệu Đính Kèm
                </Label>
                <div className="space-y-3">
                  <Input
                    id="documents"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="bg-black/50 border-purple-500/30 text-white text-xs file:mr-2 file:px-3 file:py-1.5 file:rounded-full file:border-0 file:text-xs file:bg-purple-600 file:text-white"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                  />

                  {/* New Files */}
                  {formData.documents.length > 0 && (
                    <div className="bg-black/30 p-3 rounded-lg border border-purple-500/30 space-y-2">
                      <p className="text-white text-xs font-medium mb-2">
                        {formData.documents.length} tài liệu mới
                      </p>
                      {formData.documents.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-black/40 p-2 rounded-lg gap-2"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <FileText className="h-3 w-3 text-purple-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-xs truncate">
                                {file.name}
                              </p>
                              <p className="text-white/60 text-[10px]">
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 w-7 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Existing Documents */}
                  {editingNotification &&
                    editingNotification?.document_notification?.filter(
                      (doc) => !deletedDocumentIds.includes(doc.id),
                    ).length > 0 && (
                      <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/30">
                        <p className="text-blue-400 text-xs font-medium mb-2">
                          Tài liệu hiện có (
                          {
                            editingNotification?.document_notification?.filter(
                              (doc) => !deletedDocumentIds.includes(doc.id),
                            ).length
                          }
                          )
                        </p>
                        {editingNotification.document_notification
                          ?.filter(
                            (doc) => !deletedDocumentIds.includes(doc.id),
                          )
                          ?.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center gap-2 bg-black/40 p-2 rounded-lg mb-2"
                            >
                              <FileText className="h-3 w-3 text-blue-400 flex-shrink-0" />
                              <p className="text-white text-xs flex-1 truncate">
                                {doc.name}
                              </p>
                              <a
                                href={doc.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 flex-shrink-0"
                              >
                                <Download className="h-3 w-3" />
                              </a>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleRemoveExistingDocument(doc.id)
                                }
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-6 w-6 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-2 px-4 md:px-6 pb-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10 text-sm"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                disabled={creating}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : editingNotification ? (
                  "Cập nhật"
                ) : (
                  "Tạo mới"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}