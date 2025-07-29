"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import InternalLayout from "@/components/internal-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Trash2, Edit, Plus, ArrowLeft, Folder, Calendar, Users, TrendingUp, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

function CompanyProjectsContent() {
  const params = useParams()
  const router = useRouter()
  const companyId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [companyInfo, setCompanyInfo] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    manager_id: "",
    status: "active",
    priority: "medium",
    progress: 0,
    start_date: "",
    end_date: "",
    budget: 0,
    spent: 0,
    team_size: 0,
    technologies: [] as string[]
  })

  useEffect(() => {
    fetchData()
  }, [companyId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [companyRes, projectsRes, employeesRes] = await Promise.all([
        fetch(`/api/companies?slug=${companyId}`).then(res => res.json()),
        fetch(`/api/companies/${companyId}/projects`).then(res => res.json()),
        fetch(`/api/companies/${companyId}/employees`).then(res => res.json())
      ])

      if (companyRes.success && companyRes.data?.[0]) {
        setCompanyInfo(companyRes.data[0])
      }

      if (projectsRes.success) {
        setProjects(projectsRes.data || [])
      }

      if (employeesRes.success) {
        setEmployees(employeesRes.data || [])
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
      const url = editingProject
        ? `/api/projects/${editingProject.id}`
        : `/api/companies/${companyId}/projects`
      
      const method = editingProject ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to save project')

      toast.success(editingProject ? 'Cập nhật dự án thành công!' : 'Thêm dự án thành công!')
      setIsDialogOpen(false)
      resetForm()
      fetchData()
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error('Không thể lưu thông tin dự án')
    }
  }

  const handleEdit = (project: any) => {
    setEditingProject(project)
    setFormData({
      name: project.name || "",
      slug: project.slug || "",
      description: project.description || "",
      manager_id: project.manager_id || "",
      status: project.status || "active",
      priority: project.priority || "medium",
      progress: project.progress || 0,
      start_date: project.start_date ? new Date(project.start_date).toISOString().split('T')[0] : "",
      end_date: project.end_date ? new Date(project.end_date).toISOString().split('T')[0] : "",
      budget: project.budget || 0,
      spent: project.spent || 0,
      team_size: project.team_size || 0,
      technologies: project.technologies || []
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa dự án này?')) return

    try {
      const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete project')

      toast.success('Xóa dự án thành công!')
      fetchData()
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Không thể xóa dự án')
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      manager_id: "",
      status: "active",
      priority: "medium",
      progress: 0,
      start_date: "",
      end_date: "",
      budget: 0,
      spent: 0,
      team_size: 0,
      technologies: []
    })
    setEditingProject(null)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-400" />
      case 'on-hold': return <Clock className="h-4 w-4 text-yellow-400" />
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-red-400" />
      default: return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'on-hold': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
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
        <Link href="/internal/companies">
          <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">
            Quản Lý Dự Án - {companyInfo?.name}
          </h1>
          <p className="text-white/80">Quản lý các dự án của công ty</p>
        </div>
      </div>

      {/* Main Content */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center">
              <Folder className="h-6 w-6 mr-2" />
              Danh Sách Dự Án ({projects.length})
            </CardTitle>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm Dự Án
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Tên Dự Án</TableHead>
                  <TableHead className="text-white">Quản Lý</TableHead>
                  <TableHead className="text-white">Trạng Thái</TableHead>
                  <TableHead className="text-white">Ưu Tiên</TableHead>
                  <TableHead className="text-white">Tiến Độ</TableHead>
                  <TableHead className="text-white">Ngân Sách</TableHead>
                  <TableHead className="text-white">Thời Gian</TableHead>
                  <TableHead className="text-white">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects && projects.length > 0 ? (
                  projects.map((project) => (
                    <TableRow key={project.id} className="border-b border-purple-500/30 hover:bg-white/5">
                      <TableCell className="font-medium text-white">
                        <div>
                          <div className="font-semibold">{project.name}</div>
                          <div className="text-sm text-white/60">{project.slug}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white/80">{project.manager_name || 'Chưa có'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(project.status)}>
                          <div className="flex items-center">
                            {getStatusIcon(project.status)}
                            <span className="ml-1 capitalize">{project.status}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority === 'high' ? 'Cao' : project.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="w-24">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-white">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell className="text-white/80">
                        <div className="text-sm">
                          <div>${project.spent || 0} / ${project.budget || 0}</div>
                          <div className="text-xs text-white/60">
                            {project.budget > 0 ? `${((project.spent / project.budget) * 100).toFixed(1)}%` : '0%'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white/80">
                        <div className="text-sm">
                          <div>Bắt đầu: {project.start_date ? new Date(project.start_date).toLocaleDateString('vi-VN') : 'N/A'}</div>
                          <div>Kết thúc: {project.end_date ? new Date(project.end_date).toLocaleDateString('vi-VN') : 'N/A'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(project)}
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(project.id)}
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
                      Chưa có dự án nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Project Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black/90 border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingProject ? 'Chỉnh Sửa Dự Án' : 'Thêm Dự Án Mới'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-white">Tên Dự Án</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="Nhập tên dự án"
                />
              </div>
              <div>
                <Label htmlFor="slug" className="text-white">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="project-slug"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-white">Mô Tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                rows={3}
                placeholder="Nhập mô tả dự án"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="manager_id" className="text-white">Quản Lý Dự Án</Label>
                <Select value={formData.manager_id} onValueChange={(value) => setFormData(prev => ({ ...prev, manager_id: value }))}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Chọn quản lý" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id.toString()}>
                        {emp.name} - {emp.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status" className="text-white">Trạng Thái</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang thực hiện</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="on-hold">Tạm dừng</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority" className="text-white">Ưu Tiên</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="low">Thấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date" className="text-white">Ngày Bắt Đầu</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="end_date" className="text-white">Ngày Kết Thúc</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="progress" className="text-white">Tiến Độ (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="budget" className="text-white">Ngân Sách ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="spent" className="text-white">Đã Chi ($)</Label>
                <Input
                  id="spent"
                  type="number"
                  value={formData.spent}
                  onChange={(e) => setFormData(prev => ({ ...prev, spent: parseInt(e.target.value) || 0 }))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="team_size" className="text-white">Số Thành Viên</Label>
                <Input
                  id="team_size"
                  type="number"
                  value={formData.team_size}
                  onChange={(e) => setFormData(prev => ({ ...prev, team_size: parseInt(e.target.value) || 0 }))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
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
                {editingProject ? 'Cập Nhật' : 'Thêm Mới'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function CompanyProjectsPage() {
  return (
    <InternalLayout>
      <CompanyProjectsContent />
    </InternalLayout>
  )
}