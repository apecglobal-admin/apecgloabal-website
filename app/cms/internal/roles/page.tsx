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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Quản lý phân quyền
            </h1>
            <p className="text-gray-400">
              Cấu hình quyền truy cập cho nhân viên
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white">Danh sách nhân viên</CardTitle>
          <CardDescription className="text-gray-400">
            Nhấn vào nút chỉnh sửa để cấu hình quyền cho nhân viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEmployees?.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Không tìm thấy nhân viên</p>
              </div>
            ) : (
              filteredEmployees?.map((employee: any) => (
                <Card
                  key={employee.id}
                  className="border-gray-800 bg-gray-800/50 hover:bg-gray-800 transition-all duration-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 border-2 border-gray-700">
                          <AvatarImage src={employee.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                            {getInitials(employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-white">
                            {employee.name}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEmployee(employee)}
                          className="border-gray-700 hover:bg-purple-500/20 hover:border-purple-500"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Phân quyền
                        </Button>
                      </div>
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
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl max-h-[100vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Shield className="w-5 h-5" />
              </div>
              Phân quyền cho {selectedEmployee?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Chọn các quyền truy cập cho nhân viên này
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] pr-4">
            {isLoadingPermissions ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              </div>
            ) : (
              <div className="space-y-6">
                {roleById?.map((group: any, index: number) => (
                  <Card
                    key={group.group_id}
                    className="border-gray-800 bg-gray-800/50"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-white flex items-center gap-2">
                            <Settings className="w-5 h-5 text-purple-400" />
                            {group.group_name}
                          </CardTitle>
                          <CardDescription className="text-gray-400 mt-1">
                            {group.group_description}
                          </CardDescription>
                        </div>
                        {group.permissions && group.permissions.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleGroupToggle(group.permissions)}
                            className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                          >
                            {group.permissions.every((p: any) =>
                              selectedPermissions.includes(p.id)
                            )
                              ? "Bỏ chọn tất cả"
                              : "Chọn tất cả"}
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {!group.permissions || group.permissions.length === 0 ? (
                        <p className="text-gray-500 text-sm italic">
                          Nhóm quyền này chưa có quyền cụ thể
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {group.permissions.map((permission: any) => (
                            <div
                              key={permission.id}
                              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-700/30 transition-colors"
                            >
                              <Checkbox
                                id={`permission-${permission.id}`}
                                checked={selectedPermissions.includes(
                                  permission.id
                                )}
                                onCheckedChange={() =>
                                  handlePermissionToggle(permission.id)
                                }
                                className="mt-0.5 border-gray-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor={`permission-${permission.id}`}
                                  className="text-sm font-medium text-white cursor-pointer"
                                >
                                  {permission.name}
                                </Label>
                                {permission.description && (
                                  <p className="text-xs text-gray-500 mt-1">
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

          <Separator className="bg-gray-800" />

          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-gray-400">
              Đã chọn:{" "}
              <span className="text-white font-semibold">
                {selectedPermissions.length}
              </span>{" "}
              quyền
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-gray-700 hover:bg-gray-800"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSavePermissions}
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
                    <Save className="w-4 h-4 mr-2" />
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