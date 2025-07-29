"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Save,
  X,
  Edit,
  Users,
  Briefcase,
  Target,
  TrendingUp,
  Building2,
  User,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

interface DepartmentDetailModalProps {
  isOpen: boolean
  onClose: () => void
  departmentId: number | null
  editMode?: boolean
}

export function DepartmentDetailModal({ isOpen, onClose, departmentId, editMode = false }: DepartmentDetailModalProps) {
  const [department, setDepartment] = useState<any>(null)
  const [companies, setCompanies] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(editMode)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    company_id: "",
    manager_id: "",
    budget: "",
    location: "",
    phone: "",
    email: "",
    status: "active",
    goals: "",
    responsibilities: ""
  })

  useEffect(() => {
    if (isOpen && departmentId) {
      fetchDepartment()
      fetchCompanies()
      fetchEmployees()
    }
    setEditing(editMode)
  }, [isOpen, departmentId, editMode])

  const fetchDepartment = async () => {
    if (!departmentId) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/departments/${departmentId}`)
      const result = await response.json()
      if (result.success) {
        const dept = result.data
        setDepartment(dept)
        setFormData({
          name: dept.name || "",
          description: dept.description || "",
          company_id: dept.company_id?.toString() || "",
          manager_id: dept.manager_id?.toString() || "",
          budget: dept.budget?.toString() || "",
          location: dept.location || "",
          phone: dept.phone || "",
          email: dept.email || "",
          status: dept.status || "active",
          goals: dept.goals || "",
          responsibilities: dept.responsibilities || ""
        })
      }
    } catch (error) {
      console.error('Error fetching department:', error)
      toast.error('Không thể tải thông tin phòng ban')
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

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      const result = await response.json()
      if (result.success) {
        setEmployees(result.data)
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  const handleSave = async () => {
    if (!formData.name || !formData.company_id) {
      toast.error('Vui lòng nhập tên phòng ban và chọn công ty')
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/departments/${departmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          budget: parseFloat(formData.budget) || 0,
          company_id: parseInt(formData.company_id),
          manager_id: formData.manager_id ? parseInt(formData.manager_id) : null
        })
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success('Cập nhật phòng ban thành công!')
        setEditing(false)
        fetchDepartment()
      } else {
        toast.error('Lỗi: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating department:', error)
      toast.error('Lỗi kết nối server')
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-600/20 text-green-400 border-green-500/30'
      case 'inactive':
        return 'bg-red-600/20 text-red-400 border-red-500/30'
      case 'restructuring':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30'
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Hoạt động'
      case 'inactive':
        return 'Ngừng hoạt động'
      case 'restructuring':
        return 'Tái cơ cấu'
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
              {department?.name || 'Chi Tiết Phòng Ban'}
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
              <TabsTrigger value="employees" className="text-white">Nhân Viên</TabsTrigger>
              <TabsTrigger value="projects" className="text-white">Dự Án</TabsTrigger>
              <TabsTrigger value="performance" className="text-white">Hiệu Suất</TabsTrigger>
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
                          <Label className="text-white">Tên phòng ban</Label>
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
                              onValueChange={(value) => setFormData({...formData, company_id: value, manager_id: ""})}
                            >
                              <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                                <SelectValue />
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
                            <Label className="text-white">Trưởng phòng</Label>
                            <Select
                              value={formData.manager_id}
                              onValueChange={(value) => setFormData({...formData, manager_id: value})}
                            >
                              <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                                <SelectValue placeholder="Chọn trưởng phòng" />
                              </SelectTrigger>
                              <SelectContent>
                                {employees
                                  .filter(emp => emp.company_id.toString() === formData.company_id)
                                  .map((employee) => (
                                    <SelectItem key={employee.id} value={employee.id.toString()}>
                                      {employee.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-white/60 text-sm">Công ty</p>
                          <p className="text-white font-medium">{department?.company_name}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Trưởng phòng</p>
                          <p className="text-white">{department?.manager_name || 'Chưa phân công'}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Mô tả</p>
                          <p className="text-white">{department?.description || 'Chưa có mô tả'}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Trạng thái</p>
                          <Badge className={getStatusColor(department?.status)}>
                            {getStatusText(department?.status)}
                          </Badge>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Department Stats */}
                <Card className="bg-black/50 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Thống Kê</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{department?.employee_count || 0}</div>
                        <p className="text-white/60 text-sm">Nhân viên</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{department?.project_count || 0}</div>
                        <p className="text-white/60 text-sm">Dự án</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">
                          {department?.budget ? formatCurrency(department.budget).replace('₫', '') : '0'}
                        </div>
                        <p className="text-white/60 text-sm">Ngân sách (VND)</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{department?.performance_score || 0}%</div>
                        <p className="text-white/60 text-sm">Hiệu suất</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact & Location */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black/50 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Liên Hệ & Địa Điểm</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editing ? (
                      <>
                        <div>
                          <Label className="text-white">Địa điểm</Label>
                          <Input
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            className="bg-black/30 border-purple-500/30 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white">Số điện thoại</Label>
                            <Input
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="bg-black/30 border-purple-500/30 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-white">Email</Label>
                            <Input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="bg-black/30 border-purple-500/30 text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-white">Ngân sách (VND)</Label>
                          <Input
                            type="number"
                            value={formData.budget}
                            onChange={(e) => setFormData({...formData, budget: e.target.value})}
                            className="bg-black/30 border-purple-500/30 text-white"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-white/60 text-sm">Địa điểm</p>
                          <p className="text-white">{department?.location || 'Chưa cập nhật'}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Số điện thoại</p>
                          <p className="text-white">{department?.phone || 'Chưa cập nhật'}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Email</p>
                          <p className="text-white">{department?.email || 'Chưa cập nhật'}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Ngân sách</p>
                          <p className="text-white">
                            {department?.budget ? formatCurrency(department.budget) : 'Chưa cập nhật'}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-black/50 border-orange-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Mục Tiêu & Trách Nhiệm</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editing ? (
                      <>
                        <div>
                          <Label className="text-white">Mục tiêu</Label>
                          <Textarea
                            value={formData.goals}
                            onChange={(e) => setFormData({...formData, goals: e.target.value})}
                            className="bg-black/30 border-purple-500/30 text-white"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label className="text-white">Trách nhiệm</Label>
                          <Textarea
                            value={formData.responsibilities}
                            onChange={(e) => setFormData({...formData, responsibilities: e.target.value})}
                            className="bg-black/30 border-purple-500/30 text-white"
                            rows={3}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-white/60 text-sm">Mục tiêu</p>
                          <p className="text-white whitespace-pre-wrap">
                            {department?.goals || 'Chưa có mục tiêu'}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Trách nhiệm</p>
                          <p className="text-white whitespace-pre-wrap">
                            {department?.responsibilities || 'Chưa có mô tả trách nhiệm'}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="employees" className="space-y-6">
              <Card className="bg-black/50 border-blue-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Danh Sách Nhân Viên
                    </CardTitle>
                    <Badge className="bg-blue-600/20 text-blue-400">
                      {department?.employees?.length || 0} nhân viên
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-purple-500/30">
                        <TableHead className="text-white">Tên</TableHead>
                        <TableHead className="text-white">Chức vụ</TableHead>
                        <TableHead className="text-white">Email</TableHead>
                        <TableHead className="text-white">Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {department?.employees?.map((employee: any) => (
                        <TableRow key={employee.id} className="border-b border-purple-500/20">
                          <TableCell className="text-white">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={employee.avatar_url} />
                                <AvatarFallback className="bg-purple-600 text-white text-xs">
                                  {employee.name?.charAt(0)?.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span>{employee.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-white">{employee.position}</TableCell>
                          <TableCell className="text-white/80">{employee.email}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(employee.status)}>
                              {getStatusText(employee.status)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )) || (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-white/60 py-8">
                            Chưa có nhân viên nào
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card className="bg-black/50 border-green-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Dự Án Phụ Trách
                    </CardTitle>
                    <Badge className="bg-green-600/20 text-green-400">
                      {department?.projects?.length || 0} dự án
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-purple-500/30">
                        <TableHead className="text-white">Tên dự án</TableHead>
                        <TableHead className="text-white">Trạng thái</TableHead>
                        <TableHead className="text-white">Tiến độ</TableHead>
                        <TableHead className="text-white">Ngày bắt đầu</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {department?.projects?.map((project: any) => (
                        <TableRow key={project.id} className="border-b border-purple-500/20">
                          <TableCell className="text-white">{project.name}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white">{project.progress}%</TableCell>
                          <TableCell className="text-white/80">
                            {project.start_date ? new Date(project.start_date).toLocaleDateString('vi-VN') : 'Chưa có'}
                          </TableCell>
                        </TableRow>
                      )) || (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-white/60 py-8">
                            Chưa có dự án nào
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Chỉ Số Hiệu Suất
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-400">
                          {department?.completed_projects || 0}
                        </div>
                        <p className="text-white/60 text-sm">Dự án hoàn thành</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-400">
                          {department?.active_projects || 0}
                        </div>
                        <p className="text-white/60 text-sm">Dự án đang thực hiện</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-400">
                          {department?.avg_project_duration || 0}
                        </div>
                        <p className="text-white/60 text-sm">Thời gian TB (tháng)</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-400">
                          {department?.budget_utilization || 0}%
                        </div>
                        <p className="text-white/60 text-sm">Sử dụng ngân sách</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/50 border-orange-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Đánh Giá Tổng Quan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-400 mb-2">
                        {department?.overall_rating || 0}/5
                      </div>
                      <p className="text-white/60">Đánh giá tổng thể</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/60">Hiệu suất làm việc</span>
                          <span className="text-white">{department?.work_efficiency || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${department?.work_efficiency || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/60">Chất lượng dự án</span>
                          <span className="text-white">{department?.project_quality || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${department?.project_quality || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/60">Tinh thần đồng đội</span>
                          <span className="text-white">{department?.team_spirit || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${department?.team_spirit || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}