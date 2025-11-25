"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import InternalLayout from "@/components/cms-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Edit, Plus, ArrowLeft, Building2, Users, User } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

function CompanyDepartmentsContent() {
  const params = useParams()
  const router = useRouter()
  const companyId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [departments, setDepartments] = useState<any[]>([])
  const [companyInfo, setCompanyInfo] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    manager_name: ""
  })

  useEffect(() => {
    fetchData()
  }, [companyId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [companyRes, departmentsRes] = await Promise.all([
        fetch(`/api/companies?slug=${companyId}`).then(res => res.json()),
        fetch(`/api/companies/${companyId}/departments`).then(res => res.json())
      ])

      if (companyRes.success && companyRes.data?.[0]) {
        setCompanyInfo(companyRes.data[0])
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
      const url = editingDepartment
        ? `/api/departments/${editingDepartment.id}`
        : `/api/companies/${companyId}/departments`
      
      const method = editingDepartment ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to save department')

      toast.success(editingDepartment ? 'Cập nhật phòng ban thành công!' : 'Thêm phòng ban thành công!')
      setIsDialogOpen(false)
      resetForm()
      fetchData()
    } catch (error) {
      console.error('Error saving department:', error)
      toast.error('Không thể lưu thông tin phòng ban')
    }
  }

  const handleEdit = (department: any) => {
    setEditingDepartment(department)
    setFormData({
      name: department.name || "",
      description: department.description || "",
      manager_name: department.manager_name || ""
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phòng ban này?')) return

    try {
      const response = await fetch(`/api/departments/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete department')

      toast.success('Xóa phòng ban thành công!')
      fetchData()
    } catch (error) {
      console.error('Error deleting department:', error)
      toast.error('Không thể xóa phòng ban')
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      manager_name: ""
    })
    setEditingDepartment(null)
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
            Quản Lý Phòng Ban - {companyInfo?.name}
          </h1>
          <p className="text-white/80">Quản lý các phòng ban trong công ty</p>
        </div>
      </div>

      {/* Main Content */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center">
              <Building2 className="h-6 w-6 mr-2" />
              Danh Sách Phòng Ban ({departments.length})
            </CardTitle>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm Phòng Ban
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Tên Phòng Ban</TableHead>
                  <TableHead className="text-white">Mô Tả</TableHead>
                  <TableHead className="text-white">Người Quản Lý</TableHead>
                  <TableHead className="text-white">Số Nhân Viên</TableHead>
                  <TableHead className="text-white">Ngày Tạo</TableHead>
                  <TableHead className="text-white">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments && departments.length > 0 ? (
                  departments?.map((department) => (
                    <TableRow key={department.id} className="border-b border-purple-500/30 hover:bg-white/5">
                      <TableCell className="font-medium text-white">{department.name}</TableCell>
                      <TableCell className="text-white/80 max-w-md truncate">{department.description}</TableCell>
                      <TableCell className="text-white/80">{department.manager_name || 'Chưa có'}</TableCell>
                      <TableCell className="text-white/80">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {department.employee_count || 0}
                        </div>
                      </TableCell>
                      <TableCell className="text-white/80">
                        {department.created_at ? new Date(department.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(department)}
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(department.id)}
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
                    <TableCell colSpan={6} className="text-center py-8 text-white/60">
                      Chưa có phòng ban nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Department Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-black/90 border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingDepartment ? 'Chỉnh Sửa Phòng Ban' : 'Thêm Phòng Ban Mới'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white">Tên Phòng Ban</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="Nhập tên phòng ban"
              />
            </div>

            <div>
              <Label htmlFor="manager_name" className="text-white">Người Quản Lý</Label>
              <Input
                id="manager_name"
                value={formData.manager_name}
                onChange={(e) => setFormData(prev => ({ ...prev, manager_name: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="Nhập tên người quản lý"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-white">Mô Tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                rows={4}
                placeholder="Nhập mô tả về phòng ban"
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
                {editingDepartment ? 'Cập Nhật' : 'Thêm Mới'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function CompanyDepartmentsPage() {
  return (
    <InternalLayout>
      <CompanyDepartmentsContent />
    </InternalLayout>
  )
}