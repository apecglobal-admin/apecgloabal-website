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
  User,
  Briefcase,
  Calendar,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Award,
  Clock,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface EmployeeDetailModalProps {
  isOpen: boolean
  onClose: () => void
  employeeId: number | null
  editMode?: boolean
}

export function EmployeeDetailModal({ isOpen, onClose, employeeId, editMode = false }: EmployeeDetailModalProps) {
  const [employee, setEmployee] = useState<any>(null)
  const [companies, setCompanies] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(editMode)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department_id: "",
    company_id: "",
    hire_date: "",
    salary: "",
    status: "active",
    address: "",
    emergency_contact: "",
    emergency_phone: "",
    skills: "",
    education: "",
    experience: "",
    notes: "",
    avatar_url: ""
  })

  useEffect(() => {
    if (isOpen && employeeId) {
      fetchEmployee()
      fetchCompanies()
      fetchDepartments()
    }
    setEditing(editMode)
  }, [isOpen, employeeId, editMode])

  const fetchEmployee = async () => {
    if (!employeeId) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/employees/${employeeId}`)
      const result = await response.json()
      if (result.success) {
        const emp = result.data
        setEmployee(emp)
        setFormData({
          name: emp.name || "",
          email: emp.email || "",
          phone: emp.phone || "",
          position: emp.position || "",
          department_id: emp.department_id?.toString() || "",
          company_id: emp.company_id?.toString() || "",
          hire_date: emp.hire_date ? new Date(emp.hire_date).toISOString().split('T')[0] : "",
          salary: emp.salary?.toString() || "",
          status: emp.status || "active",
          address: emp.address || "",
          emergency_contact: emp.emergency_contact || "",
          emergency_phone: emp.emergency_phone || "",
          skills: Array.isArray(emp.skills) ? emp.skills.join(', ') : "",
          education: emp.education || "",
          experience: emp.experience || "",
          notes: emp.notes || "",
          avatar_url: emp.avatar_url || ""
        })
      }
    } catch (error) {
      console.error('Error fetching employee:', error)
      toast.error('Không thể tải thông tin nhân viên')
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

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.company_id) {
      toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc')
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          salary: parseFloat(formData.salary) || 0,
          company_id: parseInt(formData.company_id),
          department_id: formData.department_id ? parseInt(formData.department_id) : null,
          skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : []
        })
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success('Cập nhật nhân viên thành công!')
        setEditing(false)
        fetchEmployee()
      } else {
        toast.error('Lỗi: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating employee:', error)
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
      case 'on_leave':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30'
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang làm việc'
      case 'inactive':
        return 'Nghỉ việc'
      case 'on_leave':
        return 'Nghỉ phép'
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
              {employee?.name || 'Chi Tiết Nhân Viên'}
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
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/50">
              <TabsTrigger value="personal" className="text-white">Thông Tin</TabsTrigger>
              <TabsTrigger value="work" className="text-white">Công Việc</TabsTrigger>
              <TabsTrigger value="projects" className="text-white">Dự Án</TabsTrigger>
              <TabsTrigger value="performance" className="text-white">Hiệu Suất</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Info */}
                <Card className="bg-black/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Thông Tin Cá Nhân</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={employee?.avatar_url} />
                        <AvatarFallback className="bg-purple-600 text-white text-lg">
                          {employee?.name?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold text-white">{employee?.name}</h3>
                        <p className="text-white/80">{employee?.position}</p>
                        <Badge className={getStatusColor(employee?.status)}>
                          {getStatusText(employee?.status)}
                        </Badge>
                      </div>
                    </div>

                    {editing ? (
                      <>
                        <div>
                          <Label className="text-white">Họ tên</Label>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="bg-black/30 border-purple-500/30 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white">Email</Label>
                            <Input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="bg-black/30 border-purple-500/30 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-white">Số điện thoại</Label>
                            <Input
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="bg-black/30 border-purple-500/30 text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-white">Địa chỉ</Label>
                          <Textarea
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="bg-black/30 border-purple-500/30 text-white"
                            rows={2}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-purple-400" />
                            <span className="text-white">{employee?.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-blue-400" />
                            <span className="text-white">{employee?.phone || 'Chưa cập nhật'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-green-400" />
                            <span className="text-white">{employee?.address || 'Chưa cập nhật'}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card className="bg-black/50 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Liên Hệ Khẩn Cấp</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editing ? (
                      <>
                        <div>
                          <Label className="text-white">Tên người liên hệ</Label>
                          <Input
                            value={formData.emergency_contact}
                            onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})}
                            className="bg-black/30 border-purple-500/30 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-white">Số điện thoại khẩn cấp</Label>
                          <Input
                            value={formData.emergency_phone}
                            onChange={(e) => setFormData({...formData, emergency_phone: e.target.value})}
                            className="bg-black/30 border-purple-500/30 text-white"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-white/60 text-sm">Người liên hệ</p>
                          <p className="text-white">{employee?.emergency_contact || 'Chưa cập nhật'}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Số điện thoại</p>
                          <p className="text-white">{employee?.emergency_phone || 'Chưa cập nhật'}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="work" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Work Info */}
                <Card className="bg-black/50 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Thông Tin Công Việc</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editing ? (
                      <>
                        <div>
                          <Label className="text-white">Công ty</Label>
                          <Select
                            value={formData.company_id}
                            onValueChange={(value) => setFormData({...formData, company_id: value, department_id: ""})}
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
                          <Label className="text-white">Phòng ban</Label>
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
                        <div>
                          <Label className="text-white">Chức vụ</Label>
                          <Input
                            value={formData.position}
                            onChange={(e) => setFormData({...formData, position: e.target.value})}
                            className="bg-black/30 border-purple-500/30 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white">Ngày vào làm</Label>
                            <Input
                              type="date"
                              value={formData.hire_date}
                              onChange={(e) => setFormData({...formData, hire_date: e.target.value})}
                              className="bg-black/30 border-purple-500/30 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-white">Lương (VND)</Label>
                            <Input
                              type="number"
                              value={formData.salary}
                              onChange={(e) => setFormData({...formData, salary: e.target.value})}
                              className="bg-black/30 border-purple-500/30 text-white"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Briefcase className="h-4 w-4 text-purple-400" />
                            <span className="text-white">{employee?.company_name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-blue-400" />
                            <span className="text-white">{employee?.department_name || 'Chưa phân công'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Award className="h-4 w-4 text-green-400" />
                            <span className="text-white">{employee?.position}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-orange-400" />
                            <span className="text-white">
                              {employee?.hire_date ? new Date(employee.hire_date).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-yellow-400" />
                            <span className="text-white">
                              {employee?.salary ? formatCurrency(employee.salary) : 'Chưa cập nhật'}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Skills & Education */}
                <Card className="bg-black/50 border-orange-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Kỹ Năng & Học Vấn</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editing ? (
                      <>
                        <div>
                          <Label className="text-white">Kỹ năng</Label>
                          <Input
                            value={formData.skills}
                            onChange={(e) => setFormData({...formData, skills: e.target.value})}
                            className="bg-black/30 border-purple-500/30 text-white"
                            placeholder="React, Node.js, Python (phân cách bằng dấu phẩy)"
                          />
                        </div>
                        <div>
                          <Label className="text-white">Học vấn</Label>
                          <Textarea
                            value={formData.education}
                            onChange={(e) => setFormData({...formData, education: e.target.value})}
                            className="bg-black/30 border-purple-500/30 text-white"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label className="text-white">Kinh nghiệm</Label>
                          <Textarea
                            value={formData.experience}
                            onChange={(e) => setFormData({...formData, experience: e.target.value})}
                            className="bg-black/30 border-purple-500/30 text-white"
                            rows={3}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-white/60 text-sm mb-2">Kỹ năng</p>
                          <div className="flex flex-wrap gap-2">
                            {employee?.skills?.map((skill: string, index: number) => (
                              <Badge key={index} className="bg-purple-600/20 text-purple-400">
                                {skill}
                              </Badge>
                            )) || <span className="text-white/60">Chưa cập nhật</span>}
                          </div>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Học vấn</p>
                          <p className="text-white">{employee?.education || 'Chưa cập nhật'}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Kinh nghiệm</p>
                          <p className="text-white">{employee?.experience || 'Chưa cập nhật'}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card className="bg-black/50 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Dự Án Tham Gia</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-purple-500/30">
                        <TableHead className="text-white">Tên dự án</TableHead>
                        <TableHead className="text-white">Vai trò</TableHead>
                        <TableHead className="text-white">Trạng thái</TableHead>
                        <TableHead className="text-white">Ngày tham gia</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employee?.projects?.map((project: any) => (
                        <TableRow key={project.id} className="border-b border-purple-500/20">
                          <TableCell className="text-white">{project.project_name}</TableCell>
                          <TableCell className="text-white">{project.role}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(project.project_status)}>
                              {project.project_status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white/80">
                            {new Date(project.join_date).toLocaleDateString('vi-VN')}
                          </TableCell>
                        </TableRow>
                      )) || (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-white/60 py-8">
                            Chưa tham gia dự án nào
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
                <Card className="bg-black/50 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Thống Kê Hiệu Suất</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-400">{employee?.projects?.length || 0}</div>
                        <p className="text-white/60 text-sm">Dự án tham gia</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-400">{employee?.completed_tasks || 0}</div>
                        <p className="text-white/60 text-sm">Công việc hoàn thành</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-400">{employee?.work_hours || 0}h</div>
                        <p className="text-white/60 text-sm">Giờ làm việc</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-400">
                          {employee?.hire_date ? Math.floor((new Date().getTime() - new Date(employee.hire_date).getTime()) / (1000 * 60 * 60 * 24 * 365)) : 0}
                        </div>
                        <p className="text-white/60 text-sm">Năm kinh nghiệm</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Ghi Chú</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editing ? (
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        className="bg-black/30 border-purple-500/30 text-white"
                        rows={6}
                        placeholder="Ghi chú về nhân viên..."
                      />
                    ) : (
                      <p className="text-white whitespace-pre-wrap">
                        {employee?.notes || 'Chưa có ghi chú'}
                      </p>
                    )}
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