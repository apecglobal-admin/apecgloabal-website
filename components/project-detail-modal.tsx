"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Save,
  X,
  Edit,
  Users,
  CheckSquare,
  Target,
  Calendar,
  DollarSign,
  Clock,
  User,
  Plus,
  Loader2,
  MoreVertical,
  Trash2
} from "lucide-react"
import { toast } from "sonner"

interface ProjectDetailModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: number | null
  editMode?: boolean
}

export function ProjectDetailModal({ isOpen, onClose, projectId, editMode = false }: ProjectDetailModalProps) {
  const [project, setProject] = useState<any>(null)
  const [companies, setCompanies] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(editMode)

  // New modal states
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false)

  // Add member form
  const [memberForm, setMemberForm] = useState({
    employee_id: "",
    role: "",
    join_date: new Date().toISOString().split('T')[0]
  })

  // Add task form
  const [taskForm, setTaskForm] = useState({
    name: "",
    description: "",
    assignee_id: "",
    status: "pending",
    priority: "medium",
    due_date: ""
  })

  // Add milestone form
  const [milestoneForm, setMilestoneForm] = useState({
    name: "",
    description: "",
    due_date: "",
    status: "pending"
  })

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    company_id: "",
    manager_id: "",
    start_date: "",
    end_date: "",
    budget: "",
    status: "planning",
    priority: "medium",
    progress: 0,
    client_name: "",
    client_email: "",
    client_phone: "",
    location: "",
    technologies: "",
    requirements: "",
    deliverables: ""
  })

  useEffect(() => {
    if (isOpen && projectId) {
      fetchProject()
      fetchCompanies()
      fetchEmployees()
    }
    setEditing(editMode)
  }, [isOpen, projectId, editMode])

  const fetchProject = async () => {
    if (!projectId) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      const result = await response.json()
      if (result.success) {
        const proj = result.data
        setProject(proj)
        setFormData({
          name: proj.name || "",
          description: proj.description || "",
          company_id: proj.company_id?.toString() || "",
          manager_id: proj.manager_id?.toString() || "",
          start_date: proj.start_date ? new Date(proj.start_date).toISOString().split('T')[0] : "",
          end_date: proj.end_date ? new Date(proj.end_date).toISOString().split('T')[0] : "",
          budget: proj.budget?.toString() || "",
          status: proj.status || "planning",
          priority: proj.priority || "medium",
          progress: proj.progress || 0,
          client_name: proj.client_name || "",
          client_email: proj.client_email || "",
          client_phone: proj.client_phone || "",
          location: proj.location || "",
          technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : "",
          requirements: proj.requirements || "",
          deliverables: Array.isArray(proj.deliverables) ? proj.deliverables.join('\n') : ""
        })
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      toast.error('Không thể tải thông tin dự án')
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
        setCompanies([])
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
      setCompanies([])
    }
  }

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      const result = await response.json()
      if (result.success && result.data?.employees && Array.isArray(result.data.employees)) {
        setEmployees(result.data.employees)
      } else {
        setEmployees([])
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
      setEmployees([])
    }
  }

  const handleSave = async () => {
    if (!formData.name || !formData.company_id) {
      toast.error('Vui lòng nhập tên dự án và chọn công ty')
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          budget: parseFloat(formData.budget) || 0,
          company_id: parseInt(formData.company_id),
          manager_id: formData.manager_id ? parseInt(formData.manager_id) : null,
          progress: parseInt(formData.progress.toString()),
          technologies: formData.technologies ? formData.technologies.split(',').map(t => t.trim()) : [],
          deliverables: formData.deliverables ? formData.deliverables.split('\n').filter(d => d.trim()) : []
        })
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success('Cập nhật dự án thành công!')
        setEditing(false)
        fetchProject() // Refresh data
      } else {
        toast.error('Lỗi: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Lỗi kết nối server')
    } finally {
      setSaving(false)
    }
  }

  // Add member handler
  const handleAddMember = async () => {
    if (!memberForm.employee_id || !memberForm.role) {
      toast.error('Vui lòng chọn nhân viên và nhập vai trò')
      return
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberForm)
      })

      const result = await response.json()
      if (result.success) {
        toast.success('Thêm thành viên thành công!')
        setShowAddMemberModal(false)
        setMemberForm({ employee_id: "", role: "", join_date: new Date().toISOString().split('T')[0] })
        fetchProject() // Refresh data
      } else {
        toast.error('Có lỗi xảy ra khi thêm thành viên')
      }
    } catch (error) {
      console.error('Error adding member:', error)
      toast.error('Có lỗi xảy ra khi thêm thành viên')
    }
  }

  // Add task handler
  const handleAddTask = async () => {
    if (!taskForm.name) {
      toast.error('Vui lòng nhập tên công việc')
      return
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskForm)
      })

      const result = await response.json()
      if (result.success) {
        toast.success('Thêm công việc thành công!')
        setShowAddTaskModal(false)
        setTaskForm({ name: "", description: "", assignee_id: "", status: "pending", priority: "medium", due_date: "" })
        fetchProject() // Refresh data
      } else {
        toast.error('Có lỗi xảy ra khi thêm công việc')
      }
    } catch (error) {
      console.error('Error adding task:', error)
      toast.error('Có lỗi xảy ra khi thêm công việc')
    }
  }

  // Add milestone handler
  const handleAddMilestone = async () => {
    if (!milestoneForm.name || !milestoneForm.due_date) {
      toast.error('Vui lòng nhập tên cột mốc và hạn chót')
      return
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(milestoneForm)
      })

      const result = await response.json()
      if (result.success) {
        toast.success('Thêm cột mốc thành công!')
        setShowAddMilestoneModal(false)
        setMilestoneForm({ name: "", description: "", due_date: "", status: "pending" })
        fetchProject() // Refresh data
      } else {
        toast.error('Có lỗi xảy ra khi thêm cột mốc')
      }
    } catch (error) {
      console.error('Error adding milestone:', error)
      toast.error('Có lỗi xảy ra khi thêm cột mốc')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600/20 text-green-400 border-green-500/30'
      case 'in_progress':
        return 'bg-blue-600/20 text-blue-400 border-blue-500/30'
      case 'on_hold':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30'
      case 'cancelled':
        return 'bg-red-600/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planning':
        return 'Lên kế hoạch'
      case 'in_progress':
        return 'Đang thực hiện'
      case 'on_hold':
        return 'Tạm dừng'
      case 'completed':
        return 'Hoàn thành'
      case 'cancelled':
        return 'Đã hủy'
      default:
        return status
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">
              {project?.name || 'Chi Tiết Dự Án'}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              {!editing ? (
                <Button
                  onClick={() => setEditing(true)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh Sửa
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setEditing(false)}
                    size="sm"
                    variant="outline"
                    className="bg-transparent border-gray-500/50 text-white hover:bg-gray-500/20"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hủy
                  </Button>
                  <Button
                    onClick={handleSave}
                    size="sm"
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Lưu
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <span className="ml-2 text-white">Đang tải...</span>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/50">
              <TabsTrigger value="overview" className="text-white">Tổng Quan</TabsTrigger>
              <TabsTrigger value="team" className="text-white">Đội Ngũ</TabsTrigger>
              <TabsTrigger value="tasks" className="text-white">Công Việc</TabsTrigger>
              <TabsTrigger value="milestones" className="text-white">Cột Mốc</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Info */}
                <Card className="bg-black/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Thông Tin Cơ Bản</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editing ? (
                      <>
                        <div>
                          <Label className="text-white">Tên dự án</Label>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="bg-black/30 border-purple-500/30 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-white">Mô tả</Label>
                          <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="bg-black/30 border-purple-500/30 text-white"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white">Công ty</Label>
                            <Select
                              value={formData.company_id}
                              onValueChange={(value) => setFormData({...formData, company_id: value})}
                            >
                              <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {companies && Array.isArray(companies)
                                  ? companies.map((company) => (
                                      <SelectItem key={company.id} value={company.id.toString()}>
                                        {company.name}
                                      </SelectItem>
                                    ))
                                  : []
                                }
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-white">Quản lý</Label>
                            <Select
                              value={formData.manager_id}
                              onValueChange={(value) => setFormData({...formData, manager_id: value})}
                            >
                              <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                                <SelectValue placeholder="Chọn quản lý" />
                              </SelectTrigger>
                              <SelectContent>
                                {employees && Array.isArray(employees)
                                  ? employees
                                      .filter((emp) => {
                                        if (emp?.company_id == null || formData.company_id == null) return false
                                        return emp.company_id.toString() === formData.company_id.toString()
                                      })
                                      .map((employee) => (
                                        <SelectItem key={employee.id} value={employee.id.toString()}>
                                          {employee.name}
                                        </SelectItem>
                                      ))
                                  : []
                                }
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-white/60 text-sm">Công ty</p>
                          <p className="text-white font-medium">{project?.company_name}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Quản lý dự án</p>
                          <p className="text-white">{project?.manager_name || 'Chưa phân công'}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Mô tả</p>
                          <p className="text-white">{project?.description || 'Chưa có mô tả'}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Trạng thái</p>
                          <Badge className={getStatusColor(project?.status)}>
                            {getStatusText(project?.status)}
                          </Badge>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Project Stats */}
                <Card className="bg-black/50 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Thống Kê</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{project?.progress || 0}%</div>
                        <p className="text-white/60 text-sm">Tiến độ</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{project?.team_size || 0}</div>
                        <p className="text-white/60 text-sm">Thành viên</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">{project?.tasks?.length || 0}</div>
                        <p className="text-white/60 text-sm">Công việc</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{project?.milestones?.length || 0}</div>
                        <p className="text-white/60 text-sm">Cột mốc</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <Card className="bg-black/50 border-blue-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Đội Ngũ Dự Án
                    </CardTitle>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => setShowAddMemberModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm Thành Viên
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-purple-500/30">
                        <TableHead className="text-white">Tên</TableHead>
                        <TableHead className="text-white">Vai trò</TableHead>
                        <TableHead className="text-white">Email</TableHead>
                        <TableHead className="text-white">Ngày tham gia</TableHead>
                        <TableHead className="text-white w-16">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {project?.team_members?.map((member: any) => (
                        <TableRow key={member.id} className="border-b border-purple-500/20">
                          <TableCell className="text-white">{member.employee_name}</TableCell>
                          <TableCell className="text-white">{member.role}</TableCell>
                          <TableCell className="text-white/80">{member.employee_email}</TableCell>
                          <TableCell className="text-white/80">
                            {new Date(member.join_date).toLocaleDateString('vi-VN')}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                              onClick={() => {
                                if (confirm('Bạn có chắc muốn xóa thành viên này?')) {
                                  // Handle delete member
                                  console.log('Delete member:', member.id)
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )) || (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-white/60 py-8">
                            Chưa có thành viên nào
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-6">
              <Card className="bg-black/50 border-green-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <CheckSquare className="h-5 w-5 mr-2" />
                      Công Việc
                    </CardTitle>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => setShowAddTaskModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm Công Việc
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-purple-500/30">
                        <TableHead className="text-white">Tên công việc</TableHead>
                        <TableHead className="text-white">Người thực hiện</TableHead>
                        <TableHead className="text-white">Trạng thái</TableHead>
                        <TableHead className="text-white">Hạn chót</TableHead>
                        <TableHead className="text-white w-16">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {project?.tasks?.map((task: any) => (
                        <TableRow key={task.id} className="border-b border-purple-500/20">
                          <TableCell className="text-white">{task.name}</TableCell>
                          <TableCell className="text-white">{task.assignee_name || 'Chưa phân công'}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(task.status)}>
                              {getStatusText(task.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white/80">
                            {task.due_date ? new Date(task.due_date).toLocaleDateString('vi-VN') : 'Chưa có'}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                              onClick={() => {
                                if (confirm('Bạn có chắc muốn xóa công việc này?')) {
                                  console.log('Delete task:', task.id)
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )) || (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-white/60 py-8">
                            Chưa có công việc nào
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="milestones" className="space-y-6">
              <Card className="bg-black/50 border-orange-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Cột Mốc Dự Án
                    </CardTitle>
                    <Button 
                      size="sm" 
                      className="bg-orange-600 hover:bg-orange-700"
                      onClick={() => setShowAddMilestoneModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm Cột Mốc
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-purple-500/30">
                        <TableHead className="text-white">Tên cột mốc</TableHead>
                        <TableHead className="text-white">Mô tả</TableHead>
                        <TableHead className="text-white">Hạn chót</TableHead>
                        <TableHead className="text-white">Trạng thái</TableHead>
                        <TableHead className="text-white w-16">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {project?.milestones?.map((milestone: any) => (
                        <TableRow key={milestone.id} className="border-b border-purple-500/20">
                          <TableCell className="text-white">{milestone.name}</TableCell>
                          <TableCell className="text-white/80">{milestone.description}</TableCell>
                          <TableCell className="text-white/80">
                            {new Date(milestone.due_date).toLocaleDateString('vi-VN')}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(milestone.status)}>
                              {getStatusText(milestone.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                              onClick={() => {
                                if (confirm('Bạn có chắc muốn xóa cột mốc này?')) {
                                  console.log('Delete milestone:', milestone.id)
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )) || (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-white/60 py-8">
                            Chưa có cột mốc nào
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>

      {/* Add Member Modal */}
      <Dialog open={showAddMemberModal} onOpenChange={setShowAddMemberModal}>
        <DialogContent className="bg-black/90 border-blue-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center text-white">
              <Users className="h-5 w-5 mr-2 text-blue-400" />
              Thêm Thành Viên Dự Án
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Chọn nhân viên</Label>
              <Select value={memberForm.employee_id} onValueChange={(value) => setMemberForm({...memberForm, employee_id: value})}>
                <SelectTrigger className="bg-black/30 border-blue-500/30 text-white">
                  <SelectValue placeholder="Chọn nhân viên" />
                </SelectTrigger>
                <SelectContent>
                  {employees && Array.isArray(employees)
                    ? employees
                        .filter((emp) => {
                          if (emp?.company_id == null || !formData.company_id) return false
                          return emp.company_id.toString() === formData.company_id.toString()
                        })
                        .map((employee) => (
                          <SelectItem key={employee.id} value={employee.id.toString()}>
                            {employee.name} - {employee.email}
                          </SelectItem>
                        ))
                    : []
                  }
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white">Vai trò trong dự án</Label>
              <Input
                value={memberForm.role}
                onChange={(e) => setMemberForm({...memberForm, role: e.target.value})}
                placeholder="VD: Frontend Developer, Project Manager, Tester..."
                className="bg-black/30 border-blue-500/30 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Ngày tham gia</Label>
              <Input
                type="date"
                value={memberForm.join_date}
                onChange={(e) => setMemberForm({...memberForm, join_date: e.target.value})}
                className="bg-black/30 border-blue-500/30 text-white"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddMemberModal(false)} className="bg-gray-500/20 border-gray-500/50 text-gray-300">
                Hủy
              </Button>
              <Button onClick={handleAddMember} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Thêm Thành Viên
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Task Modal */}
      <Dialog open={showAddTaskModal} onOpenChange={setShowAddTaskModal}>
        <DialogContent className="bg-black/90 border-green-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center text-white">
              <CheckSquare className="h-5 w-5 mr-2 text-green-400" />
              Thêm Công Việc
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Tên công việc *</Label>
              <Input
                value={taskForm.name}
                onChange={(e) => setTaskForm({...taskForm, name: e.target.value})}
                placeholder="Nhập tên công việc"
                className="bg-black/30 border-green-500/30 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Mô tả</Label>
              <Textarea
                value={taskForm.description}
                onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                placeholder="Mô tả chi tiết công việc"
                className="bg-black/30 border-green-500/30 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Người thực hiện</Label>
                <Select value={taskForm.assignee_id} onValueChange={(value) => setTaskForm({...taskForm, assignee_id: value})}>
                  <SelectTrigger className="bg-black/30 border-green-500/30 text-white">
                    <SelectValue placeholder="Chọn người thực hiện" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Chưa phân công</SelectItem>
                    {project?.team_members?.map((member: any) => (
                      <SelectItem key={member.employee_id} value={member.employee_id.toString()}>
                        {member.employee_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">Ưu tiên</Label>
                <Select value={taskForm.priority} onValueChange={(value) => setTaskForm({...taskForm, priority: value})}>
                  <SelectTrigger className="bg-black/30 border-green-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Thấp</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="urgent">Khẩn cấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-white">Hạn chót</Label>
              <Input
                type="date"
                value={taskForm.due_date}
                onChange={(e) => setTaskForm({...taskForm, due_date: e.target.value})}
                className="bg-black/30 border-green-500/30 text-white"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddTaskModal(false)} className="bg-gray-500/20 border-gray-500/50 text-gray-300">
                Hủy
              </Button>
              <Button onClick={handleAddTask} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Thêm Công Việc
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Milestone Modal */}
      <Dialog open={showAddMilestoneModal} onOpenChange={setShowAddMilestoneModal}>
        <DialogContent className="bg-black/90 border-orange-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center text-white">
              <Target className="h-5 w-5 mr-2 text-orange-400" />
              Thêm Cột Mốc
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Tên cột mốc *</Label>
              <Input
                value={milestoneForm.name}
                onChange={(e) => setMilestoneForm({...milestoneForm, name: e.target.value})}
                placeholder="VD: Hoàn thành giai đoạn 1, Beta release..."
                className="bg-black/30 border-orange-500/30 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Mô tả</Label>
              <Textarea
                value={milestoneForm.description}
                onChange={(e) => setMilestoneForm({...milestoneForm, description: e.target.value})}
                placeholder="Mô tả chi tiết cột mốc"
                className="bg-black/30 border-orange-500/30 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Hạn chót *</Label>
              <Input
                type="date"
                value={milestoneForm.due_date}
                onChange={(e) => setMilestoneForm({...milestoneForm, due_date: e.target.value})}
                className="bg-black/30 border-orange-500/30 text-white"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddMilestoneModal(false)} className="bg-gray-500/20 border-gray-500/50 text-gray-300">
                Hủy
              </Button>
              <Button onClick={handleAddMilestone} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Thêm Cột Mốc
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}