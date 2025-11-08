"use client"

import { useState, useEffect } from "react"
import InternalLayout from "@/components/cms-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Plus, 
  Search, 
  Users, 
  Building2, 
  Edit,
  Loader2,
  Briefcase,
  DollarSign,
  Trash2
} from "lucide-react"
import { toast } from "sonner"
import { Pagination, usePagination } from "@/components/ui/pagination"

interface Department {
  id: number
  name: string
  description: string
  manager_name: string
  employee_count: number
  created_at: string
  updated_at: string
}



function DepartmentsManagementContent() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [creating, setCreating] = useState(false)
  const [deletingDepartment, setDeletingDepartment] = useState<Department | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    manager_name: ""
  })

  useEffect(() => {
    fetchDepartments()
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



  const handleCreate = () => {
    setEditingDepartment(null)
    setFormData({
      name: "",
      description: "",
      manager_name: ""
    })
    setShowCreateModal(true)
  }

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setFormData({
      name: department.name,
      description: department.description || "",
      manager_name: department.manager_name || ""
    })
    setShowCreateModal(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên phòng ban')
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
          name: formData.name.trim(),
          description: formData.description.trim(),
          manager_name: formData.manager_name.trim()
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

  const handleDelete = async () => {
    if (!deletingDepartment) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/departments/${deletingDepartment.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      
      if (result.success) {
        setDeletingDepartment(null)
        fetchDepartments()
        toast.success('Xóa phòng ban thành công!')
      } else {
        toast.error('Lỗi: ' + result.error)
      }
    } catch (error) {
      console.error('Error deleting department:', error)
      toast.error('Lỗi kết nối server')
    } finally {
      setDeleting(false)
    }
  }

  // Ensure departments is always an array
  const safeDepartments = Array.isArray(departments) ? departments : []
  
  // Filter departments
  const filteredDepartments = safeDepartments.filter((department) => {
    const matchesSearch = 
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (department.description && department.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (department.manager_name && department.manager_name.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesSearch
  })

  // Calculate stats
  const totalDepartments = safeDepartments.length
  const departmentsWithManagers = safeDepartments.filter(d => d.manager_name && d.manager_name.trim() !== '').length
  const departmentsWithEmployees = safeDepartments.filter(d => d.employee_count > 0).length
  const totalEmployees = safeDepartments.reduce((sum, d) => sum + (d.employee_count || 0), 0)
  const avgEmployeesPerDept = totalDepartments > 0 ? Math.round(totalEmployees / totalDepartments) : 0

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
                <p className="text-white/60 text-sm">Có Trưởng Phòng</p>
                <p className="text-2xl font-bold text-white">{departmentsWithManagers}</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Có Nhân Viên</p>
                <p className="text-2xl font-bold text-white">{departmentsWithEmployees}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Tổng Nhân Viên</p>
                <p className="text-2xl font-bold text-white">{totalEmployees}</p>
              </div>
              <Users className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-cyan-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">TB NV/Phòng Ban</p>
                <p className="text-2xl font-bold text-white">{avgEmployeesPerDept}</p>
              </div>
              <DollarSign className="h-8 w-8 text-cyan-400" />
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
                placeholder="Tìm kiếm phòng ban, mô tả, trưởng phòng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
              />
            </div>
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
                <TableHead className="text-white">Trưởng Phòng</TableHead>
                <TableHead className="text-white">Số Nhân Viên</TableHead>
                <TableHead className="text-white">Ngày Tạo</TableHead>
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
                    <TableCell className="text-white/80">
                      {department.manager_name || 'Chưa phân công'}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                        {department.employee_count || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white/60">
                      {new Date(department.created_at).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(department)}
                          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingDepartment(department)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
            <div>
              <Label htmlFor="name" className="text-white">Tên Phòng Ban *</Label>
              <Input
                id="name"
                placeholder="Nhập tên phòng ban..."
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-white">Mô Tả</Label>
              <Textarea
                id="description"
                placeholder="Mô tả chức năng và nhiệm vụ của phòng ban..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="manager_name" className="text-white">Trưởng Phòng</Label>
              <Input
                id="manager_name"
                placeholder="Nhập tên trưởng phòng..."
                value={formData.manager_name}
                onChange={(e) => setFormData({...formData, manager_name: e.target.value})}
                className="bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingDepartment} onOpenChange={() => setDeletingDepartment(null)}>
        <DialogContent className="bg-black/90 border-red-500/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Xác Nhận Xóa Phòng Ban
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-white/80">
              Bạn có chắc chắn muốn xóa phòng ban <span className="font-semibold text-red-400">{deletingDepartment?.name}</span> không?
            </p>
            <p className="text-sm text-red-400">
              ⚠️ Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan.
            </p>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setDeletingDepartment(null)}
                className="bg-transparent border-2 border-gray-500/50 text-white hover:bg-gray-500/20"
                disabled={deleting}
              >
                Hủy
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa Phòng Ban
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