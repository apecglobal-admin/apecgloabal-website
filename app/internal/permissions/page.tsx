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
import { Plus, Edit, Trash2, Shield, User, UserCheck, Users as UsersIcon, Check, X as XIcon, Settings, Save, AlertTriangle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import InternalLayout from "@/components/internal-layout";

interface Permission {
  id: number;
  module: string;
  type: string;
  description: string;
  is_active: boolean;
}

interface UserPermission {
  module: string;
  permission: string;
  granted: boolean;
}

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  position: string;
  company_name: string;
  department_name: string;
  role: string;
  status: string;
  isActive: boolean;
  lastLogin: string;
  avatarUrl?: string;
  permissions: UserPermission[];
}

interface PermissionsData {
  users: User[];
  modules: Array<{id: string, name: string}>;
  availablePermissions: Permission[];
}

const PERMISSION_TYPES = [
  { value: 'view', label: 'Xem (View)' },
  { value: 'create', label: 'Tạo (Create)' },
  { value: 'edit', label: 'Sửa (Edit)' },
  { value: 'delete', label: 'Xóa (Delete)' }
];

const MODULES = [
  'dashboard', 'employees', 'departments', 'projects', 'reports', 
  'news', 'documents', 'services', 'jobs', 'companies', 'permissions', 'settings'
];

