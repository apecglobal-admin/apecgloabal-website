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
  User,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

interface DepartmentCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function DepartmentCreateModal({ isOpen, onClose, onSuccess }: DepartmentCreateModalProps) {
  const [companies, setCompanies] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [creating, setCreating] = useState(false)

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
    if (isOpen) {
      fetchCompanies()
      fetchEmployees()
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

    setCreating(true)
    try {
      const response = await fetch('/api/departments', {
        method: 'POST',
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
        toast.success('Tạo phòng ban thành công!')
        resetForm()
        onSuccess()
        onClose()
      } else {
        toast.error('Lỗi: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating department:', error)
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
      budget: "",
      location: "",
      phone: "",
      email: "",
      status: "active",
      goals: "",
      responsibilities: ""
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
              Tạo Phòng Ban Mới
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
                Tạo Phòng Ban
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
                <Label className="text-white">Tên phòng ban *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                  placeholder="Nhập tên phòng ban"
                />
              </div>
              
              <div>
                <Label className="text-white">Mô tả</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                  rows={4}
                  placeholder="Mô tả về phòng ban"
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
                  <Label className="text-white">Trưởng phòng</Label>
                  <Select
                    value={formData.manager_id}
                    onValueChange={(value) => setFormData({...formData, manager_id: value})}
                    disabled={!formData.company_id}
                  >
                    <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                      <SelectValue placeholder="Chọn trưởng phòng" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees
                        .filter(emp => emp.company_id.toString() === formData.company_id)
                        .map((employee) => (
                          <SelectItem key={employee.id} value={employee.id.toString()}>
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span>{employee.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
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
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                    <SelectItem value="restructuring">Tái cơ cấu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Budget */}
          <Card className="bg-black/50 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white">Liên hệ & ngân sách</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Địa điểm</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                  placeholder="Vị trí văn phòng"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Số điện thoại</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="bg-black/30 border-purple-500/30 text-white"
                    placeholder="0123456789"
                  />
                </div>
                <div>
                  <Label className="text-white">Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-black/30 border-purple-500/30 text-white"
                    placeholder="department@company.com"
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
                  placeholder="0"
                />
              </div>

              <div>
                <Label className="text-white">Mục tiêu</Label>
                <Textarea
                  value={formData.goals}
                  onChange={(e) => setFormData({...formData, goals: e.target.value})}
                  className="bg-black/30 border-purple-500/30 text-white"
                  rows={4}
                  placeholder="Mục tiêu của phòng ban"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Responsibilities */}
        <Card className="bg-black/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-white">Trách nhiệm & nhiệm vụ</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label className="text-white">Trách nhiệm chính</Label>
              <Textarea
                value={formData.responsibilities}
                onChange={(e) => setFormData({...formData, responsibilities: e.target.value})}
                className="bg-black/30 border-purple-500/30 text-white"
                rows={6}
                placeholder="Mô tả chi tiết về trách nhiệm và nhiệm vụ của phòng ban..."
              />
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}