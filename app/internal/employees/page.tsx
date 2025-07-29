"use client"

import { useState, useEffect } from "react"
import InternalLayout from "@/components/internal-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Plus, 
  Search, 
  Users, 
  Building2, 
  Mail, 
  Phone, 
  Calendar,
  Edit,
  Loader2,
  UserCheck,
  UserX,
  Briefcase
} from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { Pagination, usePagination } from "@/components/ui/pagination"

interface Employee {
  id: number
  name: string
  email: string
  phone: string
  position: string
  department_id: number
  department_name: string
  company_id: number
  company_name: string
  company_logo: string
  join_date: string
  status: string
  avatar_url: string
  salary: number
  manager_id: number
  manager_name: string
  address: string
  birthday: string
  education: string
  skills: string[]
  bio: string
}

interface Company {
  id: number
  name: string
  logo_url: string
}

interface Department {
  id: number
  name: string
  company_id: number
  company_name: string
}

function EmployeesManagementContent() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [creating, setCreating] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department_id: "",
    company_id: "",
    join_date: "",
    status: "active",
    salary: "",
    manager_id: "",
    address: "",
    birthday: "",
    education: "",
    skills: [] as string[],
    bio: ""
  })

  useEffect(() => {
    fetchEmployees()
    fetchCompanies()
    fetchDepartments()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      const result = await response.json()
      if (result.success) {
        // API trả về { data: { employees: [...], pagination: {...} } }
        setEmployees(result.data.employees || [])
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
      toast.error('Không thể tải danh sách nhân viên')
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies')
      const result = await response.json()
      if (result.success) {
        setCompanies(result.data)
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments')
      const result = await response.json()
      if (result.success) {
        setDepartments(result.data)
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
    }
  }

  const handleCreate = () => {
    setEditingEmployee(null)
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      department_id: "",
      company_id: "",
      join_date: "",
      status: "active",
      salary: "",
      manager_id: "",
      address: "",
      birthday: "",
      education: "",
      skills: [],
      bio: ""
    })
    setShowCreateModal(true)
  }

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone || "",
      position: employee.position || "",
      department_id: employee.department_id?.toString() || "",
      company_id: employee.company_id.toString(),
      join_date: employee.join_date ? employee.join_date.split('T')[0] : "",
      status: employee.status,
      salary: employee.salary?.toString() || "",
      manager_id: employee.manager_id?.toString() || "",
      address: employee.address || "",
      birthday: employee.birthday ? employee.birthday.split('T')[0] : "",
      education: employee.education || "",
      skills: employee.skills || [],
      bio: employee.bio || ""
    })
    setShowCreateModal(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.company_id) {
      toast.error('Vui lòng nhập tên, email và chọn công ty')
      return
    }

    setCreating(true)
    try {
      const url = editingEmployee ? `/api/employees/${editingEmployee.id}` : '/api/employees'
      const method = editingEmployee ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          salary: parseFloat(formData.salary) || null,
          department_id: formData.department_id ? parseInt(formData.department_id) : null,
          company_id: parseInt(formData.company_id),
          manager_id: formData.manager_id ? parseInt(formData.manager_id) : null
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setShowCreateModal(false)
        fetchEmployees()
        toast.success(`${editingEmployee ? 'Cập nhật' : 'Tạo'} nhân viên thành công!`)
      } else {
        toast.error('Lỗi: ' + result.error)
      }
    } catch (error) {
      console.error('Error saving employee:', error)
      toast.error('Lỗi kết nối server')
    } finally {
      setCreating(false)
    }
  }

  // Filter employees
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.position && employee.position.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCompany = selectedCompany === "all" || employee.company_id.toString() === selectedCompany
    const matchesStatus = selectedStatus === "all" || employee.status === selectedStatus
    
    return matchesSearch && matchesCompany && matchesStatus
  })

  // Pagination
  const {
    currentPage,
    totalPages,
    currentItems: paginatedEmployees,
    totalItems,
    itemsPerPage,
    goToPage
  } = usePagination(filteredEmployees, 10)

  // Calculate stats
  const totalEmployees = employees.length
  const activeEmployees = employees.filter(e => e.status === 'active').length
  const inactiveEmployees = employees.filter(e => e.status === 'inactive').length
  const companiesWithEmployees = [...new Set(employees.map(e => e.company_id))].length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <span className="ml-2 text-white">Đang tải nhân viên...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Quản Lý Nhân Viên
          </h1>
          <p className="text-white/80">Quản lý thông tin nhân viên của tất cả các công ty</p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm Nhân Viên
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Tổng Nhân Viên</p>
                <p className="text-2xl font-bold text-white">{totalEmployees}</p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Đang Hoạt Động</p>
                <p className="text-2xl font-bold text-white">{activeEmployees}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-red-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Không Hoạt Động</p>
                <p className="text-2xl font-bold text-white">{inactiveEmployees}</p>
              </div>
              <UserX className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Công Ty Có NV</p>
                <p className="text-2xl font-bold text-white">{companiesWithEmployees}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
              />
            </div>
            
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="bg-black/30 border-purple-500/30 text-white min-w-[200px]">
                <SelectValue placeholder="Chọn công ty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả công ty</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id.toString()}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-black/30 border-purple-500/30 text-white min-w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Danh Sách Nhân Viên</CardTitle>
          <CardDescription className="text-white/80">
            Hiển thị {paginatedEmployees.length} trên tổng số {filteredEmployees.length} nhân viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-purple-500/30">
                <TableHead className="text-white">Nhân Viên</TableHead>
                <TableHead className="text-white">Công Ty</TableHead>
                <TableHead className="text-white">Phòng Ban</TableHead>
                <TableHead className="text-white">Chức Vụ</TableHead>
                <TableHead className="text-white">Liên Hệ</TableHead>
                <TableHead className="text-white">Trạng Thái</TableHead>
                <TableHead className="text-white">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((employee) => (
                  <TableRow key={employee.id} className="border-b border-purple-500/30 hover:bg-white/5">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                          {employee.avatar_url ? (
                            <Image
                              src={employee.avatar_url}
                              alt={employee.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Users className="h-5 w-5 text-white/60" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{employee.name}</p>
                          <p className="text-sm text-white/60">{employee.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {employee.company_logo && (
                          <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center overflow-hidden">
                            <Image
                              src={employee.company_logo}
                              alt={employee.company_name}
                              width={24}
                              height={24}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <span className="text-white">{employee.company_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-white/80">
                      {employee.department_name || 'Chưa phân công'}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {employee.position || 'Chưa xác định'}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-white/60">
                          <Mail className="h-3 w-3 mr-1" />
                          {employee.email}
                        </div>
                        {employee.phone && (
                          <div className="flex items-center text-sm text-white/60">
                            <Phone className="h-3 w-3 mr-1" />
                            {employee.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={employee.status === 'active' 
                          ? 'bg-green-600/20 text-green-400 border-green-500/30' 
                          : 'bg-red-600/20 text-red-400 border-red-500/30'
                        }
                      >
                        {employee.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(employee)}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-white/60">
                    Không tìm thấy nhân viên nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 pb-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={goToPage}
            />
          </div>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              {editingEmployee ? 'Chỉnh Sửa Nhân Viên' : 'Thêm Nhân Viên Mới'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-white">Họ Tên *</Label>
                <Input
                  id="name"
                  placeholder="Nhập họ tên"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-white">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-white">Số Điện Thoại</Label>
                <Input
                  id="phone"
                  placeholder="0123456789"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="position" className="text-white">Chức Vụ</Label>
                <Input
                  id="position"
                  placeholder="Nhập chức vụ"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company" className="text-white">Công Ty *</Label>
                <Select
                  value={formData.company_id}
                  onValueChange={(value) => setFormData({...formData, company_id: value, department_id: ""})}
                >
                  <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                    <SelectValue placeholder="Chọn công ty" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="department" className="text-white">Phòng Ban</Label>
                <Select
                  value={formData.department_id}
                  onValueChange={(value) => setFormData({...formData, department_id: value})}
                  disabled={!formData.company_id}
                >
                  <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments
                      .filter(dept => dept.company_id.toString() === formData.company_id)
                      .map((department) => (
                        <SelectItem key={department.id} value={department.id.toString()}>
                          {department.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="join_date" className="text-white">Ngày Vào Làm</Label>
                <Input
                  id="join_date"
                  type="date"
                  value={formData.join_date}
                  onChange={(e) => setFormData({...formData, join_date: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                />
              </div>

              <div>
                <Label htmlFor="status" className="text-white">Trạng Thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({...formData, status: value})}
                >
                  <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="salary" className="text-white">Lương (VND)</Label>
                <Input
                  id="salary"
                  type="number"
                  placeholder="Mức lương"
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio" className="text-white">Ghi Chú</Label>
              <Textarea
                id="bio"
                placeholder="Thông tin thêm về nhân viên..."
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="bg-black/30 border-purple-500/30 text-white"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="bg-transparent border-2 border-gray-500/50 text-white hover:bg-gray-500/20"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                disabled={creating}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    {editingEmployee ? 'Cập Nhật' : 'Tạo Nhân Viên'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function EmployeesManagementPage() {
  return (
    <InternalLayout>
      <EmployeesManagementContent />
    </InternalLayout>
  )
}