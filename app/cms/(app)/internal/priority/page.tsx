"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Flag,
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { usePriorityData } from "@/src/hook/priorityHook";
import {
  listPriority,
  createPriority,
  updatePriority,
  deletePriority,
} from "@/src/features/priority/priorityApi";

interface Priority {
  id: string;
  name: string;
  weight: string;
}

export default function PriorityPage() {
  const dispatch = useDispatch();
  const { priorities } = usePriorityData();

  // States
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [editingPriority, setEditingPriority] = useState<Priority | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    weight: "",
  });

  useEffect(() => {
    dispatch(listPriority() as any);
  }, [dispatch]);

  // Handle select/deselect priority
  const handleSelectPriority = (id: string) => {
    setSelectedPriorities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedPriorities.length === priorities?.length) {
      setSelectedPriorities([]);
    } else {
      setSelectedPriorities(priorities?.map((p: Priority) => p.id) || []);
    }
  };

  // Handle create
  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.weight.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const weight = parseInt(formData.weight);
    if (isNaN(weight) || weight < 0 || weight > 100) {
      toast.error("Độ ưu tiên phải là số từ 0 đến 100");
      return;
    }

    setIsSaving(true);
    try {
      const res = await dispatch(
        createPriority({
          name: formData.name,
          weight: formData.weight,
        } as any) as any
      );

      if (res.payload.status === 200 || res.payload.status === 201) {
        toast.success("Thêm độ ưu tiên thành công");
        setIsCreateDialogOpen(false);
        setFormData({ name: "", weight: "" });
        dispatch(listPriority() as any);
      } else {
        toast.error("Có lỗi xảy ra khi thêm độ ưu tiên");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm độ ưu tiên");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle edit
  const handleEdit = (priority: Priority) => {
    setEditingPriority(priority);
    setFormData({
      name: priority.name,
      weight: priority.weight,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingPriority) return;

    if (!formData.name.trim() || !formData.weight.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const weight = parseInt(formData.weight);
    if (isNaN(weight) || weight < 0 || weight > 100) {
      toast.error("Độ ưu tiên phải là số từ 0 đến 100");
      return;
    }

    setIsSaving(true);
    try {
      const res = await dispatch(
        updatePriority({
          id: editingPriority.id,
          name: formData.name,
          weight: formData.weight,
        } as any) as any
      );

      if (res.payload.status === 200 || res.payload.status === 201) {
        toast.success("Cập nhật độ ưu tiên thành công");
        setIsEditDialogOpen(false);
        setEditingPriority(null);
        setFormData({ name: "", weight: "" });
        dispatch(listPriority() as any);
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật độ ưu tiên");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật độ ưu tiên");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDeleteClick = () => {
    if (selectedPriorities.length === 0) {
      toast.error("Vui lòng chọn ít nhất một độ ưu tiên để xóa");
      return;
    }
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await dispatch(
        deletePriority(selectedPriorities as any) as any
      );

      if (res.payload.status === 200 || res.payload.status === 201) {
        toast.success(
          `Đã xóa ${selectedPriorities.length} độ ưu tiên thành công`
        );
        setIsDeleteDialogOpen(false);
        setSelectedPriorities([]);
        dispatch(listPriority() as any);
      } else {
        toast.error("Có lỗi xảy ra khi xóa độ ưu tiên");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa độ ưu tiên");
    } finally {
      setIsDeleting(false);
    }
  };

  // Get weight color
  const getWeightColor = (weight: string) => {
    const w = parseInt(weight);
    if (w >= 80) return "text-red-400 bg-red-500/20 border-red-500/30";
    if (w >= 50) return "text-orange-400 bg-orange-500/20 border-orange-500/30";
    if (w >= 25) return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
    return "text-green-400 bg-green-500/20 border-green-500/30";
  };

  const getWeightIcon = (weight: string) => {
    const w = parseInt(weight);
    if (w >= 80) return <Flag className="w-4 h-4 text-red-400" />;
    if (w >= 50) return <Flag className="w-4 h-4 text-orange-400" />;
    if (w >= 25) return <Flag className="w-4 h-4 text-yellow-400" />;
    return <Flag className="w-4 h-4 text-green-400" />;
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl">
            <Flag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Quản lý Độ ưu tiên
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Quản lý các mức độ ưu tiên cho công việc
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm độ ưu tiên
        </Button>
        {selectedPriorities.length > 0 && (
          <Button
            onClick={handleDeleteClick}
            variant="destructive"
            className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa ({selectedPriorities.length})
          </Button>
        )}
      </div>

      {/* Priority List */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-base sm:text-lg">
                Danh sách độ ưu tiên
              </CardTitle>
              <CardDescription className="text-gray-400 text-xs sm:text-sm">
                {priorities?.length || 0} độ ưu tiên
              </CardDescription>
            </div>
            {priorities && priorities.length > 0 && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={selectedPriorities.length === priorities.length}
                  onCheckedChange={handleSelectAll}
                  className="border-gray-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                />
                <Label
                  htmlFor="select-all"
                  className="text-xs sm:text-sm text-gray-400 cursor-pointer"
                >
                  Chọn tất cả
                </Label>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          {!priorities || priorities.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Flag className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-400 text-sm sm:text-base">
                Chưa có độ ưu tiên nào
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {priorities.map((priority: Priority) => (
                <Card
                  key={priority.id}
                  className="border-gray-800 bg-gray-800/50 hover:bg-gray-800 transition-all duration-200"
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <Checkbox
                        id={`priority-${priority.id}`}
                        checked={selectedPriorities.includes(priority.id)}
                        onCheckedChange={() =>
                          handleSelectPriority(priority.id)
                        }
                        className="border-gray-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 flex-shrink-0"
                      />
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getWeightIcon(priority.weight)}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-200 text-sm sm:text-base truncate">
                            {priority.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <TrendingUp className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-500">
                              Độ ưu tiên: {priority.weight}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getWeightColor(
                            priority.weight
                          )}`}
                        >
                          {priority.weight}%
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(priority)}
                        className="border-gray-700 hover:bg-purple-500/20 hover:border-purple-500 flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Sửa</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md sm:rounded-lg">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              Thêm độ ưu tiên mới
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-xs sm:text-sm">
              Nhập thông tin cho độ ưu tiên mới
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-gray-300">
                Tên độ ưu tiên
              </Label>
              <Input
                id="name"
                placeholder="Ví dụ: Cao, Trung bình, Thấp..."
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm text-gray-300">
                Độ ưu tiên (0-100)
              </Label>
              <Input
                id="weight"
                type="number"
                min="0"
                max="100"
                placeholder="Nhập số từ 0 đến 100"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-500">
                Số càng cao thì độ ưu tiên càng lớn
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setFormData({ name: "", weight: "" });
              }}
              className="border-gray-700 hover:bg-gray-800"
            >
              Hủy
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isSaving}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md sm:rounded-lg">
                <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              Chỉnh sửa độ ưu tiên
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-xs sm:text-sm">
              Cập nhật thông tin độ ưu tiên
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm text-gray-300">
                Tên độ ưu tiên
              </Label>
              <Input
                id="edit-name"
                placeholder="Ví dụ: Cao, Trung bình, Thấp..."
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-weight" className="text-sm text-gray-300">
                Độ ưu tiên (0-100)
              </Label>
              <Input
                id="edit-weight"
                type="number"
                min="0"
                max="100"
                placeholder="Nhập số từ 0 đến 100"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-500">
                Số càng cao thì độ ưu tiên càng lớn
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingPriority(null);
                setFormData({ name: "", weight: "" });
              }}
              className="border-gray-700 hover:bg-gray-800"
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isSaving}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Cập nhật
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Xác nhận xóa
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Bạn có chắc chắn muốn xóa {selectedPriorities.length} độ ưu tiên
              đã chọn? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-700 hover:bg-gray-800 text-white">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}