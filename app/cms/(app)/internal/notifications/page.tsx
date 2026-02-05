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
  const [selectedType, setSelectedType] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  useEffect(() => {
    dispatch(listDepartment({ limit: totalDepartment, page: 1 } as any) as any);
  }, [dispatch, totalDepartment]);

  useEffect(() => {
    dispatch(
      listNotification({
        limit: itemsPerPage,
        page: currentPage,
      } as any) as any,
    );
    dispatch(listNotificationType() as any);
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedIds([]); // Clear selection when changing page
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
      document_notification: notification.document_notification || [], // Thêm dòng này
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

  // Handle select all checkbox
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

  // Handle individual checkbox
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

  // Filter notifications (chỉ filter trên dữ liệu đã được phân trang từ server)
  const filteredNotifications = notifications
    .filter((notification: Notification) => {
      const matchesSearch =
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (notification.content &&
          notification.content
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      const matchesType =
        selectedType === "all" ||
        notification.type_id.toString() === selectedType;
      const matchesUnread = !showUnreadOnly || !notification.is_read;

      return matchesSearch && matchesType && matchesUnread;
    })
    .sort((a: Notification, b: Notification) => {
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });

  // Tính tổng số trang từ totalNotification (tổng số từ server)
  const totalPages = Math.ceil(totalNotification / itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchTerm, selectedType, showUnreadOnly]);

  // Calculate stats
  const unreadNotifications = notifications.filter(
    (n: Notification) => !n.is_read,
  ).length;
  const notificationsByType = notificationTypes?.map(
    (type: NotificationType) => ({
      ...type,
      count: notifications?.filter(
        (n: Notification) => n?.type_id?.toString() === type?.id,
      ).length,
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
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Quản Lý Thông Báo
            </h1>
            <p className="text-white/80">Quản lý các thông báo trong tổ chức</p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm Thông Báo
          </Button>
        </div>

        {/* Type breakdown */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">
              Phân Bố Theo Loại Thông Báo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {notificationsByType.map((type: any) => (
                <div key={type.id} className="text-center">
                  <Badge
                    className={`${getTypeColor(parseInt(type.id))} text-white mb-2`}
                  >
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
                  placeholder="Tìm kiếm thông báo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
                />
              </div>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-black/30 border-purple-500/30 text-white w-[200px]">
                  <SelectValue placeholder="Chọn loại thông báo" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-purple-500/30 text-white">
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  {notificationTypes.map((type: NotificationType) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="unread-only"
                  checked={showUnreadOnly}
                  onCheckedChange={(checked) =>
                    setShowUnreadOnly(checked as boolean)
                  }
                />
                <Label htmlFor="unread-only" className="text-white text-sm">
                  Chỉ hiển thị chưa đọc
                </Label>
              </div>

              {selectedIds.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => handleDelete(selectedIds)}
                  disabled={deleting}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50"
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Xóa ({selectedIds.length})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notifications Table */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Danh Sách Thông Báo</CardTitle>
            <CardDescription className="text-white/80">
              Hiển thị {filteredNotifications.length} trên tổng số{" "}
              {totalNotification} thông báo
              {selectedIds.length > 0 && (
                <span className="ml-2 text-blue-400">
                  (Đã chọn {selectedIds.length})
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
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

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalNotification}
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
                {editingNotification
                  ? "Chỉnh Sửa Thông Báo"
                  : "Thêm Thông Báo Mới"}
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
                  placeholder="VD: Thông báo họp phòng ban"
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-white">
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
                  className="bg-black/50 border-purple-500/30 text-white"
                  placeholder="Nội dung thông báo..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="notification_type" className="text-white">
                  Loại Thông Báo <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.type_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, type_id: value }))
                  }
                >
                  <SelectTrigger className="bg-black/50 border-purple-500/30 text-white w-full">
                    <SelectValue placeholder="Chọn loại thông báo" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-purple-500/30 text-white">
                    {notificationTypes.map((type: NotificationType) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="department" className="text-white">
                  Phòng Ban
                </Label>
                <Select
                  value={formData.department_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, department_id: value }))
                  }
                >
                  <SelectTrigger className="bg-black/50 border-purple-500/30 text-white w-full">
                    <SelectValue placeholder="Chọn phòng ban (để trống = tất cả)" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] bg-black/90 border-purple-500/30 text-white">
                    <div className="px-2 pb-2 sticky top-0 bg-black z-10 border-b border-purple-500/30">
                      <Input
                        placeholder="Tìm kiếm phòng ban..."
                        className="h-8 bg-purple-500/20 border-purple-500/50 text-white placeholder:text-white/70 focus:bg-purple-500/30 focus:border-purple-500"
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
                    {departments.map((dept: Department) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

                  {editingNotification &&
                    editingNotification?.document_notification?.filter(
                      (doc) => !deletedDocumentIds.includes(doc.id),
                    ).length > 0 && (
                      <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
                        <p className="text-blue-400 text-sm font-medium mb-2">
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
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleRemoveExistingDocument(doc.id)
                                }
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        <p className="text-white/60 text-xs mt-2">
                          * Tài liệu mới sẽ được thêm vào danh sách hiện có
                        </p>
                      </div>
                    )}
                </div>
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