function PermissionsLoadingSkeleton() {
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

function AddPermissionDialog({ onAdd, onClose }: { onAdd: (permission: any) => void, onClose: () => void }) {
  const [formData, setFormData] = useState({
    module_name: '',
    permission_type: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.module_name || !formData.permission_type || !formData.description) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Thành công",
          description: "Quyền mới đã được tạo",
        });
        onAdd(data.data);
        onClose();
        setFormData({ module_name: '', permission_type: '', description: '' });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tạo quyền mới",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="module">Module</Label>
        <Select value={formData.module_name} onValueChange={(value) => setFormData({...formData, module_name: value})}>
          <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
            <SelectValue placeholder="Chọn module" />
          </SelectTrigger>
          <SelectContent>
            {MODULES.map(module => (
              <SelectItem key={module} value={module}>{module}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="permission_type">Loại quyền</Label>
        <Select value={formData.permission_type} onValueChange={(value) => setFormData({...formData, permission_type: value})}>
          <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
            <SelectValue placeholder="Chọn loại quyền" />
          </SelectTrigger>
          <SelectContent>
            {PERMISSION_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
          placeholder="Mô tả quyền này..."
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Đang tạo..." : "Tạo quyền"}
        </Button>
      </div>
    </form>
  );
}

function EditPermissionDialog({ permission, onEdit, onClose }: { permission: Permission, onEdit: (permission: any) => void, onClose: () => void }) {
  const [formData, setFormData] = useState({
    module_name: permission.module,
    permission_type: permission.type,
    description: permission.description,
    is_active: permission.is_active
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.module_name || !formData.permission_type || !formData.description) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/permissions/${permission.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Thành công",
          description: "Quyền đã được cập nhật",
        });
        onEdit(data.data);
        onClose();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật quyền",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="module">Module</Label>
        <Select value={formData.module_name} onValueChange={(value) => setFormData({...formData, module_name: value})}>
          <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MODULES.map(module => (
              <SelectItem key={module} value={module}>{module}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="permission_type">Loại quyền</Label>
        <Select value={formData.permission_type} onValueChange={(value) => setFormData({...formData, permission_type: value})}>
          <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERMISSION_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
        />
        <Label htmlFor="is_active">Kích hoạt</Label>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
      </div>
    </form>
  );
}

function UserPermissionEditor({ user, availablePermissions, onSave }: { user: User, availablePermissions: Permission[], onSave: (userId: number, permissions: UserPermission[]) => void }) {
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Tạo danh sách permissions với trạng thái hiện tại của user
    const userPermissionMap = new Map();
    user.permissions.forEach(p => {
      userPermissionMap.set(`${p.module}-${p.permission}`, p.granted);
    });

    const allPermissions = availablePermissions.map(p => ({
      module: p.module,
      permission: p.type,
      granted: userPermissionMap.get(`${p.module}-${p.type}`) || false
    }));

    setPermissions(allPermissions);
  }, [user, availablePermissions]);

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
      const response = await fetch(`/api/permissions/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions })
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Thành công",
          description: "Quyền người dùng đã được cập nhật",
        });
        onSave(user.id, permissions);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật quyền",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Nhóm permissions theo module
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, UserPermission[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Phân quyền cho {user.name}
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

function PermissionsContent() {
  const [data, setData] = useState<PermissionsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/permissions');
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu phân quyền",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setupPermissions = async () => {
    try {
      const response = await fetch('/api/permissions/setup', {
        method: 'POST'
      });
      const result = await response.json();
      if (result.success) {
        toast({
          title: "Thành công",
          description: result.message,
        });
        fetchData();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể khởi tạo quyền mặc định",
        variant: "destructive",
      });
    }
  };

  const handleDeletePermission = async (permission: Permission) => {
    try {
      const response = await fetch(`/api/permissions/${permission.id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        toast({
          title: "Thành công",
          description: "Quyền đã được xóa",
        });
        fetchData();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa quyền",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <PermissionsLoadingSkeleton />;
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <Shield className="h-16 w-16 mx-auto text-purple-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Chưa có dữ liệu phân quyền</h2>
        <p className="text-white/60 mb-4">Hệ thống phân quyền chưa được khởi tạo</p>
        <Button onClick={setupPermissions} className="bg-purple-600 hover:bg-purple-700">
          <Settings className="h-4 w-4 mr-2" />
          Khởi tạo hệ thống phân quyền
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
            Phân quyền người dùng
          </h1>
          <p className="text-white/80">Quản lý quyền truy cập của người dùng trong hệ thống</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Thêm quyền mới
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/90 border-purple-500/30 text-white">
              <DialogHeader>
                <DialogTitle>Thêm quyền mới</DialogTitle>
                <DialogDescription>Tạo quyền mới cho hệ thống</DialogDescription>
              </DialogHeader>
              <AddPermissionDialog 
                onAdd={() => fetchData()} 
                onClose={() => setShowAddDialog(false)} 
              />
            </DialogContent>
          </Dialog>
          <Button onClick={setupPermissions} variant="outline" className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
            <Settings className="h-4 w-4 mr-2" />
            Khởi tạo quyền mặc định
          </Button>
        </div>
      </div>

      {/* User Permissions Editor */}
      {selectedUser && (
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">
                Chỉnh sửa quyền người dùng
              </CardTitle>
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Đóng
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <UserPermissionEditor
              user={selectedUser}
              availablePermissions={data.availablePermissions}
              onSave={() => {
                fetchData();
                setSelectedUser(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Danh sách người dùng</CardTitle>
          <CardDescription className="text-white/80">
            Quản lý quyền cho từng người dùng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.users.map(user => (
              <Card key={user.id} className="bg-white/5 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-white text-sm">{user.name}</CardTitle>
                      <p className="text-white/60 text-xs">{user.email}</p>
                      <Badge className={user.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}>
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-white/80 text-xs">
                      <strong>Vị trí:</strong> {user.position}
                    </p>
                    <p className="text-white/80 text-xs">
                      <strong>Quyền:</strong> {user.permissions.filter(p => p.granted).length} / {data.availablePermissions.length}
                    </p>
                    <Button
                      onClick={() => setSelectedUser(user)}
                      size="sm"
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa quyền
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permissions List */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Danh sách quyền</CardTitle>
          <CardDescription className="text-white/80">
            Các quyền có sẵn trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.availablePermissions.map(permission => (
              <Card key={permission.id} className="bg-white/5 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-white text-sm">{permission.module}.{permission.type}</CardTitle>
                      <Badge className={permission.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                        {permission.is_active ? 'Kích hoạt' : 'Vô hiệu'}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Dialog open={editingPermission?.id === permission.id} onOpenChange={(open) => !open && setEditingPermission(null)}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="h-7 w-7 p-0 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40" onClick={() => setEditingPermission(permission)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-black/90 border-purple-500/30 text-white">
                          <DialogHeader>
                            <DialogTitle>Chỉnh sửa quyền</DialogTitle>
                            <DialogDescription>Cập nhật thông tin quyền</DialogDescription>
                          </DialogHeader>
                          {editingPermission && (
                            <EditPermissionDialog 
                              permission={editingPermission}
                              onEdit={() => {
                                fetchData();
                                setEditingPermission(null);
                              }}
                              onClose={() => setEditingPermission(null)}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="h-7 w-7 p-0 bg-white/10 hover:bg-red-500/20 text-white border border-white/20 hover:border-red-500/40 hover:text-red-400">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-black/90 border-purple-500/30 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-red-400" />
                              Xác nhận xóa
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-white/80">
                              Bạn có chắc chắn muốn xóa quyền <strong>{permission.module}.{permission.type}</strong>? 
                              Hành động này không thể hoàn tác và sẽ xóa tất cả phân quyền liên quan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white/10 hover:bg-white/20 text-white border border-white/20">Hủy</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => handleDeletePermission(permission)}
                            >
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 text-sm">{permission.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PermissionsPage() {
  return (
    <InternalLayout>
      <PermissionsContent />
    </InternalLayout>
  );
}