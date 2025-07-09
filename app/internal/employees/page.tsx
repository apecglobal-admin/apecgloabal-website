"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Search, Filter, Plus, ArrowLeft, Mail, Phone, Calendar, Edit, Trash2, Eye, Download, Users, Shield, Settings } from "lucide-react"
import InternalLayout from "@/components/internal-layout"

// TypeScript interfaces
interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  joinDate: string;
  status: "active" | "leave" | "inactive";
  avatar: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "manager" | "user";
  isActive: boolean;
  lastLogin: string;
  permissions: string[];
  employeeId: number;
  employeeName: string;
}

interface Department {
  name: string;
  count: number;
  color: string;
}

export default function EmployeesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("Tất cả")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState("employees")

  useEffect(() => {
    const savedUser = localStorage.getItem("internal_user");
    if (savedUser) {
      setIsAdmin(savedUser === "admin");
    }
  }, []);

  const employees: Employee[] = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      position: "Senior AI Engineer",
      department: "ApecTech",
      email: "nguyen.a@apectech.com",
      phone: "+84 123 456 789",
      joinDate: "15/03/2022",
      status: "active",
      avatar: "NA",
    },
    {
      id: 2,
      name: "Trần Thị B",
      position: "Security Specialist",
      department: "GuardCam",
      email: "tran.b@guardcam.com",
      phone: "+84 123 456 790",
      joinDate: "20/06/2022",
      status: "active",
      avatar: "TB",
    },
    {
      id: 3,
      name: "Lê Văn C",
      position: "Frontend Developer",
      department: "EmoCommerce",
      email: "le.c@emocommerce.com",
      phone: "+84 123 456 791",
      joinDate: "10/01/2023",
      status: "active",
      avatar: "LC",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      position: "Data Scientist",
      department: "TimeLoop",
      email: "pham.d@timeloop.com",
      phone: "+84 123 456 792",
      joinDate: "05/08/2023",
      status: "active",
      avatar: "PD",
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      position: "DevOps Engineer",
      department: "ApecNeuroOS",
      email: "hoang.e@apecneuroos.com",
      phone: "+84 123 456 793",
      joinDate: "12/11/2023",
      status: "active",
      avatar: "HE",
    },
    {
      id: 6,
      name: "Vũ Thị F",
      position: "Product Manager",
      department: "ApecGlobal",
      email: "vu.f@apecglobal.com",
      phone: "+84 123 456 794",
      joinDate: "18/02/2024",
      status: "leave",
      avatar: "VF",
    },
    {
      id: 7,
      name: "Đỗ Văn G",
      position: "UI/UX Designer",
      department: "ApecTech",
      email: "do.g@apectech.com",
      phone: "+84 123 456 795",
      joinDate: "10/03/2024",
      status: "active",
      avatar: "DG",
    },
    {
      id: 8,
      name: "Bùi Thị H",
      position: "Marketing Manager",
      department: "ApecGlobal",
      email: "bui.h@apecglobal.com",
      phone: "+84 123 456 796",
      joinDate: "15/04/2024",
      status: "active",
      avatar: "BH",
    },
  ]

  // Mock data cho users (chỉ admin mới thấy)
  const users: User[] = [
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
  ]

  const departments: Department[] = [
    { name: "Tất cả", count: employees.length, color: "bg-gray-600" },
    { name: "ApecTech", count: employees.filter((e) => e.department === "ApecTech").length, color: "bg-blue-600" },
    { name: "GuardCam", count: employees.filter((e) => e.department === "GuardCam").length, color: "bg-green-600" },
    {
      name: "EmoCommerce",
      count: employees.filter((e) => e.department === "EmoCommerce").length,
      color: "bg-pink-600",
    },
    { name: "TimeLoop", count: employees.filter((e) => e.department === "TimeLoop").length, color: "bg-orange-600" },
    {
      name: "ApecNeuroOS",
      count: employees.filter((e) => e.department === "ApecNeuroOS").length,
      color: "bg-purple-600",
    },
    { name: "ApecGlobal", count: employees.filter((e) => e.department === "ApecGlobal").length, color: "bg-cyan-600" },
  ]

  // Filter employees based on search and department
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "Tất cả" || employee.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  // Pagination
  const itemsPerPage = 4
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage)

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case "active":
        return "bg-green-600"
      case "leave":
        return "bg-orange-600"
      case "inactive":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getStatusText = (status: Employee['status']) => {
    switch (status) {
      case "active":
        return "Đang làm việc"
      case "leave":
        return "Nghỉ phép"
      case "inactive":
        return "Không hoạt động"
      default:
        return "Không xác định"
    }
  }

  const getDepartmentColor = (department: Employee['department']) => {
    switch (department) {
      case "ApecTech":
        return "bg-blue-500/10 text-blue-300 border-blue-500/30"
      case "GuardCam":
        return "bg-green-500/10 text-green-300 border-green-500/30"
      case "EmoCommerce":
        return "bg-pink-500/10 text-pink-300 border-pink-500/30"
      case "TimeLoop":
        return "bg-orange-500/10 text-orange-300 border-orange-500/30"
      case "ApecNeuroOS":
        return "bg-purple-500/10 text-purple-300 border-purple-500/30"
      case "ApecGlobal":
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
      default:
        return "bg-gray-500/10 text-gray-300 border-gray-500/30"
    }
  }

  const handleAddEmployee = () => {
    setShowAddModal(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setShowEditModal(true)
  }

  const handleDeleteEmployee = (employeeId: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      // Implement delete logic here
      alert(`Đã xóa nhân viên ID: ${employeeId}`)
    }
  }

  const handleViewEmployee = (employee: Employee) => {
    alert(`Xem chi tiết nhân viên: ${employee.name}`)
  }

  const handleExportExcel = () => {
    alert("Đang xuất file Excel...")
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Helper functions for users
  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'manager': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'user': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRoleText = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'Quản trị viên';
      case 'manager': return 'Quản lý';
      case 'user': return 'Người dùng';
      default: return 'Không xác định';
    }
  };

  return (
    <InternalLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8">
          <Link href="/internal/dashboard">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <span className="text-white/40">/</span>
          <span className="text-white">Quản Lý Nhân Viên</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Quản Lý Nhân Viên & Người Dùng</h1>
            <p className="text-white/60">Quản lý thông tin nhân viên và tài khoản người dùng</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-purple-500/30">
            <TabsTrigger value="employees" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white text-white/60">
              <Users className="h-4 w-4 mr-2" />
              Nhân Viên ({employees.length})
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="users" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white text-white/60">
                <Shield className="h-4 w-4 mr-2" />
                Người Dùng ({users.length})
              </TabsTrigger>
            )}
          </TabsList>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleAddEmployee}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm Nhân Viên
            </Button>
            <Button
              onClick={handleExportExcel}
              variant="outline"
              className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Xuất Excel
            </Button>
          </div>

          {/* Department Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Phòng Ban</h3>
          <div className="flex flex-wrap gap-3">
            {departments.map((dept, index) => (
              <Button
                key={index}
                onClick={() => {
                  setSelectedDepartment(dept.name)
                  setCurrentPage(1)
                }}
                variant="outline"
                className={`${selectedDepartment === dept.name ? "bg-purple-500/20 border-purple-400 text-white" : "bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"}`}
              >
                {dept.name}
                <Badge className={`ml-2 ${dept.color} text-white`}>{dept.count}</Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
            <Input
              placeholder="Tìm kiếm nhân viên theo tên, email, vị trí..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
            />
          </div>
          <Button
            variant="outline"
            className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"
          >
            <Filter className="h-4 w-4 mr-2" />
            Bộ Lọc
          </Button>
        </div>

        {/* Employee List */}
        <div className="grid gap-6 mb-8">
          {paginatedEmployees.map((employee) => (
            <Card
              key={employee.id}
              className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-4 gap-6 items-center">
                  {/* Employee Info */}
                  <div className="lg:col-span-2 flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{employee.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{employee.name}</h3>
                      <p className="text-purple-300 font-medium mb-2">{employee.position}</p>
                      <div className="flex items-center space-x-4 text-white/60 text-sm">
                        <span className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {employee.email}
                        </span>
                        <span className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {employee.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Department & Status */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-white/60 text-sm mb-1">Phòng ban</p>
                      <Badge className={`${getDepartmentColor(employee.department)} border`}>
                        {employee.department}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm mb-1">Trạng thái</p>
                      <Badge className={`${getStatusColor(employee.status)} text-white`}>
                        {getStatusText(employee.status)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm mb-1">Ngày vào làm</p>
                      <span className="text-white text-sm flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {employee.joinDate}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={() => handleViewEmployee(employee)}
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-2 border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Xem Chi Tiết
                    </Button>
                    <Button
                      onClick={() => handleEditEmployee(employee)}
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-2 border-green-500/50 text-green-300 hover:bg-green-500/20"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh Sửa
                    </Button>
                    <Button
                      onClick={() => handleDeleteEmployee(employee.id)}
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-2 border-red-500/50 text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`${
                    currentPage === page
                      ? "bg-purple-600 text-white"
                      : "bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"
                  }`}
                  variant={currentPage === page ? "default" : "outline"}
                >
                  {page}
                </Button>
              ))}

              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </Button>
            </div>
          </div>
        )}
        </TabsContent>

        {/* Users Tab - chỉ admin mới thấy */}
        {isAdmin && (
            <TabsContent value="users" className="space-y-6">
              <div className="flex items-center space-x-4">
                <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm Người Dùng
                </Button>
                <Link href="/internal/permissions">
                  <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40">
                    <Shield className="h-4 w-4 mr-2" />
                    Phân Quyền
                  </Button>
                </Link>
              </div>

              {/* Users List */}
              <div className="grid gap-6">
                {users.map((user) => (
                  <Card key={user.id} className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">{user.username}</h3>
                              <p className="text-white/60">{user.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm flex-wrap">
                            <Badge className={getRoleColor(user.role)}>
                              {getRoleText(user.role)}
                            </Badge>
                            <Badge className={user.isActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                              {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                            </Badge>
                            <span className="text-white/60">
                              Nhân viên: {user.employeeName}
                            </span>
                            <span className="text-white/60">
                              Đăng nhập cuối: {new Date(user.lastLogin).toLocaleString('vi-VN')}
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
                          <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40">
                            <Shield className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 hover:text-red-400">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* Add Employee Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="bg-black/90 border-purple-500/30 w-full max-w-2xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Thêm Nhân Viên Mới</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Input placeholder="Họ và tên" className="bg-black/30 border-purple-500/30 text-white" />
                  <Input placeholder="Email" className="bg-black/30 border-purple-500/30 text-white" />
                  <Input placeholder="Số điện thoại" className="bg-black/30 border-purple-500/30 text-white" />
                  <Input placeholder="Chức vụ" className="bg-black/30 border-purple-500/30 text-white" />
                </div>
                <div className="flex justify-end space-x-4">
                  <Button
                    onClick={() => setShowAddModal(false)}
                    variant="outline"
                    className="bg-transparent border-2 border-gray-500/50 text-white hover:bg-gray-500/20"
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={() => {
                      alert("Đã thêm nhân viên mới!")
                      setShowAddModal(false)
                    }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    Thêm
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </InternalLayout>
  )
}