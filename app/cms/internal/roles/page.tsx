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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Search,
  Edit,
  Shield,
  User,
  UserCheck,
  Users as UsersIcon,
  Crown,
  Settings,
  Save,
  Filter,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import InternalLayout from "@/components/cms-layout";
import { useEmployeeData } from "@/src/hook/employeeHook";
import { useDispatch } from "react-redux";
import { listEmployee } from "@/src/features/employee/employeeApi";
import { useRoleData } from "@/src/hook/roleHook";
import {
  listUserCMS,
  roleByUserId,
  updateRoleUser,
} from "@/src/features/role/roleApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { list } from "postcss";

function RolesContent() {
  const dispatch = useDispatch();
  const { roleById, users } = useRoleData();

  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);

  useEffect(() => {
    dispatch(listUserCMS() as any);
  }, [dispatch]);

  // Load permissions when employee is selected
  useEffect(() => {
    if (selectedEmployee) {
      setIsLoadingPermissions(true);
      dispatch(roleByUserId(selectedEmployee.id) as any).then(() => {
        setIsLoadingPermissions(false);
      });
    }
  }, [selectedEmployee, dispatch]);

  // Update selected permissions when roleById changes
  useEffect(() => {
    if (roleById && Array.isArray(roleById)) {
      const activePermissionIds: number[] = [];
      roleById.forEach((group: any) => {
        if (group.permissions && Array.isArray(group.permissions)) {
          group.permissions.forEach((permission: any) => {
            if (permission.active) {
              activePermissionIds.push(permission.id);
            }
          });
        }
      });
      setSelectedPermissions(activePermissionIds);
    }
  }, [roleById]);

  // Filter out invalid employees and apply search
  const validEmployees = users?.filter((emp: any) => emp.name && emp.email);

  const filteredEmployees = validEmployees?.filter((emp: any) => {
    const matchesSearch =
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Handle permission toggle
  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  // Handle group toggle (select/deselect all permissions in a group)
  const handleGroupToggle = (groupPermissions: any[]) => {
    const groupPermissionIds = groupPermissions.map((p) => p.id);
    const allSelected = groupPermissionIds.every((id) =>
      selectedPermissions.includes(id)
    );

    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !groupPermissionIds.includes(id))
      );
    } else {
      setSelectedPermissions((prev) => [
        ...new Set([...prev, ...groupPermissionIds]),
      ]);
    }
  };

  // Handle save permissions
  const handleSavePermissions = async () => {
    if (!selectedEmployee) return;

    setIsSaving(true);
    try {
      // Get all permission IDs from all groups
      const allPermissionIds: number[] = [];
      if (roleById && Array.isArray(roleById)) {
        roleById.forEach((group: any) => {
          if (group.permissions && Array.isArray(group.permissions)) {
            group.permissions.forEach((permission: any) => {
              allPermissionIds.push(permission.id);
            });
          }
        });
      }

      // Format permissions: selected ones as true, unselected as false
      const formattedPermissions = allPermissionIds.map((permissionId) => ({
        id: permissionId,
        status: selectedPermissions.includes(permissionId),
      }));

      const res = await dispatch(
        updateRoleUser({
          id: selectedEmployee.id,
          permissions: formattedPermissions,
        } as any) as any
      );

      if (res.payload.status == 200 || res.payload.status == 201) {
        toast.success(res.payload.data.message);

        setIsDialogOpen(false);

        // Refresh user list
        dispatch(listUserCMS() as any);
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi lưu phân quyền.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle edit click
  const handleEditEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
            <h1 className="text-xl sm:text-3xl font-bold text-white">
              Quản lý phân quyền
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Cấu hình quyền truy cập cho nhân viên
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
        <CardContent className="p-3 sm:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 sm:pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 text-sm sm:text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-white text-base sm:text-lg">
            Danh sách nhân viên
          </CardTitle>
          <CardDescription className="text-gray-400 text-xs sm:text-sm">
            Nhấn vào nút chỉnh sửa để cấu hình quyền cho nhân viên
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {filteredEmployees?.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-400 text-sm sm:text-base">
                  Không tìm thấy nhân viên
                </p>
              </div>
            ) : (
              filteredEmployees?.map((employee: any) => (
                <Card
                  key={employee.id}
                  className="border-gray-800 bg-gray-800/50 hover:bg-gray-800 transition-all duration-200"
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-gray-700 flex-shrink-0">
                          <AvatarImage src={employee.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold text-sm sm:text-base">
                            {getInitials(employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                            {employee.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-400 truncate">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditEmployee(employee)}
                        className="border-gray-700 hover:bg-purple-500/20 hover:border-purple-500 flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Phân quyền</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Permissions Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-[95vw] sm:max-w-4xl max-h-[90vh] sm:max-h-[85vh] p-4 sm:p-6">
          <DialogHeader className="space-y-2 sm:space-y-3">
            <DialogTitle className="text-lg sm:text-2xl flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md sm:rounded-lg flex-shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="truncate">
                Phân quyền cho {selectedEmployee?.name}
              </span>
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-xs sm:text-sm">
              Chọn các quyền truy cập cho nhân viên này
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-200px)] sm:max-h-[calc(85vh-200px)] pr-2 sm:pr-4">
            {isLoadingPermissions ? (
              <div className="flex items-center justify-center py-8 sm:py-12">
                <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-purple-500" />
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {roleById?.map((group: any, index: number) => (
                  <Card
                    key={group.group_id}
                    className="border-gray-800 bg-gray-800/50"
                  >
                    <CardHeader className="pb-3 sm:pb-4 p-3 sm:p-6">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm sm:text-lg text-white flex items-center gap-2">
                            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                            <span className="truncate">{group.group_name}</span>
                          </CardTitle>
                          <CardDescription className="text-gray-400 mt-1 text-xs sm:text-sm line-clamp-2">
                            {group.group_description}
                          </CardDescription>
                        </div>
                        {group.permissions && group.permissions.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleGroupToggle(group.permissions)}
                            className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3"
                          >
                            {group.permissions.every((p: any) =>
                              selectedPermissions.includes(p.id)
                            )
                              ? "Bỏ chọn"
                              : "Chọn tất cả"}
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      {!group.permissions || group.permissions.length === 0 ? (
                        <p className="text-gray-500 text-xs sm:text-sm italic">
                          Nhóm quyền này chưa có quyền cụ thể
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 gap-2 sm:gap-3">
                          {group.permissions.map((permission: any) => (
                            <div
                              key={permission.id}
                              className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-700/30 transition-colors"
                            >
                              <Checkbox
                                id={`permission-${permission.id}`}
                                checked={selectedPermissions.includes(
                                  permission.id
                                )}
                                onCheckedChange={() =>
                                  handlePermissionToggle(permission.id)
                                }
                                className="mt-0.5 border-gray-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <Label
                                  htmlFor={`permission-${permission.id}`}
                                  className="text-xs sm:text-sm font-medium text-white cursor-pointer break-words"
                                >
                                  {permission.name}
                                </Label>
                                {permission.description && (
                                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 break-words">
                                    {permission.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>

          <Separator className="bg-gray-800 my-3 sm:my-4" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-2 sm:pt-4">
            <div className="text-xs sm:text-sm text-gray-400">
              Đã chọn:{" "}
              <span className="text-white font-semibold">
                {selectedPermissions.length}
              </span>{" "}
              quyền
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-gray-700 hover:bg-gray-800 flex-1 sm:flex-none text-xs sm:text-sm"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSavePermissions}
                disabled={isSaving}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex-1 sm:flex-none text-xs sm:text-sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Lưu thay đổi
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

export default function RolesPage() {
  return (
    <InternalLayout>
      <RolesContent />
    </InternalLayout>
  );
}