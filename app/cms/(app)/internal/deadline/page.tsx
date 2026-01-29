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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Clock,
  Edit,
  Loader2,
  Calendar,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { useDeadlineData } from "@/src/hook/deadlineHook";
import {
  listDeadline,
  updateDeadline,
} from "@/src/features/deadline/deadlineApi";

interface Deadline {
  id: number;
  name: string;
  value: number;
}

export default function DeadlinePage() {
  const dispatch = useDispatch();
  const { deadlines } = useDeadlineData();

  // States
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    dispatch(listDeadline() as any);
  }, [dispatch]);

  // Handle edit
  const handleEdit = (deadline: Deadline) => {
    setEditingDeadline(deadline);
    setEditValue(deadline.value.toString());
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingDeadline) return;

    if (!editValue.trim()) {
      toast.error("Vui lòng nhập giá trị điểm");
      return;
    }

    const value = parseInt(editValue);
    if (isNaN(value)) {
      toast.error("Giá trị điểm phải là số");
      return;
    }

    setIsSaving(true);
    try {
      const res = await dispatch(
        updateDeadline({
          id: editingDeadline.id,
          value: value,
        } as any) as any
      );

      if (res.payload.status === 200 || res.payload.status === 201) {
        toast.success(res.payload.data.message);
        setIsEditDialogOpen(false);
        setEditingDeadline(null);
        setEditValue("");
        dispatch(listDeadline() as any);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật điểm deadline");
    } finally {
      setIsSaving(false);
    }
  };

  // Get value color
  const getValueColor = (value: number) => {
    if (value >= 10) return "text-red-400 bg-red-500/20 border-red-500/30";
    if (value >= 5) return "text-orange-400 bg-orange-500/20 border-orange-500/30";
    if (value > 0) return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
    return "text-green-400 bg-green-500/20 border-green-500/30";
  };

  const getValueIcon = (value: number) => {
    if (value >= 10) return <Award className="w-4 h-4 text-red-400" />;
    if (value >= 5) return <Award className="w-4 h-4 text-orange-400" />;
    if (value > 0) return <Award className="w-4 h-4 text-yellow-400" />;
    return <Award className="w-4 h-4 text-green-400" />;
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg sm:rounded-xl">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Quản lý Deadline
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Quản lý điểm deadline cho công việc
            </p>
          </div>
        </div>
      </div>

      {/* Deadline List */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent text-base sm:text-lg">
                Danh sách điểm deadline
              </CardTitle>
              <CardDescription className="text-gray-400 text-xs sm:text-sm">
                {deadlines?.length || 0} loại deadline
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          {!deadlines || deadlines.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-400 text-sm sm:text-base">
                Chưa có dữ liệu deadline
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {deadlines.map((deadline: Deadline) => (
                <Card
                  key={deadline.id}
                  className="border-gray-800 bg-gray-800/50 hover:bg-gray-800 transition-all duration-200"
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getValueIcon(deadline.value)}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-200 text-sm sm:text-base truncate">
                            {deadline.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-500">
                              Điểm: {deadline.value > 0 ? `+${deadline.value}` : deadline.value}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getValueColor(
                            deadline.value
                          )}`}
                        >
                          {deadline.value > 0 ? `+${deadline.value}` : deadline.value}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(deadline)}
                        className="border-gray-700 hover:bg-blue-500/20 hover:border-blue-500 flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3"
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-md sm:rounded-lg">
                <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              Chỉnh sửa điểm deadline
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-xs sm:text-sm">
              Cập nhật điểm cho: {editingDeadline?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-value" className="text-sm text-gray-300">
                Điểm deadline
              </Label>
              <Input
                id="edit-value"
                type="number"
                placeholder="Nhập điểm"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-500">
                Nhập điểm cộng/trừ cho loại deadline này
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingDeadline(null);
                setEditValue("");
              }}
              className="border-gray-700 hover:bg-gray-800"
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
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
    </div>
  );
}