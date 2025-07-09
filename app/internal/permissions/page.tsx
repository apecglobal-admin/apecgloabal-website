import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, Shield, User, UserCheck, Users as UsersIcon, Check, X as XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import InternalLayout from "@/components/internal-layout";

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

const permissionsData = [
  { id: 1, name: "admin", description: "Quyền quản trị hệ thống" },
  { id: 2, name: "portal_access", description: "Truy cập cổng nội bộ" },
  { id: 3, name: "user_management", description: "Quản lý người dùng" },
  { id: 4, name: "content_management", description: "Quản lý nội dung" },
  { id: 5, name: "team_management", description: "Quản lý nhóm" },
  { id: 6, name: "project_management", description: "Quản lý dự án" },
  { id: 7, name: "view_reports", description: "Xem báo cáo" },
  { id: 8, name: "edit_reports", description: "Chỉnh sửa báo cáo" },
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

function PermissionsMatrix() {
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-purple-500/30">
            <th className="text-left p-3 text-white">Người dùng</th>
            {permissionsData.map(permission => (
              <th key={permission.id} className="p-3 text-white text-center">
                <div className="whitespace-nowrap">{permission.name}</div>
                <div className="text-xs text-white/60">{permission.description}</div>
              </th>
            ))}
            <th className="p-3 text-white text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {usersData.map(user => (
            <tr key={user.id} className="border-b border-purple-500/30 hover:bg-white/5">
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{user.username}</div>
                    <div className="text-white/60 text-sm">{user.email}</div>
                    <Badge className={getRoleColor(user.role)}>
                      {getRoleText(user.role)}
                    </Badge>
                  </div>
                </div>
              </td>
              {permissionsData.map(permission => (
                <td key={`${user.id}-${permission.id}`} className="p-3 text-center">
                  {user.permissions.includes(permission.name) ? (
                    <Check className="h-5 w-5 text-green-400 mx-auto" />
                  ) : (
                    <XIcon className="h-5 w-5 text-red-400 mx-auto" />
                  )}
                </td>
              ))}
              <td className="p-3 text-center">
                <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40">
                  <Edit className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PermissionsContent() {
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
        <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Thêm quyền mới
        </Button>
      </div>

      {/* Permissions Matrix */}
      <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-white">
            Bảng phân quyền
          </CardTitle>
          <CardDescription className="text-white/80">
            Quản lý quyền truy cập cho từng người dùng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<PermissionsLoadingSkeleton />}>
            <PermissionsMatrix />
          </Suspense>
        </CardContent>
      </Card>

      {/* Permissions List */}
      <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-white">
            Danh sách quyền
          </CardTitle>
          <CardDescription className="text-white/80">
            Các quyền có sẵn trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {permissionsData.map(permission => (
              <Card key={permission.id} className="bg-white/5 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white text-base">{permission.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-7 w-7 p-0 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 w-7 p-0 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 hover:text-red-400">
                        <Trash2 className="h-3 w-3" />
                      </Button>
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