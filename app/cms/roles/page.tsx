"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Shield, User, UserCheck, Users as UsersIcon, Crown, Settings, Save, AlertTriangle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import InternalLayout from "@/components/cms-layout";

interface Role {
  id: number;
  name: string;
  displayName: string;
  description: string;
  isActive: boolean;
  userCount: number;
  permissions: Array<{
    module: string;
    permission: string;
    granted: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  position: string;
  companyName: string;
  departmentName: string;
  isActive: boolean;
  lastLogin: string;
  role: {
    id: number;
    name: string;
    displayName: string;
  };
}

interface Permission {
  id: number;
  module: string;
  type: string;
  description: string;
  is_active: boolean;
}

interface RolesData {
  roles: Role[];
  users: User[];
  availablePermissions: Permission[];
}

const ROLE_COLORS = {
  super_admin: 'bg-red-500/20 text-red-400 border-red-500/40',
  admin: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
  manager: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  employee: 'bg-green-500/20 text-green-400 border-green-500/40',
  guest: 'bg-gray-500/20 text-gray-400 border-gray-500/40'
};

const ROLE_ICONS = {
  super_admin: Crown,
  admin: Shield,
  manager: UserCheck,
  employee: User,
  guest: User
};

function RolesLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48 bg-purple-500/20" />
                <Skeleton className="h-4 w-32 bg-purple-500/20" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 bg-purple-500/20" />
                  <Skeleton className="h-6 w-20 bg-purple-500/20" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-9 bg-purple-500/20" />
                <Skeleton className="h-9 w-9 bg-purple-500/20" />
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

function RolePermissionEditor({ role, availablePermissions, onSave, onClose }: { 
  role: Role, 
  availablePermissions: Permission[], 
  onSave: () => void,
  onClose: () => void 
}) {
  const [permissions, setPermissions] = useState<Array<{module: string, permission: string, granted: boolean}>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Tạo danh sách quyền với trạng thái hiện tại của vai trò
    const rolePermissionMap = new Map();
    role.permissions.forEach(p => {
      rolePermissionMap.set(`${p.module}-${p.permission}`, p.granted);
    });

    const allPermissions = availablePermissions.map(p => ({
      module: p.module,
      permission: p.type,
      granted: rolePermissionMap.get(`${p.module}-${p.type}`) || false
    }));

    setPermissions(allPermissions);
  }, [role, availablePermissions]);

  const handlePermissionChange = (module: string, permission: string, granted: boolean) => {
    setPermissions(prev => prev.map(p => 
      p.module === module && p.permission === permission 
        ? { ...p, granted }
        : p
    ));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/roles/${role.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: role.name,
          display_name: role.displayName,
          description: role.description,
          permissions: permissions,
          is_active: role.isActive
        })
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Thành công",
          description: "Quyền vai trò đã được cập nhật",
        });
        onSave();
        onClose();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật quyền vai trò",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Nhóm quyền theo phân hệ
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Array<{module: string, permission: string, granted: boolean}>>);

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-black/90 pb-2 border-b border-purple-500/30">
        <h3 className="text-lg font-semibold text-white">
          Phân quyền cho vai trò: {role.displayName}
        </h3>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
          <Card key={module} className="bg-white/5 border-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm uppercase">{module}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {modulePermissions.map(permission => (
                <div key={`${permission.module}-${permission.permission}`} className="flex items-center justify-between">
                  <Label className="text-white/80 text-sm">{permission.permission}</Label>
                  <Switch
                    checked={permission.granted}
                    onCheckedChange={(checked) => handlePermissionChange(permission.module, permission.permission, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CreateRoleDialog({ availablePermissions, onSave, onClose }: { 
  availablePermissions: Permission[], 
  onSave: () => void,
  onClose: () => void 
}) {
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: ''
  });
  const [permissions, setPermissions] = useState<Array<{module: string, permission: string, granted: boolean}>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Khởi tạo quyền với tất cả là tắt
    const allPermissions = availablePermissions.map(p => ({
      module: p.module,
      permission: p.type,
      granted: false
    }));
    setPermissions(allPermissions);
  }, [availablePermissions]);

  const handlePermissionChange = (module: string, permission: string, granted: boolean) => {
    setPermissions(prev => prev.map(p => 
      p.module === module && p.permission === permission 
        ? { ...p, granted }
        : p
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.display_name || !formData.description) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          permissions: permissions
        })
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Thành công",
          description: "Vai trò mới đã được tạo thành công",
        });
        onSave();
        onClose();
        setFormData({ name: '', display_name: '', description: '' });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tạo vai trò mới",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Nhóm quyền theo phân hệ
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Array<{module: string, permission: string, granted: boolean}>>);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Tên vai trò (mã code)</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
            placeholder="vd: truong_phong_kinh_doanh"
          />
        </div>
        
        <div>
          <Label htmlFor="display_name">Tên hiển thị</Label>
          <Input
            id="display_name"
            value={formData.display_name}
            onChange={(e) => setFormData({...formData, display_name: e.target.value})}
            className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
            placeholder="vd: Trưởng Phòng Kinh Doanh"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
          placeholder="Mô tả chi tiết về vai trò này..."
        />
      </div>
      
      <div>
        <Label className="text-white mb-3 block">Phân quyền</Label>
        <div className="max-h-60 overflow-y-auto border border-purple-500/30 rounded-lg p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
              <div key={module} className="space-y-2">
                <h4 className="text-white font-medium text-sm uppercase">{module}</h4>
                {modulePermissions.map(permission => (
                  <div key={`${permission.module}-${permission.permission}`} className="flex items-center justify-between">
                    <Label className="text-white/80 text-xs">{permission.permission}</Label>
                    <Switch
                      checked={permission.granted}
                      onCheckedChange={(checked) => handlePermissionChange(permission.module, permission.permission, checked)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Hủy bỏ</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Đang tạo..." : "Tạo vai trò"}
        </Button>
      </div>
    </form>
  );
}

function UserRoleManager({ users, roles, onSave }: { 
  users: User[], 
  roles: Role[], 
  onSave: () => void 
}) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRoleId, setNewRoleId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeRole = async () => {
    if (!selectedUser || !newRoleId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/roles/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role_id: parseInt(newRoleId) })
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Thành công", 
          description: data.message,
        });
        onSave();
        setSelectedUser(null);
        setNewRoleId('');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể thay đổi vai trò",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Chọn người dùng</Label>
          <Select value={selectedUser?.id.toString() || ''} onValueChange={(value) => {
            const user = users.find(u => u.id.toString() === value);
            setSelectedUser(user || null);
            setNewRoleId(user?.role.id.toString() || '');
          }}>
            <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
              <SelectValue placeholder="Chọn người dùng" />
            </SelectTrigger>
            <SelectContent>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name} ({user.role.displayName})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Chọn vai trò mới</Label>
          <Select value={newRoleId} onValueChange={setNewRoleId}>
            <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
              <SelectValue placeholder="Chọn vai trò" />
            </SelectTrigger>
            <SelectContent>
              {roles.map(role => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.displayName} ({role.userCount} người dùng)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedUser && (
        <Card className="bg-white/5 border-purple-500/30">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">{selectedUser.name}</h4>
                <p className="text-white/60 text-sm">{selectedUser.email}</p>
                <p className="text-white/60 text-sm">Hiện tại: {selectedUser.role.displayName}</p>
              </div>
              <Button 
                onClick={handleChangeRole} 
                disabled={isLoading || newRoleId === selectedUser.role.id.toString()}
              >
                {isLoading ? "Đang thay đổi..." : "Thay đổi vai trò"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function RolesContent() {
  const [data, setData] = useState<RolesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showUserManager, setShowUserManager] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/roles');
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu vai trò",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRole = async (role: Role) => {
    try {
      const response = await fetch(`/api/roles/${role.id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        toast({
          title: "Thành công",
          description: "Vai trò đã được xóa",
        });
        fetchData();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa vai trò",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <RolesLoadingSkeleton />;
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <Shield className="h-16 w-16 mx-auto text-purple-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Không thể tải dữ liệu vai trò</h2>
        <p className="text-white/60 mb-4">Có lỗi khi kết nối đến cơ sở dữ liệu</p>
        <Button onClick={fetchData} className="bg-purple-600 hover:bg-purple-700">
          <Settings className="h-4 w-4 mr-2" />
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Quản lý Vai trò & Phân quyền
          </h1>
          <p className="text-white/80">Quản lý vai trò và phân quyền theo nhóm người dùng</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Tạo vai trò mới
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-4xl">
              <DialogHeader>
                <DialogTitle>Tạo vai trò mới</DialogTitle>
                <DialogDescription>Tạo vai trò mới với các quyền tùy chỉnh</DialogDescription>
              </DialogHeader>
              <CreateRoleDialog 
                availablePermissions={data.availablePermissions}
                onSave={() => {
                  fetchData();
                  setShowCreateDialog(false);
                }} 
                onClose={() => setShowCreateDialog(false)} 
              />
            </DialogContent>
          </Dialog>
          <Button 
            onClick={() => setShowUserManager(!showUserManager)} 
            variant="outline" 
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            <UsersIcon className="h-4 w-4 mr-2" />
            {showUserManager ? 'Ẩn' : 'Quản lý'} Người dùng
          </Button>
        </div>
      </div>

      {/* User Role Manager */}
      {showUserManager && (
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Thay đổi vai trò cho người dùng</CardTitle>
            <CardDescription className="text-white/80">
              Gán vai trò mới cho người dùng trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserRoleManager
              users={data.users}
              roles={data.roles}
              onSave={fetchData}
            />
          </CardContent>
        </Card>
      )}

      {/* Role Permission Editor */}
      {selectedRole && (
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">
                Chỉnh sửa quyền vai trò
              </CardTitle>
              <Button variant="outline" onClick={() => setSelectedRole(null)}>
                Đóng
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <RolePermissionEditor
              role={selectedRole}
              availablePermissions={data.availablePermissions}
              onSave={() => {
                fetchData();
                setSelectedRole(null);
              }}
              onClose={() => setSelectedRole(null)}
            />
          </CardContent>
        </Card>
      )}

      {/* Roles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.roles.map(role => {
          const IconComponent = ROLE_ICONS[role.name as keyof typeof ROLE_ICONS] || Shield;
          const colorClass = ROLE_COLORS[role.name as keyof typeof ROLE_COLORS] || 'bg-purple-500/20 text-purple-400 border-purple-500/40';
          
          return (
            <Card key={role.id} className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${colorClass}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{role.displayName}</CardTitle>
                      <Badge className={colorClass}>
                        {role.userCount} người dùng
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 w-8 p-0 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40" 
                      onClick={() => setSelectedRole(role)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {role.userCount === 0 && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0 bg-white/10 hover:bg-red-500/20 text-white border border-white/20 hover:border-red-500/40 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-black/90 border-purple-500/30 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-red-400" />
                              Xác nhận xóa
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-white/80">
                              Bạn có chắc chắn muốn xóa vai trò <strong>{role.displayName}</strong>? 
                              Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white/10 hover:bg-white/20 text-white border border-white/20">Hủy</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => handleDeleteRole(role)}
                            >
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 text-sm mb-3">{role.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Quyền hạn:</span>
                    <span className="text-white">
                      {role.permissions.filter(p => p.granted).length} / {data.availablePermissions.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Trạng thái:</span>
                    <Badge className={role.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                      {role.isActive ? 'Hoạt động' : 'Tạm dừng'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Users by Role */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Người dùng theo vai trò</CardTitle>
          <CardDescription className="text-white/80">
            Danh sách người dùng và vai trò hiện tại của họ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.users.map(user => {
              const IconComponent = ROLE_ICONS[user.role.name as keyof typeof ROLE_ICONS] || User;
              const colorClass = ROLE_COLORS[user.role.name as keyof typeof ROLE_COLORS] || 'bg-purple-500/20 text-purple-400 border-purple-500/40';

              return (
                <Card key={user.id} className="bg-white/5 border-purple-500/30">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{user.name}</h4>
                        <p className="text-white/60 text-xs">{user.email}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <IconComponent className="h-3 w-3" />
                          <Badge className={`${colorClass} text-xs`}>
                            {user.role.displayName}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
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