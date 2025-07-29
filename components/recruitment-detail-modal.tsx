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
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Eye,
  UserCheck,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

interface RecruitmentDetailModalProps {
  isOpen: boolean
  onClose: () => void
  jobId: number | null
  editMode?: boolean
}

export function RecruitmentDetailModal({ isOpen, onClose, jobId, editMode = false }: RecruitmentDetailModalProps) {
  const [job, setJob] = useState<any>(null)
  const [companies, setCompanies] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(editMode)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    benefits: "",
    company_id: "",
    department_id: "",
    location: "",
    salary_min: "",
    salary_max: "",
    employment_type: "full_time",
    experience_level: "mid",
    status: "active",
    deadline: "",
    contact_email: "",
    contact_phone: ""
  })

  useEffect(() => {
    if (isOpen && jobId) {
      fetchJob()
      fetchCompanies()
      fetchDepartments()
    }
    setEditing(editMode)
  }, [isOpen, jobId, editMode])

  const fetchJob = async () => {
    if (!jobId) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/jobs/${jobId}`)
      const result = await response.json()
      if (result.success) {
        const jobData = result.data
        setJob(jobData)
        setFormData({
          title: jobData.title || "",
          description: jobData.description || "",
          requirements: jobData.requirements || "",
          benefits: jobData.benefits || "",
          company_id: jobData.company_id?.toString() || "",
          department_id: jobData.department_id?.toString() || "",
          location: jobData.location || "",
          salary_min: jobData.salary_min?.toString() || "",
          salary_max: jobData.salary_max?.toString() || "",
          employment_type: jobData.employment_type || "full_time",
          experience_level: jobData.experience_level || "mid",
          status: jobData.status || "active",
          deadline: jobData.deadline ? new Date(jobData.deadline).toISOString().split('T')[0] : "",
          contact_email: jobData.contact_email || "",
          contact_phone: jobData.contact_phone || ""
        })
      }
    } catch (error) {
      console.error('Error fetching job:', error)
      toast.error('Không thể tải thông tin tuyển dụng')
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
    if (!formData.title || !formData.company_id) {
      toast.error('Vui lòng nhập tiêu đề và chọn công ty')
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          salary_min: parseFloat(formData.salary_min) || 0,
          salary_max: parseFloat(formData.salary_max) || 0,
          company_id: parseInt(formData.company_id),
          department_id: formData.department_id ? parseInt(formData.department_id) : null
        })
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success('Cập nhật tin tuyển dụng thành công!')
        setEditing(false)
        fetchJob()
      } else {
        toast.error('Lỗi: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating job:', error)
      toast.error('Lỗi kết nối server')
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-600/20 text-green-400 border-green-500/30'
      case 'closed':
        return 'bg-red-600/20 text-red-400 border-red-500/30'
      case 'paused':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30'
      case 'draft':
        return 'bg-gray-600/20 text-gray-400 border-gray-500/30'
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang tuyển'
      case 'closed':
        return 'Đã đóng'
      case 'paused':
        return 'Tạm dừng'
      case 'draft':
        return 'Bản nháp'
      default:
        return status
    }
  }

  const getEmploymentTypeText = (type: string) => {
    switch (type) {
      case 'full_time':
        return 'Toàn thời gian'
      case 'part_time':
        return 'Bán thời gian'
      case 'contract':
        return 'Hợp đồng'
      case 'internship':
        return 'Thực tập'
      default:
        return type
    }
  }

  const getExperienceLevelText = (level: string) => {
    switch (level) {
      case 'entry':
        return 'Mới ra trường'
      case 'mid':
        return 'Trung cấp'
      case 'senior':
        return 'Cao cấp'
      case 'lead':
        return 'Trưởng nhóm'
      default:
        return level
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
              {job?.title || 'Chi Tiết Tuyển Dụng'}
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
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/50">
              <TabsTrigger value="details" className="text-white">Chi Tiết</TabsTrigger>
              <TabsTrigger value="applications" className="text-white">Ứng Viên</TabsTrigger>
              <TabsTrigger value="analytics" className="text-white">Thống Kê</TabsTrigger>
              <TabsTrigger value="settings" className="text-white">Cài Đặt</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Job Info */}
                <Card className="bg-black/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Thông Tin Công Việc</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editing ? (
                      <>
                        <div>
                          <Label className="text-white">Tiêu đề công việc</Label>
                          <Input
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="bg-black/30 border-purple-500/30 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
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
                        </div>
                        <div>
                          <Label className="text-white">Địa điểm</Label>
                          <Input
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            className="bg-black/30 border-purple-500/30 text-white"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-white/60 text-sm">Công ty</p>
                          <p className="text-white font-medium">{job?.company_name}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Phòng ban</p>
                          <p className="text-white">{job?.department_name || 'Chưa xác định'}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Địa điểm</p>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-green-400" />
                            <span className="text-white">{job?.location || 'Chưa xác định'}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Trạng thái</p>
                          <Badge className={getStatusColor(job?.status)}>
                            {getStatusText(job?.status)}
                          </Badge>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Job Requirements */}
                <Card className="bg-black/50 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Yêu Cầu & Điều Kiện</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editing ? (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white">Loại hình</Label>
                            <Select
                              value={formData.employment_type}
                              onValueChange={(value) => setFormData({...formData, employment_type: value})}
                            >
                              <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="full_time">Toàn thời gian</SelectItem>
                                <SelectItem value="part_time">Bán thời gian</SelectItem>
                                <SelectItem value="contract">Hợp đồng</SelectItem>
                                <SelectItem value="internship">Thực tập</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-white">Kinh nghiệm</Label>
                            <Select
                              value={formData.experience_level}
                              onValueChange={(value) => setFormData({...formData, experience_level: value})}
                            >
                              <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="entry">Mới ra trường</SelectItem>
                                <SelectItem value="mid">Trung cấp</SelectItem>
                                <SelectItem value="senior">Cao cấp</SelectItem>
                                <SelectItem value="lead">Trưởng nhóm</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white">Lương tối thiểu (VND)</Label>
                            <Input
                              type="number"
                              value={formData.salary_min}
                              onChange={(e) => setFormData({...formData, salary_min: e.target.value})}
                              className="bg-black/30 border-purple-500/30 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-white">Lương tối đa (VND)</Label>
                            <Input
                              type="number"
                              value={formData.salary_max}
                              onChange={(e) => setFormData({...formData, salary_max: e.target.value})}
                              className="bg-black/30 border-purple-500/30 text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-white">Hạn nộp hồ sơ</Label>
                          <Input
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                            className="bg-black/30 border-purple-500/30 text-white"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Briefcase className="h-4 w-4 text-purple-400" />
                            <span className="text-white">{getEmploymentTypeText(job?.employment_type)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-blue-400" />
                            <span className="text-white">{getExperienceLevelText(job?.experience_level)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-green-400" />
                            <span className="text-white">
                              {job?.salary_min && job?.salary_max 
                                ? `${formatCurrency(job.salary_min)} - ${formatCurrency(job.salary_max)}`
                                : 'Thỏa thuận'
                              }
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-orange-400" />
                            <span className="text-white">
                              {job?.deadline 
                                ? `Hạn nộp: ${new Date(job.deadline).toLocaleDateString('vi-VN')}`
                                : 'Không giới hạn'
                              }
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Job Description */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black/50 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Mô Tả Công Việc</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editing ? (
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="bg-black/30 border-purple-500/30 text-white"
                        rows={8}
                        placeholder="Mô tả chi tiết về công việc..."
                      />
                    ) : (
                      <p className="text-white whitespace-pre-wrap">
                        {job?.description || 'Chưa có mô tả'}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-black/50 border-orange-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Yêu Cầu Ứng Viên</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editing ? (
                      <Textarea
                        value={formData.requirements}
                        onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                        className="bg-black/30 border-purple-500/30 text-white"
                        rows={8}
                        placeholder="Yêu cầu về kỹ năng, kinh nghiệm..."
                      />
                    ) : (
                      <p className="text-white whitespace-pre-wrap">
                        {job?.requirements || 'Chưa có yêu cầu'}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Benefits */}
              <Card className="bg-black/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Quyền Lợi & Phúc Lợi</CardTitle>
                </CardHeader>
                <CardContent>
                  {editing ? (
                    <Textarea
                      value={formData.benefits}
                      onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                      className="bg-black/30 border-purple-500/30 text-white"
                      rows={6}
                      placeholder="Các quyền lợi và phúc lợi cho ứng viên..."
                    />
                  ) : (
                    <p className="text-white whitespace-pre-wrap">
                      {job?.benefits || 'Chưa có thông tin về quyền lợi'}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <Card className="bg-black/50 border-blue-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <UserCheck className="h-5 w-5 mr-2" />
                      Danh Sách Ứng Viên
                    </CardTitle>
                    <Badge className="bg-blue-600/20 text-blue-400">
                      {job?.applications?.length || 0} ứng viên
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-purple-500/30">
                        <TableHead className="text-white">Ứng viên</TableHead>
                        <TableHead className="text-white">Email</TableHead>
                        <TableHead className="text-white">Ngày nộp</TableHead>
                        <TableHead className="text-white">Trạng thái</TableHead>
                        <TableHead className="text-white">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {job?.applications?.map((application: any) => (
                        <TableRow key={application.id} className="border-b border-purple-500/20">
                          <TableCell className="text-white">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={application.avatar_url} />
                                <AvatarFallback className="bg-purple-600 text-white text-xs">
                                  {application.name?.charAt(0)?.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span>{application.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-white/80">{application.email}</TableCell>
                          <TableCell className="text-white/80">
                            {new Date(application.applied_at).toLocaleDateString('vi-VN')}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(application.status)}>
                              {application.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" className="bg-transparent border-purple-500/50 text-white hover:bg-purple-500/20">
                              <Eye className="h-4 w-4 mr-1" />
                              Xem
                            </Button>
                          </TableCell>
                        </TableRow>
                      )) || (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-white/60 py-8">
                            Chưa có ứng viên nào
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black/50 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Thống Kê Tuyển Dụng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-400">{job?.view_count || 0}</div>
                        <p className="text-white/60 text-sm">Lượt xem</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-400">{job?.application_count || 0}</div>
                        <p className="text-white/60 text-sm">Ứng viên</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-400">{job?.interview_count || 0}</div>
                        <p className="text-white/60 text-sm">Phỏng vấn</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-400">{job?.hired_count || 0}</div>
                        <p className="text-white/60 text-sm">Được tuyển</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Hiệu Suất Tuyển Dụng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/60">Tỷ lệ ứng tuyển</span>
                        <span className="text-white">{job?.application_rate || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${job?.application_rate || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/60">Tỷ lệ phỏng vấn</span>
                        <span className="text-white">{job?.interview_rate || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${job?.interview_rate || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/60">Tỷ lệ tuyển dụng</span>
                        <span className="text-white">{job?.hire_rate || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${job?.hire_rate || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-black/50 border-orange-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Thông Tin Liên Hệ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editing ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white">Email liên hệ</Label>
                          <Input
                            type="email"
                            value={formData.contact_email}
                            onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                            className="bg-black/30 border-purple-500/30 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-white">Số điện thoại</Label>
                          <Input
                            value={formData.contact_phone}
                            onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                            className="bg-black/30 border-purple-500/30 text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-white">Trạng thái</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => setFormData({...formData, status: value})}
                        >
                          <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Đang tuyển</SelectItem>
                            <SelectItem value="paused">Tạm dừng</SelectItem>
                            <SelectItem value="closed">Đã đóng</SelectItem>
                            <SelectItem value="draft">Bản nháp</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-white/60 text-sm">Email liên hệ</p>
                        <p className="text-white">{job?.contact_email || 'Chưa cập nhật'}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Số điện thoại</p>
                        <p className="text-white">{job?.contact_phone || 'Chưa cập nhật'}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Ngày tạo</p>
                        <p className="text-white">
                          {job?.created_at ? new Date(job.created_at).toLocaleDateString('vi-VN') : 'Chưa có'}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}