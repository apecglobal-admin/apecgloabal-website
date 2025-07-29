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
  User,
  Building2,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

interface EmployeeCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function EmployeeCreateModal({ isOpen, onClose, onSuccess }: EmployeeCreateModalProps) {
  const [companies, setCompanies] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [creating, setCreating] = useState(false)

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
    if (!formData.name || !formData.email || !formData.company_id) {
      toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc')
      return
    }

    setCreating(true)
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
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
        toast.success('Tạo nhân viên thành công!')
        resetForm()
        onSuccess()
        onClose()
      } else {
        toast.error('Lỗi: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating employee:', error)
      toast.error('Lỗi kết nối server')
    } finally {
      setCreating(false)
    }
  }

  const resetForm = () => {
    setFormData({
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
              Thêm Nhân Viên Mới
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
                Thêm Nhân Viên
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
                <Label className="text-white">Họ tên *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                  placeholder="Nhập họ tên"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-black/30 border-purple-500/30 text-white"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <Label className="text-white">Số điện thoại</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="bg-black/30 border-purple-500/30 text-white"
                    placeholder="0123456789"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Địa chỉ</Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                  rows={3}
                  placeholder="Địa chỉ liên hệ"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Người liên hệ khẩn cấp</Label>
                  <Input
                    value={formData.emergency_contact}
                    onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})}
                    className="bg-black/30 border-purple-500/30 text-white"
                    placeholder="Tên người liên hệ"
                  />
                </div>
                <div>
                  <Label className="text-white">SĐT khẩn cấp</Label>
                  <Input
                    value={formData.emergency_phone}
                    onChange={(e) => setFormData({...formData, emergency_phone: e.target.value})}
                    className="bg-black/30 border-purple-500/30 text-white"
                    placeholder="0123456789"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Info */}
          <Card className="bg-black/50 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white">Thông tin công việc</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                            <User className="h-4 w-4" />
                            <span>{department.name}</span>
                          </div>
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
                  placeholder="Vị trí công việc"
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
                    placeholder="0"
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
                    <SelectItem value="active">Đang làm việc</SelectItem>
                    <SelectItem value="inactive">Nghỉ việc</SelectItem>
                    <SelectItem value="on_leave">Nghỉ phép</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills & Additional Info */}
        <Card className="bg-black/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-white">Kỹ năng & thông tin bổ sung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white">Kỹ năng</Label>
              <Input
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                className="bg-black/30 border-purple-500/30 text-white"
                placeholder="React, Node.js, Python (phân cách bằng dấu phẩy)"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Học vấn</Label>
                <Textarea
                  value={formData.education}
                  onChange={(e) => setFormData({...formData, education: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                  rows={4}
                  placeholder="Thông tin về trình độ học vấn"
                />
              </div>

              <div>
                <Label className="text-white">Kinh nghiệm</Label>
                <Textarea
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                  rows={4}
                  placeholder="Kinh nghiệm làm việc trước đây"
                />
              </div>
            </div>

            <div>
              <Label className="text-white">Ghi chú</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="bg-black/30 border-purple-500/30 text-white"
                rows={3}
                placeholder="Ghi chú thêm về nhân viên"
              />
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}