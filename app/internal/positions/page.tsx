"use client"

import { useState, useEffect } from "react"
import InternalLayout from "@/components/internal-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Plus, 
  Search, 
  Users, 
  Building2, 
  Edit,
  Loader2,
  Briefcase,
  Crown,
  Trash2,
  Star,
  Shield
} from "lucide-react"
import { toast } from "sonner"
import { Pagination, usePagination } from "@/components/ui/pagination"

interface Position {
  id: number
  title: string
  description?: string
  level: string
  is_manager_position: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

function PositionsManagementContent() {
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")

  const [showManagerOnly, setShowManagerOnly] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPosition, setEditingPosition] = useState<Position | null>(null)
  const [creating, setCreating] = useState(false)
  const [deletingPosition, setDeletingPosition] = useState<Position | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "staff",
    is_manager_position: false,
    is_active: true
  })

  const levels = [
    { value: "intern", label: "Thực tập sinh", color: "bg-gray-500" },
    { value: "staff", label: "Nhân viên", color: "bg-blue-500" },
    { value: "supervisor", label: "Giám sát", color: "bg-green-500" },
    { value: "manager", label: "Quản lý", color: "bg-orange-500" },
    { value: "director", label: "Giám đốc", color: "bg-purple-500" },
    { value: "executive", label: "Điều hành", color: "bg-red-500" },
  ]

  useEffect(() => {
    fetchPositions()
  }, [])

  const fetchPositions = async () => {
    try {
      const response = await fetch('/api/positions')
      const result = await response.json()
      if (result.success) {
        setPositions(result.data.positions || [])
      }
    } catch (error) {
      console.error('Error fetching positions:', error)
      toast.error('Không thể tải danh sách chức vụ')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingPosition(null)
    setFormData({
      title: "",
      description: "",
      level: "staff",
      is_manager_position: false,
      is_active: true
    })
    setShowCreateModal(true)
  }

  const handleEdit = (position: Position) => {
    setEditingPosition(position)
    setFormData({
      title: position.title,
      description: position.description || "",
      level: position.level,
      is_manager_position: position.is_manager_position,
      is_active: position.is_active
    })
    setShowCreateModal(true)
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tên chức vụ')
      return
    }

    setCreating(true)
    try {
      const url = editingPosition ? `/api/positions/${editingPosition.id}` : '/api/positions'
      const method = editingPosition ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      
      if (result.success) {
        setShowCreateModal(false)
        fetchPositions()
        toast.success(`${editingPosition ? 'Cập nhật' : 'Tạo'} chức vụ thành công!`)
      } else {
        toast.error('Lỗi: ' + result.error)
      }
    } catch (error) {
      console.error('Error saving position:', error)
      toast.error('Lỗi kết nối server')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingPosition) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/positions/${deletingPosition.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      
      if (result.success) {
        setDeletingPosition(null)
        fetchPositions()
        toast.success('Xóa chức vụ thành công!')
      } else {
        toast.error('Lỗi: ' + result.error)
      }
    } catch (error) {
      console.error('Error deleting position:', error)
      toast.error('Lỗi kết nối server')
    } finally {
      setDeleting(false)
    }
  }

  // Filter positions
  const filteredPositions = positions.filter((position) => {
    const matchesSearch = 
      position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (position.description && position.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesLevel = selectedLevel === "all" || position.level === selectedLevel
    const matchesManager = !showManagerOnly || position.is_manager_position
    
    return matchesSearch && matchesLevel && matchesManager
  })

  // Pagination
  const {
    currentPage,
    totalPages,
    currentItems: paginatedPositions,
    totalItems,
    itemsPerPage,
    goToPage
  } = usePagination(filteredPositions, 10)

  // Calculate stats
  const totalPositions = positions.length
  const managerPositions = positions.filter(p => p.is_manager_position).length
  const activePositions = positions.filter(p => p.is_active).length
  const positionsByLevel = levels.map(level => ({
    ...level,
    count: positions.filter(p => p.level === level.value).length
  }))

  const getLevelInfo = (level: string) => {
    return levels.find(l => l.value === level) || { label: level, color: "bg-gray-500" }
  }



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <span className="ml-2 text-white">Đang tải chức vụ...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Quản Lý Chức Vụ
          </h1>
          <p className="text-white/80">Quản lý các vị trí công việc và cấp bậc trong tổ chức</p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm Chức Vụ
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Tổng Chức Vụ</p>
                <p className="text-2xl font-bold text-white">{totalPositions}</p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Chức Vụ Quản Lý</p>
                <p className="text-2xl font-bold text-white">{managerPositions}</p>
              </div>
              <Crown className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Đang Hoạt Động</p>
                <p className="text-2xl font-bold text-white">{activePositions}</p>
              </div>
              <Star className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Cấp Bậc</p>
                <p className="text-2xl font-bold text-white">{levels.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level breakdown */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Phân Bố Theo Cấp Bậc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {positionsByLevel.map((level) => (
              <div key={level.value} className="text-center">
                <Badge className={`${level.color} text-white mb-2`}>
                  {level.label}
                </Badge>
                <p className="text-2xl font-bold text-white">{level.count}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm chức vụ, mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
              />
            </div>
            
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="bg-black/30 border-purple-500/30 text-white min-w-[150px]">
                <SelectValue placeholder="Chọn cấp bậc" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả cấp bậc</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            


            <div className="flex items-center space-x-2">
              <Checkbox
                id="manager-only"
                checked={showManagerOnly}
                onCheckedChange={(checked) => setShowManagerOnly(checked as boolean)}
              />
              <Label htmlFor="manager-only" className="text-white text-sm">
                Chỉ hiển thị chức vụ quản lý
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Positions Table */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Danh Sách Chức Vụ</CardTitle>
          <CardDescription className="text-white/80">
            Hiển thị {paginatedPositions.length} trên tổng số {filteredPositions.length} chức vụ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-purple-500/30">
                <TableHead className="text-white">Chức Vụ</TableHead>
                <TableHead className="text-white">Cấp Bậc</TableHead>
                <TableHead className="text-white">Trạng Thái</TableHead>
                <TableHead className="text-white">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPositions.length > 0 ? (
                paginatedPositions.map((position) => {
                  const levelInfo = getLevelInfo(position.level)
                  return (
                    <TableRow key={position.id} className="border-b border-purple-500/30 hover:bg-white/5">
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white">{position.title}</p>
                            {position.is_manager_position && (
                              <Shield className="h-4 w-4 text-orange-400" title="Chức vụ quản lý" />
                            )}
                          </div>
                          {position.description && (
                            <p className="text-sm text-white/60 mt-1">
                              {position.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${levelInfo.color} text-white`}>
                          {levelInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={position.is_active 
                            ? "bg-green-600/20 text-green-400 border-green-500/30" 
                            : "bg-red-600/20 text-red-400 border-red-500/30"
                          }
                        >
                          {position.is_active ? 'Hoạt động' : 'Không hoạt động'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(position)}
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingPosition(position)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-white/60">
                    Không tìm thấy chức vụ nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                showInfo={true}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingPosition ? 'Chỉnh Sửa Chức Vụ' : 'Thêm Chức Vụ Mới'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-white">
                Tên Chức Vụ <span className="text-red-400">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                className="bg-black/50 border-purple-500/30 text-white"
                placeholder="VD: Trưởng Phòng Kỹ Thuật"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-white">Mô Tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                className="bg-black/50 border-purple-500/30 text-white"
                placeholder="Mô tả về chức vụ này..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="level" className="text-white">Cấp Bậc</Label>
              <Select 
                value={formData.level} 
                onValueChange={(value) => setFormData(prev => ({...prev, level: value}))}
              >
                <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_manager"
                checked={formData.is_manager_position}
                onCheckedChange={(checked) => setFormData(prev => ({...prev, is_manager_position: checked as boolean}))}
              />
              <Label htmlFor="is_manager" className="text-white">
                Chức vụ quản lý
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({...prev, is_active: checked as boolean}))}
              />
              <Label htmlFor="is_active" className="text-white">
                Hoạt động
              </Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              disabled={creating}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                editingPosition ? 'Cập nhật' : 'Tạo mới'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deletingPosition} onOpenChange={() => setDeletingPosition(null)}>
        <DialogContent className="bg-black/90 border-red-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400">Xác Nhận Xóa</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-white/80">
              Bạn có chắc chắn muốn xóa chức vụ <strong className="text-white">"{deletingPosition?.title}"</strong>?
            </p>
            <p className="text-red-400 text-sm mt-2">
              Hành động này không thể hoàn tác!
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setDeletingPosition(null)}
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              Hủy
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                'Xóa'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function PositionsManagement() {
  return (
    <InternalLayout>
      <PositionsManagementContent />
    </InternalLayout>
  )
}