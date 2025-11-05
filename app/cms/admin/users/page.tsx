import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, Shield, User, UserCheck, Users as UsersIcon, Activity, Clock, Settings } from "lucide-react";
import Link from "next/link";

// Mock data - sẽ thay bằng API call thực tế
const usersData = [
  {
    id: 1,
    username: "admin",
    email: "admin@apecglobal.com",
    role: "admin",
    isActive: true,
    lastLogin: "2024-01-20T10:30:00",
    permissions: ["admin", "portal_access", "user_management", "content_management"],
    employeeId: 1,
    employeeName: "Nguyễn Văn A"
  },
  {
    id: 2,
    username: "manager1",
    email: "manager1@apecglobal.com",
    role: "manager",
    isActive: true,
    lastLogin: "2024-01-19T14:15:00",
    permissions: ["portal_access", "team_management", "project_management"],
    employeeId: 2,
    employeeName: "Trần Thị B"
  },
  {
    id: 3,
    username: "user1",
    email: "user1@apecglobal.com",
    role: "user",
    isActive: true,
    lastLogin: "2024-01-18T09:45:00",
    permissions: ["portal_access", "view_reports"],
    employeeId: 6,
    employeeName: "Vũ Thị F"
  },
  {
    id: 4,
    username: "user2",
    email: "user2@apecglobal.com",
    role: "user",
    isActive: false,
    lastLogin: "2024-01-10T16:20:00",
    permissions: ["portal_access"],
    employeeId: 7,
    employeeName: "Đặng Văn G"
  }
];

function UsersLoadingSkeleton() {
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
                <Skeleton className="h-9 w-9 bg-purple-500/20" />
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

function UsersContent() {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'manager': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'user': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Quản trị viên';
      case 'manager': return 'Quản lý';
      case 'user': return 'Người dùng';
      default: return 'Không xác định';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Hoạt động' : 'Tạm khóa';
  };

  return (
    <div className="space-y-4">
      {usersData.map((user) => (
        <Card key={user.id} className="bg-black/50 border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg text-white">{user.username}</CardTitle>
                  <Badge className={getRoleColor(user.role)}>
                    {getRoleText(user.role)}
                  </Badge>
                  <Badge className={getStatusColor(user.isActive)}>
                    {getStatusText(user.isActive)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <span className="flex items-center gap-1">
                    <span>📧</span>
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {user.employeeName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(user.lastLogin).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {user.permissions.map((permission, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-white/10 text-white border-white/20">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/cms/admin/users/permissions/${user.id}`}>
                  <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40">
                    <Shield className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/cms/admin/users/edit/${user.id}`}>
                  <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default function AdminUsersPage() {
  const totalUsers = usersData.length;
  const activeUsers = usersData.filter(user => user.isActive).length;
  const adminUsers = usersData.filter(user => user.role === 'admin').length;
  const managerUsers = usersData.filter(user => user.role === 'manager').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Quản lý người dùng
          </h1>
          <p className="text-white/80">Quản lý tài khoản và phân quyền người dùng</p>
        </div>
        <Link href="/cms/admin/users/create">
          <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Tạo người dùng mới
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105">
          <CardHeader className="text-center p-4 sm:p-6">
            <UsersIcon className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-blue-400 mb-3 sm:mb-4" />
            <CardTitle className="text-white text-base sm:text-lg">Tổng người dùng</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-3xl font-bold text-white text-center">{totalUsers}</p>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105">
          <CardHeader className="text-center p-4 sm:p-6">
            <Activity className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-green-400 mb-3 sm:mb-4" />
            <CardTitle className="text-white text-base sm:text-lg">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-3xl font-bold text-white text-center">{activeUsers}</p>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105">
          <CardHeader className="text-center p-4 sm:p-6">
            <Shield className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-red-400 mb-3 sm:mb-4" />
            <CardTitle className="text-white text-base sm:text-lg">Quản trị viên</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-3xl font-bold text-white text-center">{adminUsers}</p>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105">
          <CardHeader className="text-center p-4 sm:p-6">
            <Settings className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-purple-400 mb-3 sm:mb-4" />
            <CardTitle className="text-white text-base sm:text-lg">Quản lý</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-3xl font-bold text-white text-center">{managerUsers}</p>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-white">
            Danh sách người dùng
          </CardTitle>
          <CardDescription className="text-white/80">
            Tất cả tài khoản người dùng trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<UsersLoadingSkeleton />}>
            <UsersContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}