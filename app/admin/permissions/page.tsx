"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Search, Shield, Users, Lock, Check, X } from "lucide-react";
import AdminLayout from "@/components/admin/layout";

export default function PermissionsPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Lấy danh sách nhân viên và quyền
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/admin/employees-permissions");
        
        if (!response.ok) {
          throw new Error("Không thể lấy danh sách nhân viên");
        }
        
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("Đã xảy ra lỗi khi lấy danh sách nhân viên");
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployees();
  }, []);

  // Lọc nhân viên theo từ khóa tìm kiếm
  const filteredEmployees = employees.filter(employee => 
    employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cập nhật quyền cho nhân viên
  const updatePermission = async (employeeId, permissionType, value) => {
    setSaving(true);
    setSuccessMessage("");
    
    try {
      const response = await fetch("/api/admin/update-permission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_id: employeeId,
          permission_type: permissionType,
          value: value
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Không thể cập nhật quyền");
      }
      
      // Cập nhật state
      setEmployees(employees.map(emp => {
        if (emp.id === employeeId) {
          return {
            ...emp,
            permissions: {
              ...emp.permissions,
              [permissionType]: value
            }
          };
        }
        return emp;
      }));
      
      setSuccessMessage("Cập nhật quyền thành công");
      
      // Tự động ẩn thông báo thành công sau 3 giây
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating permission:", error);
      setError(error.message);
      
      // Tự động ẩn thông báo lỗi sau 3 giây
      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Quản lý phân quyền</h2>
            <p className="text-muted-foreground">
              Cấp quyền truy cập cho nhân viên vào trang quản trị và cổng nội bộ
            </p>
          </div>
          <Button
            onClick={async () => {
              try {
                const response = await fetch("/api/admin/create-permissions-table", {
                  method: "POST",
                });
                
                if (!response.ok) {
                  throw new Error("Không thể tạo bảng phân quyền");
                }
                
                setSuccessMessage("Bảng phân quyền đã được tạo thành công");
                
                // Tự động ẩn thông báo thành công sau 3 giây
                setTimeout(() => {
                  setSuccessMessage("");
                }, 3000);
                
                // Tải lại trang sau 1 giây
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              } catch (error) {
                console.error("Error creating permissions table:", error);
                setError("Đã xảy ra lỗi khi tạo bảng phân quyền");
                
                // Tự động ẩn thông báo lỗi sau 3 giây
                setTimeout(() => {
                  setError("");
                }, 3000);
              }
            }}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Khởi tạo bảng phân quyền
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {successMessage && (
          <Alert className="bg-green-50 border-green-500 text-green-700">
            <Check className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Phân quyền nhân viên
            </CardTitle>
            <CardDescription>
              Quản lý quyền truy cập của nhân viên vào các phần của hệ thống
            </CardDescription>
            
            <div className="flex items-center space-x-2 mt-4">
              <Search className="h-5 w-5 text-gray-500" />
              <Input
                placeholder="Tìm kiếm nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Không tìm thấy nhân viên nào
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nhân viên</TableHead>
                      <TableHead>Vị trí</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-center">Quyền Admin</TableHead>
                      <TableHead className="text-center">Quyền Portal</TableHead>
                      <TableHead className="text-center">Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            {employee.avatar_url ? (
                              <img
                                src={employee.avatar_url}
                                alt={employee.name}
                                className="h-8 w-8 rounded-full"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <Users className="h-4 w-4 text-gray-500" />
                              </div>
                            )}
                            <span>{employee.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{employee.position || "N/A"}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <Switch
                              checked={employee.permissions?.admin_access || false}
                              onCheckedChange={(value) => updatePermission(employee.id, "admin_access", value)}
                              disabled={saving}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <Switch
                              checked={employee.permissions?.portal_access || false}
                              onCheckedChange={(value) => updatePermission(employee.id, "portal_access", value)}
                              disabled={saving}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {employee.status === "active" ? (
                            <Badge className="bg-green-500">Hoạt động</Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-500">Không hoạt động</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}