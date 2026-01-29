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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Shield,
  Briefcase,
  TrendingUp,
  Loader2,
  Edit,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useRoleData } from "@/src/hook/roleHook";
import {
  listRoleGroupPreWebsite,
  listRoleLevelPositionWebsite,
  listRolePositionWebsite,
  updateRolePositionUser,
} from "@/src/features/role/roleApi";

interface PermissionChange {
  id: number;
  status: boolean;
}

export default function RolesWebsite() {
  const dispatch = useDispatch();
  const { positionRoles, levelPositionRoles, groupPreRoles } = useRoleData();

  const [selectedPosition, setSelectedPosition] = useState<number | undefined>(undefined);
  const [selectedLevel, setSelectedLevel] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [permissionChanges, setPermissionChanges] = useState<PermissionChange[]>([]);

  useEffect(() => {
    dispatch(listRolePositionWebsite() as any);
    dispatch(listRoleLevelPositionWebsite() as any);
  }, [dispatch]);

  // Gọi API khi có sự thay đổi trong selection
  useEffect(() => {
    if (selectedPosition || selectedLevel) {
      setIsLoading(true);
      setIsEditMode(false);
      setPermissionChanges([]);
      dispatch(listRoleGroupPreWebsite({ position_id: selectedPosition, level_id: selectedLevel } as any) as any)
        .finally(() => setIsLoading(false));
    }
  }, [selectedPosition, selectedLevel, dispatch]);

  const handlePositionChange = (value: string) => {
    const positionId = value === "all" ? undefined : parseInt(value);
    setSelectedPosition(positionId);
  };

  const handleLevelChange = (value: string) => {
    const levelId = value === "all" ? undefined : parseInt(value);
    setSelectedLevel(levelId);
  };

  const handlePermissionToggle = (itemId: number, currentStatus: boolean) => {
    if (!isEditMode) return;

    const newStatus = !currentStatus;
    
    // Cập nhật hoặc thêm vào mảng thay đổi
    setPermissionChanges(prev => {
      const existingIndex = prev.findIndex(p => p.id === itemId);
      
      if (existingIndex >= 0) {
        // Nếu đã tồn tại, cập nhật status
        const updated = [...prev];
        updated[existingIndex] = { id: itemId, status: newStatus };
        return updated;
      } else {
        // Nếu chưa tồn tại, thêm mới
        return [...prev, { id: itemId, status: newStatus }];
      }
    });
  };

  const handleSave = async () => {
    if (!selectedPosition && !selectedLevel) {
      toast.error("Vui lòng chọn vị trí hoặc cấp bậc");
      return;
    }

    try {
      setIsSaving(true);

      // Tạo mảng permissions chứa TẤT CẢ permissions với status hiện tại
      const allPermissions: PermissionChange[] = [];
      
      groupPreRoles?.forEach((group: any) => {
        group.items.forEach((item: any) => {
          const currentStatus = getCurrentStatus(item.item_id, item.status);
          allPermissions.push({
            id: item.item_id,
            status: currentStatus
          });
        });
      });

      console.log("Updating all permissions:", allPermissions);
      
      // Gọi API update với tất cả permissions
      const res = await dispatch(
        updateRolePositionUser({
          level_id: selectedLevel,
          position_id: selectedPosition,
          permissions: allPermissions, // Array of ALL {id, status}
        } as any) as any
      );

      if(res.payload?.status == 200 || res.payload?.status == 201) {
        toast.success(res.payload?.data?.message || "Cập nhật quyền thành công");
        setIsEditMode(false);
        setPermissionChanges([]);
      }
      
      // Reload lại danh sách quyền sau khi update
      dispatch(
        listRoleGroupPreWebsite({
          position_id: selectedPosition,
          level_id: selectedLevel,
        } as any) as any
      );
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật quyền");
      console.error("Error updating permission:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setPermissionChanges([]);
  };

  const handleEditMode = () => {
    if (!selectedPosition && !selectedLevel) {
      toast.error("Vui lòng chọn vị trí hoặc cấp bậc trước");
      return;
    }
    setIsEditMode(true);
  };

  // Helper function để lấy status hiện tại (từ changes hoặc từ data gốc)
  const getCurrentStatus = (itemId: number, originalStatus: boolean) => {
    const change = permissionChanges.find(p => p.id === itemId);
    return change ? change.status : originalStatus;
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Quản lý Phân quyền
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Chọn vị trí và cấp bậc để xem và quản lý quyền hạn
            </p>
          </div>
        </div>
      </div>

      {/* Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Position Selection */}
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-base sm:text-lg">
              <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
              Chọn Vị trí
            </CardTitle>
            <CardDescription className="text-gray-400 text-xs sm:text-sm">
              Chọn vị trí công việc để xem quyền hạn
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <Select
              value={selectedPosition?.toString() || "all"}
              onValueChange={handlePositionChange}
              disabled={isSaving || isEditMode}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Chọn vị trí..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all" className="text-white hover:bg-gray-700">
                  Tất cả vị trí
                </SelectItem>
                {positionRoles?.map((position: any) => (
                  <SelectItem 
                    key={position.id} 
                    value={position.id.toString()}
                    className="text-white hover:bg-gray-700"
                  >
                    {position.title} ({position.employee_count} nhân viên)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Level Selection */}
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-base sm:text-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
              Chọn Cấp bậc
            </CardTitle>
            <CardDescription className="text-gray-400 text-xs sm:text-sm">
              Chọn cấp bậc để xem quyền hạn
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <Select
              value={selectedLevel?.toString() || "all"}
              onValueChange={handleLevelChange}
              disabled={isSaving || isEditMode}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Chọn cấp bậc..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all" className="text-white hover:bg-gray-700">
                  Tất cả cấp bậc
                </SelectItem>
                {levelPositionRoles?.map((level: any) => (
                  <SelectItem 
                    key={level.id} 
                    value={level.id.toString()}
                    className="text-white hover:bg-gray-700"
                  >
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Permissions Display */}
      {isLoading ? (
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
          <CardContent className="flex items-center justify-center py-12 p-3 sm:p-6">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-purple-500" />
              <p className="text-xs sm:text-sm text-gray-400">Đang tải quyền hạn...</p>
            </div>
          </CardContent>
        </Card>
      ) : groupPreRoles && groupPreRoles.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
              <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Danh sách Quyền hạn
              </h2>
              {isEditMode && (
                <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full border border-yellow-400/30">
                  Chế độ chỉnh sửa
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {!isEditMode ? (
                <Button
                  onClick={handleEditMode}
                  disabled={isLoading || isSaving}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  size="sm"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    size="sm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hủy
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Lưu {permissionChanges.length > 0 && `(${permissionChanges.length})`}
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-3">
          {groupPreRoles.map((group: any) => (
            <Card key={group.group_id} className="border-gray-800 bg-gray-900/50 backdrop-blur">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {group.group_name}
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-xs sm:text-sm">
                    {group.items.length} quyền có sẵn
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <div className="space-y-3">
                    {group.items.map((item: any) => {
                      const currentStatus = getCurrentStatus(item.item_id, item.status);
                      const hasChanged = permissionChanges.some(p => p.id === item.item_id);
                      
                      return (
                        <div
                          key={item.item_id}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                            hasChanged 
                              ? 'border-yellow-500 bg-yellow-500/10' 
                              : 'border-gray-800 bg-gray-800/50 hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Checkbox
                              id={`perm-${group.group_id}-${item.item_id}`}
                              checked={currentStatus}
                              disabled={!isEditMode || isSaving}
                              onCheckedChange={() =>
                                handlePermissionToggle(item.item_id, currentStatus)
                              }
                              className="border-gray-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 flex-shrink-0"
                            />
                            <Label
                              htmlFor={`perm-${group.group_id}-${item.item_id}`}
                              className={`font-medium text-sm sm:text-base ${
                                isEditMode ? 'cursor-pointer' : 'cursor-default'
                              } ${currentStatus ? 'text-gray-200' : 'text-gray-400'}`}
                            >
                              {item.item_name}
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            {hasChanged && (
                              <span className="text-xs text-yellow-400">
                                Đã thay đổi
                              </span>
                            )}
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                                currentStatus
                                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                  : "bg-gray-700/50 text-gray-400 border border-gray-600"
                              }`}
                            >
                              {currentStatus ? "Đã bật" : "Đã tắt"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
          ))}
          </div>
        </div>
      ) : (selectedPosition || selectedLevel) ? (
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
          <CardContent className="flex items-center justify-center py-12 p-3 sm:p-6">
            <div className="text-center">
              <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Không có quyền hạn
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">
                Không tìm thấy quyền hạn cho lựa chọn này
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
          <CardContent className="flex items-center justify-center py-12 p-3 sm:p-6">
            <div className="text-center">
              <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Chọn vị trí hoặc cấp bậc
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">
                Vui lòng chọn ít nhất một vị trí hoặc cấp bậc để xem quyền hạn
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}