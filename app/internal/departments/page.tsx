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
  MapPin,
  Edit,
  Loader2,
  Briefcase,
  DollarSign
} from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { Pagination, usePagination } from "@/components/ui/pagination"

interface Department {
  id: number
  name: string
  description: string
  company_id: number
  company_name: string
  company_logo: string
  manager_id: number
  manager_name: string
  location: string
  phone: string
  email: string
  budget: number
  employee_count: number
  status: string
  created_at: string
  updated_at: string
  icon?: string
  color?: string
}

interface DepartmentTemplate {
  id: number
  name: string
  description: string
  icon: string
  color: string
  sort_order: number
  is_active: boolean
}

interface Company {
  id: number
  name: string
  logo_url: string
}

interface Employee {
  id: number
  name: string
  company_id: number
}

function DepartmentsManagementContent() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departmentTemplates, setDepartmentTemplates] = useState<DepartmentTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [creating, setCreating] = useState(false)

  const [formData, setFormData] = useState({
    department_template_id: "",
    company_id: "",
    manager_id: "",
    location: "",
    phone: "",
    email: "",
    budget: "",
    notes: "",
    status: "active"
  })

  useEffect(() => {
    fetchDepartments()
    fetchCompanies()
    fetchEmployees()
    fetchDepartmentTemplates()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments')
      const result = await response.json()
      if (result.success && Array.isArray(result.data)) {
        setDepartments(result.data)
      } else {
        setDepartments([]) // Fallback to empty array
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
      setDepartments([]) // Fallback to empty array on error
      toast.error('Không thể tải danh sách phòng ban')
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies')
      const result = await response.json()
      if (result.success && Array.isArray(result.data)) {
        setCompanies(result.data)
      } else {
        setCompanies([]) // Fallback to empty array
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
      setCompanies([]) // Fallback to empty array on error
    }
  }

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      const result = await response.json()
      if (result.success && Array.isArray(result.data)) {
        setEmployees(result.data)
      } else {
        setEmployees([]) // Fallback to empty array
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
      setEmployees([]) // Fallback to empty array on error
    }
  }

  const fetchDepartmentTemplates = async () => {
    try {
      const response = await fetch('/api/department-templates')
      const result = await response.json()
      if (result.success && Array.isArray(result.data)) {
        setDepartmentTemplates(result.data)
      } else {
        setDepartmentTemplates([]) // Fallback to empty array
      }
    } catch (error) {
      console.error('Error fetching department templates:', error)
      setDepartmentTemplates([]) // Fallback to empty array on error
    }
  }

  const handleCreate = () => {
    setEditingDepartment(null)
    setFormData({
      department_template_id: "",
      company_id: "",
      manager_id: "",
      location: "",
      phone: "",
      email: "",
      budget: "",
      notes: "",
      status: "active"
    })
    setShowCreateModal(true)
  }

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setFormData({
      name: department.name,
      description: department.description || "",
      company_id: department.company_id.toString(),
      manager_id: department.manager_id?.toString() || "",
      location: department.location || "",
      phone: department.phone || "",
      email: department.email || "",
      budget: department.budget?.toString() || "",
      status: department.status
    })
    setShowCreateModal(true)
  }

  const handleSave = async () => {
    if (!formData.department_template_id || !formData.company_id) {
      toast.error('Vui lòng chọn loại phòng ban và công ty')
      return
    }

    setCreating(true)
    try {
      const url = editingDepartment ? `/api/departments/${editingDepartment.id}` : '/api/departments'
      const method = editingDepartment ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_id: parseInt(formData.company_id),
          department_template_id: parseInt(formData.department_template_id),
          manager_id: formData.manager_id ? parseInt(formData.manager_id) : null,
          location: formData.location,
          phone: formData.phone,
          email: formData.email,
          budget: parseFloat(formData.budget) || 0,
          notes: formData.notes,
          status: formData.status
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setShowCreateModal(false)
        fetchDepartments()
        toast.success(`${editingDepartment ? 'Cập nhật' : 'Tạo'} phòng ban thành công!`)
      } else {
        toast.error('Lỗi: ' + result.error)
      }
    } catch (error) {
      console.error('Error saving department:', error)
      toast.error('Lỗi kết nối server')
    } finally {
      setCreating(false)
    }
  }

  // Ensure departments is always an array
  const safeDepartments = Array.isArray(departments) ? departments : []
  
  // Filter departments
  const filteredDepartments = safeDepartments.filter((department) => {
    const matchesSearch = 
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (department.description && department.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCompany = selectedCompany === "all" || department.company_id.toString() === selectedCompany
    const matchesStatus = selectedStatus === "all" || department.status === selectedStatus
    
    return matchesSearch && matchesCompany && matchesStatus
  })

  // Calculate stats
  const totalDepartments = safeDepartments.length
  const activeDepartments = safeDepartments.filter(d => d.status === 'active').length
  const inactiveDepartments = safeDepartments.filter(d => d.status === 'inactive').length
  const companiesWithDepartments = [...new Set(safeDepartments.map(d => d.company_id))].length
  const totalBudget = safeDepartments.reduce((sum, d) => sum + (d.budget || 0), 0)

  // Pagination
  const {
    currentPage,
    totalPages,
    currentItems: paginatedDepartments,
    totalItems,
    itemsPerPage,
    goToPage
  } = usePagination(filteredDepartments, 8)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <span className="ml-2 text-white">Đang tải phòng ban...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Quản Lý Phòng Ban
          </h1>
          <p className="text-white/80">Quản lý thông tin phòng ban của tất cả các công ty</p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm Phòng Ban
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Tổng Phòng Ban</p>
                <p className="text-2xl font-bold text-white">{totalDepartments}</p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Đang Hoạt Động</p>
                <p className="text-2xl font-bold text-white">{activeDepartments}</p>
              </div>
              <Building2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-red-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Không Hoạt Động</p>
                <p className="text-2xl font-bold text-white">{inactiveDepartments}</p>
              </div>
              <Building2 className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Công Ty</p>
                <p className="text-2xl font-bold text-white">{companiesWithDepartments}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Tổng Ngân Sách</p>
                <p className="text-lg font-bold text-white">{(totalBudget / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-400" />
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
                placeholder="Tìm kiếm phòng ban..."
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
                {Array.isArray(companies) ? companies.map((company) => (
                  <SelectItem key={company.id} value={company.id.toString()}>
                    {company.name}
                  </SelectItem>
                )) : []}
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

      {/* Departments Table */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Danh Sách Phòng Ban</CardTitle>
          <CardDescription className="text-white/80">
            Hiển thị {paginatedDepartments.length} trên tổng số {filteredDepartments.length} phòng ban
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-purple-500/30">
                <TableHead className="text-white">Phòng Ban</TableHead>
                <TableHead className="text-white">Công Ty</TableHead>
                <TableHead className="text-white">Trưởng Phòng</TableHead>
                <TableHead className="text-white">Liên Hệ</TableHead>
                <TableHead className="text-white">Ngân Sách</TableHead>
                <TableHead className="text-white">Trạng Thái</TableHead>
                <TableHead className="text-white">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDepartments.length > 0 ? (
                paginatedDepartments.map((department) => (
                  <TableRow key={department.id} className="border-b border-purple-500/30 hover:bg-white/5">
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{department.name}</p>
                        <p className="text-sm text-white/60">{department.description || 'Không có mô tả'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {department.company_logo && (
                          <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center overflow-hidden">
                            <Image
                              src={department.company_logo}
                              alt={department.company_name}
                              width={24}
                              height={24}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <span className="text-white">{department.company_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-white/80">
                      {department.manager_name || 'Chưa phân công'}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {department.email && (
                          <div className="flex items-center text-sm text-white/60">
                            <Mail className="h-3 w-3 mr-1" />
                            {department.email}
                          </div>
                        )}
                        {department.phone && (
                          <div className="flex items-center text-sm text-white/60">
                            <Phone className="h-3 w-3 mr-1" />
                            {department.phone}
                          </div>
                        )}
                        {department.location && (
                          <div className="flex items-center text-sm text-white/60">
                            <MapPin className="h-3 w-3 mr-1" />
                            {department.location}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      {department.budget ? `${(department.budget / 1000000).toFixed(1)}M VND` : 'Chưa xác định'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={department.status === 'active' 
                          ? 'bg-green-600/20 text-green-400 border-green-500/30' 
                          : 'bg-red-600/20 text-red-400 border-red-500/30'
                        }
                      >
                        {department.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(department)}
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
                    Không tìm thấy phòng ban nào
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
        <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              {editingDepartment ? 'Chỉnh Sửa Phòng Ban' : 'Thêm Phòng Ban Mới'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department_template" className="text-white">Loại Phòng Ban *</Label>
                <Select
                  value={formData.department_template_id}
                  onValueChange={(value) => setFormData({...formData, department_template_id: value})}
                >
                  <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                    <SelectValue placeholder="Chọn loại phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(departmentTemplates) ? departmentTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id.toString()}>
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full bg-${template.color}-500`}></span>
                          {template.name}
                        </div>
                      </SelectItem>
                    )) : []}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="company" className="text-white">Công Ty *</Label>
                <Select
                  value={formData.company_id}
                  onValueChange={(value) => setFormData({...formData, company_id: value, manager_id: ""})}
                >
                  <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                    <SelectValue placeholder="Chọn công ty" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(companies) ? companies.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </SelectItem>
                    )) : []}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-white">Ghi Chú</Label>
              <Textarea
                id="notes"
                placeholder="Ghi chú về phòng ban này..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="bg-black/30 border-purple-500/30 text-white"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manager" className="text-white">Trưởng Phòng</Label>
                <Select
                  value={formData.manager_id}
                  onValueChange={(value) => setFormData({...formData, manager_id: value})}
                  disabled={!formData.company_id}
                >
                  <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                    <SelectValue placeholder="Chọn trưởng phòng" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(employees) ? employees
                      .filter(emp => emp.company_id.toString() === formData.company_id)
                      .map((employee) => (
                        <SelectItem key={employee.id} value={employee.id.toString()}>
                          {employee.name}
                        </SelectItem>
                      )) : []}
                  </SelectContent>
                </Select>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="department@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                />
              </div>

              <div>
                <Label htmlFor="budget" className="text-white">Ngân Sách (VND)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="Ngân sách phòng ban"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location" className="text-white">Địa Điểm</Label>
              <Input
                id="location"
                placeholder="Vị trí văn phòng"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="bg-black/30 border-purple-500/30 text-white"
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
                    {editingDepartment ? 'Cập Nhật' : 'Tạo Phòng Ban'}
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

export default function DepartmentsManagementPage() {
  return (
    <InternalLayout>
      <DepartmentsManagementContent />
    </InternalLayout>
  )
}