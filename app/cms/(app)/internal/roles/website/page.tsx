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

export default function RolesWebsite() {
  const dispatch = useDispatch();
  const { positionRoles, levelPositionRoles, groupPreRoles } = useRoleData();

  const [selectedPosition, setSelectedPosition] = useState<number | undefined>(undefined);
  const [selectedLevel, setSelectedLevel] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(listRolePositionWebsite() as any);
    dispatch(listRoleLevelPositionWebsite() as any);
  }, [dispatch]);

  // Gọi API khi có sự thay đổi trong selection
  useEffect(() => {
    if (selectedPosition || selectedLevel) {
      setIsLoading(true);
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

  const handlePermissionToggle = async (groupId: number, itemId: number, currentStatus: boolean) => {
    if (!selectedPosition && !selectedLevel) {
      toast.error("Vui lòng chọn vị trí hoặc cấp bậc");
      return;
    }

    try {
      setIsSaving(true);

      // Tạo mảng permissions từ tất cả các item đang được bật
      const permissions: number[] = [];
      groupPreRoles?.forEach((group: any) => {
        group.items.forEach((item: any) => {
          // Nếu là item đang toggle, thì thêm/bỏ dựa vào trạng thái mới
          if (item.item_id === itemId) {
            if (!currentStatus) {
              permissions.push(item.item_id);
            }
          } else {
            // Các item khác giữ nguyên trạng thái
            if (item.status) {
              permissions.push(item.item_id);
            }
          }
        });
      });

      // Gọi API update
      await dispatch(
        updateRolePositionUser({
          level_id: selectedLevel,
          position_id: selectedPosition,
          permissions: permissions,
        } as any) as any
      );

      toast.success(`Quyền đã được ${!currentStatus ? 'bật' : 'tắt'}`);

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
              disabled={isSaving}
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
              disabled={isSaving}
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
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
            <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Danh sách Quyền hạn
            </h2>
          </div>

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
                  {group.items.map((item: any) => (
                    <div
                      key={item.item_id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-gray-800/50 hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Checkbox
                          id={`perm-${group.group_id}-${item.item_id}`}
                          checked={item.status}
                          disabled={isSaving}
                          onCheckedChange={() =>
                            handlePermissionToggle(
                              group.group_id,
                              item.item_id,
                              item.status
                            )
                          }
                          className="border-gray-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 flex-shrink-0"
                        />
                        <Label
                          htmlFor={`perm-${group.group_id}-${item.item_id}`}
                          className="cursor-pointer font-medium text-gray-200 text-sm sm:text-base"
                        >
                          {item.item_name}
                        </Label>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                          item.status
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            : "bg-gray-700/50 text-gray-400 border border-gray-600"
                        }`}
                      >
                        {item.status ? "Đã bật" : "Đã tắt"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
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