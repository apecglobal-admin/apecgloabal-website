"use client"

import { useState } from "react"
import InternalLayout from "@/components/internal-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Search, Filter, Plus, ArrowLeft, Mail, Phone, Calendar, Edit, Trash2, Eye, Download } from "lucide-react"

export default function EmployeesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("Tất cả")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const employees = [
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

  const departments = [
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

  const getStatusColor = (status: string) => {
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

  const getStatusText = (status: string) => {
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

  const getDepartmentColor = (department: string) => {
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

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee)
    setShowEditModal(true)
  }

  const handleDeleteEmployee = (employeeId) => {
    if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      // Implement delete logic here
      alert(`Đã xóa nhân viên ID: ${employeeId}`)
    }
  }

  const handleViewEmployee = (employee) => {
    alert(`Xem chi tiết nhân viên: ${employee.name}`)
  }

  const handleExportExcel = () => {
    alert("Đang xuất file Excel...")
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

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
            <h1 className="text-3xl font-bold text-white mb-2">Quản Lý Nhân Viên</h1>
            <p className="text-white/60">Quản lý thông tin và hoạt động của {filteredEmployees.length} nhân viên</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Button
              onClick={handleAddEmployee}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
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