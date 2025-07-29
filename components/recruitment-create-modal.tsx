"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Save,
  X,
  Building2,
  Users,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

interface RecruitmentCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function RecruitmentCreateModal({ isOpen, onClose, onSuccess }: RecruitmentCreateModalProps) {
  const [companies, setCompanies] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [creating, setCreating] = useState(false)

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
    if (isOpen) {
      fetchCompanies()
      fetchDepartments()
    }
  }, [isOpen])

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

    setCreating(true)
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
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
        toast.success('Tạo tin tuyển dụng thành công!')
        resetForm()
        onSuccess()
        onClose()
      } else {
        toast.error('Lỗi: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating job:', error)
      toast.error('Lỗi kết nối server')
    } finally {
      setCreating(false)
    }
  }

  const resetForm = () => {
    setFormData({
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
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">
              Tạo Tin Tuyển Dụng Mới
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleClose}
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
                disabled={creating}
                className="bg-green-600 hover:bg-green-700"
              >
                {creating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Tạo Tin Tuyển Dụng
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <Card className="bg-black/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Tiêu đề công việc *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                  placeholder="Nhập tiêu đề công việc"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Công ty *</Label>
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
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4" />
                            <span>{company.name}</span>
                          </div>
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
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>{department.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-white">Địa điểm làm việc</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                  placeholder="Hà Nội, TP.HCM, Remote..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Loại hình công việc</Label>
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
                  <Label className="text-white">Cấp độ kinh nghiệm</Label>
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
            </CardContent>
          </Card>

          {/* Salary & Contact */}
          <Card className="bg-black/50 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white">Lương & liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Lương tối thiểu (VND)</Label>
                  <Input
                    type="number"
                    value={formData.salary_min}
                    onChange={(e) => setFormData({...formData, salary_min: e.target.value})}
                    className="bg-black/30 border-purple-500/30 text-white"
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label className="text-white">Lương tối đa (VND)</Label>
                  <Input
                    type="number"
                    value={formData.salary_max}
                    onChange={(e) => setFormData({...formData, salary_max: e.target.value})}
                    className="bg-black/30 border-purple-500/30 text-white"
                    placeholder="0"
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Email liên hệ</Label>
                  <Input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                    className="bg-black/30 border-purple-500/30 text-white"
                    placeholder="hr@company.com"
                  />
                </div>
                <div>
                  <Label className="text-white">Số điện thoại</Label>
                  <Input
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                    className="bg-black/30 border-purple-500/30 text-white"
                    placeholder="0123456789"
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
                    <SelectItem value="draft">Bản nháp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black/50 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white">Mô tả công việc</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label className="text-white">Mô tả chi tiết</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                  rows={8}
                  placeholder="Mô tả chi tiết về công việc, trách nhiệm, môi trường làm việc..."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-white">Yêu cầu ứng viên</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label className="text-white">Yêu cầu kỹ năng</Label>
                <Textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                  rows={8}
                  placeholder="Yêu cầu về kỹ năng, kinh nghiệm, bằng cấp, tính cách..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits */}
        <Card className="bg-black/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Quyền lợi & phúc lợi</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label className="text-white">Quyền lợi được hưởng</Label>
              <Textarea
                value={formData.benefits}
                onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                className="bg-black/30 border-purple-500/30 text-white"
                rows={6}
                placeholder="Các quyền lợi, phúc lợi, cơ hội phát triển mà ứng viên sẽ được hưởng..."
              />
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}