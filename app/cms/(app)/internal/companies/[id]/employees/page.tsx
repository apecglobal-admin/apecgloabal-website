"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import InternalLayout from "@/components/cms-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit, Plus, ArrowLeft, User, Building2, Mail, Phone, Calendar, UserCircle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

function CompanyEmployeesContent() {
  const params = useParams()
  const router = useRouter()
  const companyId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [companyInfo, setCompanyInfo] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department_id: "",
    join_date: "",
    status: "active",
    avatar_url: "",
    salary: 0,
    manager_id: ""
  })

  useEffect(() => {
    fetchData()
  }, [companyId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [companyRes, employeesRes, departmentsRes] = await Promise.all([
        fetch(`/api/companies?slug=${companyId}`).then(res => res.json()),
        fetch(`/api/companies/${companyId}/employees`).then(res => res.json()),
        fetch(`/api/companies/${companyId}/departments`).then(res => res.json())
      ])

      if (companyRes.success && companyRes.data?.[0]) {
        setCompanyInfo(companyRes.data[0])
      }

      if (employeesRes.success) {
        setEmployees(employeesRes.data || [])
      }

      if (departmentsRes.success) {
        setDepartments(departmentsRes.data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const url = editingEmployee
        ? `/api/employees/${editingEmployee.id}`
        : `/api/companies/${companyId}/employees`
      
      const method = editingEmployee ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to save employee')

      toast.success(editingEmployee ? 'Cập nhật nhân viên thành công!' : 'Thêm nhân viên thành công!')
      setIsDialogOpen(false)
      resetForm()
      fetchData()
    } catch (error) {
      console.error('Error saving employee:', error)
      toast.error('Không thể lưu thông tin nhân viên')
    }
  }

  const handleEdit = (employee: any) => {
    setEditingEmployee(employee)
    setFormData({
      name: employee.name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      position: employee.position || "",
      department_id: employee.department_id || "",
      join_date: employee.join_date ? new Date(employee.join_date).toISOString().split('T')[0] : "",
      status: employee.status || "active",
      avatar_url: employee.avatar_url || "",
      salary: employee.salary || 0,
      manager_id: employee.manager_id || ""
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) return

    try {
      const response = await fetch(`/api/employees/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete employee')

      toast.success('Xóa nhân viên thành công!')
      fetchData()
    } catch (error) {
      console.error('Error deleting employee:', error)
      toast.error('Không thể xóa nhân viên')
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      department_id: "",
      join_date: "",
      status: "active",
      avatar_url: "",
      salary: 0,
      manager_id: ""
    })
    setEditingEmployee(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/cms/companies">
          <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">
            Quản Lý Nhân Viên - {companyInfo?.name}
          </h1>
          <p className="text-white/80">Quản lý danh sách nhân viên của công ty</p>
        </div>
      </div>

      {/* Main Content */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center">
              <UserCircle className="h-6 w-6 mr-2" />
              Danh Sách Nhân Viên ({employees.length})
            </CardTitle>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm Nhân Viên
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Avatar</TableHead>
                  <TableHead className="text-white">Họ Tên</TableHead>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Vị Trí</TableHead>
                  <TableHead className="text-white">Phòng Ban</TableHead>
                  <TableHead className="text-white">Ngày Vào</TableHead>
                  <TableHead className="text-white">Trạng Thái</TableHead>
                  <TableHead className="text-white">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees && employees.length > 0 ? (
                  employees.map((employee) => (
                    <TableRow key={employee.id} className="border-b border-purple-500/30 hover:bg-white/5">
                      <TableCell>
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                          {employee.avatar_url ? (
                            <img
                              src={employee.avatar_url}
                              alt={employee.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-white/60" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-white">{employee.name}</TableCell>
                      <TableCell className="text-white/80">{employee.email}</TableCell>
                      <TableCell className="text-white/80">{employee.position}</TableCell>
                      <TableCell className="text-white/80">{employee.department_name || 'Chưa phân bộ'}</TableCell>
                      <TableCell className="text-white/80">
                        {employee.join_date ? new Date(employee.join_date).toLocaleDateString('vi-VN') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge className={employee.status === 'active' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }>
                          {employee.status === 'active' ? 'Đang làm việc' : 'Đã nghỉ'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(employee)}
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(employee.id)}
                            className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-white/60">
                      Chưa có nhân viên nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Employee Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-black/90 border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingEmployee ? 'Chỉnh Sửa Nhân Viên' : 'Thêm Nhân Viên Mới'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-white">Họ Tên</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="Nhập họ tên"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="email@company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-white">Số Điện Thoại</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="0123456789"
                />
              </div>
              <div>
                <Label htmlFor="position" className="text-white">Vị Trí</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="Nhập vị trí công việc"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department_id" className="text-white">Phòng Ban</Label>
                <Select value={formData.department_id} onValueChange={(value) => setFormData(prev => ({ ...prev, department_id: value }))}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="join_date" className="text-white">Ngày Vào Làm</Label>
                <Input
                  id="join_date"
                  type="date"
                  value={formData.join_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, join_date: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salary" className="text-white">Mức Lương</Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData(prev => ({ ...prev, salary: parseInt(e.target.value) || 0 }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="status" className="text-white">Trạng Thái</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang làm việc</SelectItem>
                    <SelectItem value="inactive">Đã nghỉ việc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="avatar_url" className="text-white">Avatar URL</Label>
              <Input
                id="avatar_url"
                value={formData.avatar_url}
                onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  resetForm()
                }}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
              >
                Hủy
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {editingEmployee ? 'Cập Nhật' : 'Thêm Mới'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function CompanyEmployeesPage() {
  return (
    <InternalLayout>
      <CompanyEmployeesContent />
    </InternalLayout>
  )
}