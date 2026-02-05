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
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Search,
  Edit,
  Shield,
  User,
  Users as UsersIcon,
  Crown,
  Settings,
  Save,
  Filter,
  CheckCircle2,
  XCircle,
  Loader2,
  UserPlus,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useRoleData } from "@/src/hook/roleHook";
import {
  listRoles,
  listUserCMS,
  roleByUserId,
  updateRoleUser,
  createUserCMS,
} from "@/src/features/role/roleApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useEmployeeData } from "@/src/hook/employeeHook";
import { listEmployee } from "@/src/features/employee/employeeApi";
import { cn } from "@/lib/utils";

export default function RolesContent() {
  const dispatch = useDispatch();
  const { roleById, users, roles } = useRoleData();
  const { employees, totalEmployees } = useEmployeeData();

  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchEmployeeTerm, setSearchEmployeeTerm] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  // Form state for new user
  const [newUserForm, setNewUserForm] = useState({
    username: "",
    email: "",
    password: "",
    employee_id: "",
    role_id: "",
  });

  useEffect(() => {
    dispatch(listUserCMS() as any);
    dispatch(listRoles() as any);
    dispatch(listEmployee({ limit: totalEmployees, page: 1 } as any) as any);
  }, [dispatch, totalEmployees]);

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
      
      // Auto select first group
      if (roleById.length > 0 && selectedGroupId === null) {
        setSelectedGroupId(roleById[0].group_id);
      }
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

  // Filter employees for add dialog (exclude those already in users)
  const availableEmployees = employees?.filter((emp: any) => {
    const isAlreadyUser = users?.some((user: any) => user.id === emp.id);
    const matchesSearch =
      emp.name?.toLowerCase().includes(searchEmployeeTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchEmployeeTerm.toLowerCase()) ||
      emp.id?.toString().includes(searchEmployeeTerm);
    return !isAlreadyUser && matchesSearch && emp.name && emp.email;
  });

  // Get selected group
  const selectedGroup = roleById?.find(
    (group: any) => group.group_id === selectedGroupId
  );

  // Handle permission toggle
  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

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

  const handleSavePermissions = async () => {
    if (!selectedEmployee) return;

    setIsSaving(true);
    try {
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
        dispatch(listUserCMS() as any);
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi lưu phân quyền.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle create new user
  const handleCreateUser = async () => {
    // Validation
    if (!newUserForm.username.trim()) {
      toast.error("Vui lòng nhập tên đăng nhập");
      return;
    }
    if (!newUserForm.email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }
    if (!newUserForm.password.trim()) {
      toast.error("Vui lòng nhập mật khẩu");
      return;
    }
    if (!newUserForm.employee_id) {
      toast.error("Vui lòng chọn nhân viên");
      return;
    }
    if (!newUserForm.role_id) {
      toast.error("Vui lòng chọn vai trò");
      return;
    }

    setIsCreating(true);
    try {
      const res = await dispatch(
        createUserCMS({
          username: newUserForm.username,
          email: newUserForm.email,
          password: newUserForm.password,
          employee_id: parseInt(newUserForm.employee_id),
          role_id: parseInt(newUserForm.role_id),
        } as any) as any
      );

      if (res.payload.status == 200 || res.payload.status == 201) {
        toast.success(res.payload.data.message);
        setIsAddDialogOpen(false);
        // Reset form
        setNewUserForm({
          username: "",
          email: "",
          password: "",
          employee_id: "",
          role_id: "",
        });
        setSearchEmployeeTerm("");
        // Refresh user list
        dispatch(listUserCMS() as any);
      } else {
        toast.error(res.payload.data?.message || "Đã có lỗi xảy ra");
      }
    } catch (error: any) {
      toast.error(error?.message || "Đã có lỗi xảy ra khi thêm nhân viên");
    } finally {
      setIsCreating(false);
    }
  };

  // Handle edit click
  const handleEditEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setSelectedGroupId(null);
    setIsDialogOpen(true);
  };

  // Handle employee selection for new user
  const handleEmployeeSelect = (employeeId: string) => {
    const selectedEmp = employees?.find(
      (emp: any) => emp.id.toString() === employeeId
    );
    if (selectedEmp) {
      setNewUserForm({
        ...newUserForm,
        employee_id: employeeId,
        username: selectedEmp.name || "",
        email: selectedEmp.email || "",
      });
    }
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-base sm:text-lg">
                Danh sách user
              </CardTitle>
              <CardDescription className="text-gray-400 text-xs sm:text-sm">
                Nhấn vào nút chỉnh sửa để cấu hình quyền cho nhân viên
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-xs sm:text-sm"
            >
              <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Thêm user
            </Button>
          </div>
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

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-2xl flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md sm:rounded-lg">
                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              Thêm nhân viên mới
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Thêm nhân viên vào hệ thống CMS
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="employee" className="text-white">
                Chọn nhân viên *
              </Label>
              <Select
                value={newUserForm.employee_id}
                onValueChange={handleEmployeeSelect}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-full">
                  <SelectValue placeholder="Tìm và chọn nhân viên..." />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 max-h-[300px] w-full">
                  <div className="px-2 pb-2 sticky top-0 bg-gray-800 z-10">
                    <Input
                      placeholder="Tìm kiếm nhân viên..."
                      value={searchEmployeeTerm}
                      onChange={(e) => setSearchEmployeeTerm(e.target.value)}
                      className="h-8 bg-gray-900 border-gray-700 text-white"
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                  {availableEmployees?.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      Không tìm thấy nhân viên
                    </div>
                  ) : (
                    availableEmployees?.map((emp: any) => (
                      <SelectItem
                        key={emp.id}
                        value={emp.id.toString()}
                        className="text-white hover:bg-gray-700"
                      >
                        <div className="flex flex-col">
                          <span>{emp.name}</span>
                        
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="username" className="text-white">
                Tên đăng nhập *
              </Label>
              <Input
                id="username"
                placeholder="Nhập tên đăng nhập"
                value={newUserForm.username}
                onChange={(e) =>
                  setNewUserForm({ ...newUserForm, username: e.target.value })
                }
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-white">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={newUserForm.email}
                onChange={(e) =>
                  setNewUserForm({ ...newUserForm, email: e.target.value })
                }
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white">
                Mật khẩu *
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={newUserForm.password}
                onChange={(e) =>
                  setNewUserForm({ ...newUserForm, password: e.target.value })
                }
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="role" className="text-white">
                Vai trò *
              </Label>
              <Select
                value={newUserForm.role_id}
                onValueChange={(value) =>
                  setNewUserForm({ ...newUserForm, role_id: value })
                }
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-full">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 w-full">
                  {roles?.map((role: any) => (
                    <SelectItem
                      key={role.id}
                      value={role.id.toString()}
                      className="text-white hover:bg-gray-700"
                    >
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="bg-gray-800" />

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setNewUserForm({
                  username: "",
                  email: "",
                  password: "",
                  employee_id: "",
                  role_id: "",
                });
                setSearchEmployeeTerm("");
              }}
              className="border-gray-700 hover:bg-gray-800"
            >
              Hủy
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={isCreating}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Tạo tài khoản
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Permissions Dialog - WITH SIDEBAR */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-[95vw] sm:max-w-6xl max-h-[90vh] p-0">
          <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
            <DialogTitle className="text-lg sm:text-2xl flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md sm:rounded-lg flex-shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="truncate">
                Phân quyền cho {selectedEmployee?.name}
              </span>
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-xs sm:text-sm">
              Chọn nhóm quyền bên trái và cấu hình các quyền cụ thể bên phải
            </DialogDescription>
          </DialogHeader>

          {isLoadingPermissions ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
          ) : (
            <div className="flex h-[calc(90vh-200px)] sm:h-[calc(90vh-220px)]">
              {/* Sidebar - Group List */}
              <div className="w-64 sm:w-72 border-r border-gray-800 bg-gray-800/30">
                <ScrollArea className="h-full">
                  <div className="p-3 sm:p-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Nhóm quyền
                    </h3>
                    <div className="space-y-1">
                      {roleById?.map((group: any) => {
                        const groupPermissionIds = group.permissions?.map(
                          (p: any) => p.id
                        ) || [];
                        const selectedCount = groupPermissionIds.filter((id: number) =>
                          selectedPermissions.includes(id)
                        ).length;
                        const totalCount = groupPermissionIds.length;

                        return (
                          <button
                            key={group.group_id}
                            onClick={() => setSelectedGroupId(group.group_id)}
                            className={cn(
                              "w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 group",
                              selectedGroupId === group.group_id
                                ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50"
                                : "hover:bg-gray-700/50 border border-transparent"
                            )}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <Settings
                                  className={cn(
                                    "w-4 h-4 flex-shrink-0",
                                    selectedGroupId === group.group_id
                                      ? "text-purple-400"
                                      : "text-gray-500 group-hover:text-gray-400"
                                  )}
                                />
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={cn(
                                      "text-sm font-medium truncate",
                                      selectedGroupId === group.group_id
                                        ? "text-white"
                                        : "text-gray-300"
                                    )}
                                  >
                                    {group.group_name}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {selectedCount}/{totalCount} quyền
                                  </p>
                                </div>
                              </div>
                              <ChevronRight
                                className={cn(
                                  "w-4 h-4 flex-shrink-0 transition-transform",
                                  selectedGroupId === group.group_id
                                    ? "text-purple-400 translate-x-0.5"
                                    : "text-gray-600 group-hover:text-gray-500"
                                )}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </ScrollArea>
              </div>

              {/* Main Content - Permissions Detail */}
              <div className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 px-4 sm:px-6">
                  {selectedGroup ? (
                    <div className="py-4">
                      {/* Group Header */}
                      <div className="mb-6">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h2 className="text-xl font-bold text-white mb-1">
                              {selectedGroup.group_name}
                            </h2>
                            <p className="text-sm text-gray-400">
                              {selectedGroup.group_description}
                            </p>
                          </div>
                          {selectedGroup.permissions &&
                            selectedGroup.permissions.length > 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleGroupToggle(selectedGroup.permissions)
                                }
                                className="border-gray-700 hover:bg-purple-500/10 hover:border-purple-500 text-purple-400 flex-shrink-0"
                              >
                                {selectedGroup.permissions.every((p: any) =>
                                  selectedPermissions.includes(p.id)
                                )
                                  ? "Bỏ chọn tất cả"
                                  : "Chọn tất cả"}
                              </Button>
                            )}
                        </div>
                        <Separator className="bg-gray-800" />
                      </div>

                      {/* Permissions List */}
                      {!selectedGroup.permissions ||
                      selectedGroup.permissions.length === 0 ? (
                        <div className="text-center py-12">
                          <Settings className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-500">
                            Nhóm quyền này chưa có quyền cụ thể
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                          {selectedGroup.permissions.map((permission: any) => (
                            <div
                              key={permission.id}
                              className={cn(
                                "flex items-start gap-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer",
                                selectedPermissions.includes(permission.id)
                                  ? "border-purple-500/50 bg-purple-500/10"
                                  : "border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 hover:border-gray-600"
                              )}
                              onClick={() =>
                                handlePermissionToggle(permission.id)
                              }
                            >
                              <Checkbox
                                id={`permission-${permission.id}`}
                                checked={selectedPermissions.includes(
                                  permission.id
                                )}
                                onCheckedChange={() =>
                                  handlePermissionToggle(permission.id)
                                }
                                className="border-gray-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 mt-0.5 flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <Label
                                  htmlFor={`permission-${permission.id}`}
                                  className="text-sm font-medium text-white cursor-pointer block mb-1"
                                >
                                  {permission.name}
                                </Label>
                                {permission.description && (
                                  <p className="text-xs text-gray-500 leading-relaxed">
                                    {permission.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">
                          Chọn một nhóm quyền để xem chi tiết
                        </p>
                      </div>
                    </div>
                  )}
                </ScrollArea>

                {/* Footer */}
                <div className="border-t border-gray-800 p-4 sm:p-6 bg-gray-900/50">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
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
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}