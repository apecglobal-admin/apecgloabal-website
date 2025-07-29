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
  Plus,
  Loader2,
  Building2,
  User
} from "lucide-react"
import { toast } from "sonner"

interface Company {
  id: number
  name: string
  logo_url: string
}

interface Employee {
  id: number
  name: string
  email: string
  company_id: number
}

interface ProjectCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ProjectCreateModal({ isOpen, onClose, onSuccess }: ProjectCreateModalProps) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)

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
    if (isOpen) {
      fetchCompanies()
      fetchEmployees()
    }
  }, [isOpen])

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

    setCreating(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
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
        toast.success('Tạo dự án thành công!')
        resetForm()
        onSuccess()
        onClose()
      } else {
        toast.error('Lỗi: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Lỗi kết nối server')
    } finally {
      setCreating(false)
    }
  }

  const resetForm = () => {
    setFormData({
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
              Tạo Dự Án Mới
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
                Tạo Dự Án
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
                <Label className="text-white">Tên dự án *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                  placeholder="Nhập tên dự án"
                />
              </div>
              
              <div>
                <Label className="text-white">Mô tả</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                  rows={4}
                  placeholder="Mô tả chi tiết về dự án"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Công ty *</Label>
                  <Select
                    value={formData.company_id}
                    onValueChange={(value) => setFormData({...formData, company_id: value, manager_id: ""})}
                  >
                    <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                      <SelectValue placeholder="Chọn công ty" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies && Array.isArray(companies)
                        ? companies.map((company) => (
                            <SelectItem key={company.id} value={company.id.toString()}>
                              <div className="flex items-center space-x-2">
                                <Building2 className="h-4 w-4" />
                                <span>{company.name}</span>
                              </div>
                            </SelectItem>
                          ))
                        : []
                      }
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Quản lý dự án</Label>
                  <Select
                    value={formData.manager_id}
                    onValueChange={(value) => setFormData({...formData, manager_id: value})}
                    disabled={!formData.company_id}
                  >
                    <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                      <SelectValue placeholder="Chọn quản lý" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees && Array.isArray(employees)
                        ? employees
                            .filter(emp => emp.company_id.toString() === formData.company_id)
                            .map((employee) => (
                              <SelectItem key={employee.id} value={employee.id.toString()}>
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4" />
                                  <span>{employee.name}</span>
                                </div>
                              </SelectItem>
                            ))
                        : []
                      }
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Ngày bắt đầu</Label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    className="bg-black/30 border-purple-500/30 text-white"
                  />
                </div>
                
                <div>
                  <Label className="text-white">Ngày kết thúc</Label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    className="bg-black/30 border-purple-500/30 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
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
                      <SelectItem value="planning">Lên kế hoạch</SelectItem>
                      <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                      <SelectItem value="on_hold">Tạm dừng</SelectItem>
                      <SelectItem value="completed">Hoàn thành</SelectItem>
                      <SelectItem value="cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Độ ưu tiên</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({...formData, priority: value})}
                  >
                    <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Thấp</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="high">Cao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Ngân sách (VND)</Label>
                  <Input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    className="bg-black/30 border-purple-500/30 text-white"
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client & Additional Info */}
          <Card className="bg-black/50 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white">Thông tin khách hàng & bổ sung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Tên khách hàng</Label>
                <Input
                  value={formData.client_name}
                  onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                  placeholder="Tên khách hàng"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Email khách hàng</Label>
                  <Input
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => setFormData({...formData, client_email: e.target.value})}
                    className="bg-black/30 border-purple-500/30 text-white"
                    placeholder="email@example.com"
                  />
                </div>
                
                <div>
                  <Label className="text-white">Số điện thoại</Label>
                  <Input
                    value={formData.client_phone}
                    onChange={(e) => setFormData({...formData, client_phone: e.target.value})}
                    className="bg-black/30 border-purple-500/30 text-white"
                    placeholder="0123456789"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Địa điểm</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                  placeholder="Địa điểm thực hiện dự án"
                />
              </div>

              <div>
                <Label className="text-white">Công nghệ sử dụng</Label>
                <Input
                  value={formData.technologies}
                  onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                  placeholder="React, Node.js, PostgreSQL (phân cách bằng dấu phẩy)"
                />
              </div>

              <div>
                <Label className="text-white">Yêu cầu dự án</Label>
                <Textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                  rows={4}
                  placeholder="Mô tả chi tiết yêu cầu của dự án"
                />
              </div>

              <div>
                <Label className="text-white">Sản phẩm bàn giao</Label>
                <Textarea
                  value={formData.deliverables}
                  onChange={(e) => setFormData({...formData, deliverables: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                  rows={4}
                  placeholder="Danh sách sản phẩm bàn giao (mỗi dòng một sản phẩm)"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}