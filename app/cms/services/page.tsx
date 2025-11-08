"use client"

import { useState, useEffect } from "react"
import InternalLayout from "@/components/cms-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Pencil, 
  Plus, 
  ArrowLeft, 
  Building2, 
  Settings, 
  DollarSign,
  Star,
  Package,
  Loader2,
  X,
  Search,
  Filter,
  Trash2
} from "lucide-react"
import { Service } from "@/lib/schema"
import { Pagination, usePagination } from "@/components/ui/pagination"
import Link from "next/link"
import { toast } from "sonner"

interface ServiceWithCompany extends Service {
  company_name: string
  company_logo: string
}

interface ServiceStats {
  id: number
  title: string
  company_name: string
  category: string
  is_featured: boolean
  price_range: string
}

const SERVICE_CATEGORIES = [
  "Phát triển phần mềm",
  "Thiết kế web",
  "Digital Marketing",
  "Tư vấn IT",
  "Bảo trì hệ thống",
  "Đào tạo",
  "Khác"
]

const PRICE_RANGES = [
  "Dưới 10 triệu",
  "10-50 triệu",
  "50-100 triệu", 
  "100-500 triệu",
  "Trên 500 triệu",
  "Thỏa thuận"
]

const ICONS = [
  "Code",
  "Palette",
  "Megaphone",
  "Lightbulb",
  "Settings",
  "GraduationCap",
  "Package"
]

function ServicesManagementContent() {
  const [services, setServices] = useState<ServiceWithCompany[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingService, setEditingService] = useState<ServiceWithCompany | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreateMode, setIsCreateMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [deletingService, setDeletingService] = useState<ServiceWithCompany | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    company_id: 0,
    description: "",
    features: [] as string[],
    icon: "Package",
    category: "",
    price_range: "",
    is_featured: false
  })

  // Temporary state for adding features
  const [newFeature, setNewFeature] = useState("")

  useEffect(() => {
    fetchServices()
    fetchCompanies()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/services')
      if (!response.ok) throw new Error('Failed to fetch services')
      const result = await response.json()
      
      const servicesData = result.data || result
      setServices(Array.isArray(servicesData) ? servicesData : [])
    } catch (error) {
      console.error('Error fetching services:', error)
      toast.error('Không thể tải danh sách dịch vụ')
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies')
      if (!response.ok) throw new Error('Failed to fetch companies')
      const result = await response.json()
      const companiesData = result.data || result
      setCompanies(Array.isArray(companiesData) ? companiesData : [])
    } catch (error) {
      console.error('Error fetching companies:', error)
      setCompanies([])
    }
  }

  const handleEdit = (service: ServiceWithCompany) => {
    setEditingService(service)
    setIsCreateMode(false)
    setFormData({
      title: service.title,
      company_id: service.company_id,
      description: service.description,
      features: service.features || [],
      icon: service.icon || "Package",
      category: service.category || "",
      price_range: service.price_range || "",
      is_featured: service.is_featured || false
    })
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingService(null)
    setIsCreateMode(true)
    resetForm()
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (isSaving) return
    
    setIsSaving(true)
    try {
      // Validate required fields
      if (!formData.title.trim()) {
        toast.error('Tên dịch vụ là bắt buộc')
        return
      }

      if (!formData.company_id) {
        toast.error('Vui lòng chọn công ty')
        return
      }

      if (!formData.description.trim()) {
        toast.error('Mô tả dịch vụ là bắt buộc')
        return
      }

      const url = isCreateMode ? '/api/services' : '/api/services'
      const method = isCreateMode ? 'POST' : 'PUT'
      const body = isCreateMode ? formData : { id: editingService?.id, ...formData }

      console.log(`${method} ${url} - Request body:`, body)

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      console.log(`${method} ${url} - Response status:`, response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.log(`${method} ${url} - Error response:`, errorData)
        throw new Error(errorData.error || `Failed to ${isCreateMode ? 'create' : 'update'} service`)
      }

      const responseData = await response.json()
      console.log(`${method} ${url} - Success response:`, responseData)

      toast.success(`${isCreateMode ? 'Tạo' : 'Cập nhật'} dịch vụ thành công!`)
      setIsDialogOpen(false)
      setEditingService(null)
      resetForm()
      fetchServices()
    } catch (error) {
      console.error(`Error ${isCreateMode ? 'creating' : 'updating'} service:`, error)
      toast.error(`Không thể ${isCreateMode ? 'tạo' : 'cập nhật'} dịch vụ: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingService) return

    setDeleting(true)
    try {
      const response = await fetch('/api/services', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deletingService.id })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete service')
      }

      setDeletingService(null)
      toast.success('Xóa dịch vụ thành công!')
      fetchServices()
    } catch (error) {
      console.error('Error deleting service:', error)
      toast.error('Không thể xóa dịch vụ')
    } finally {
      setDeleting(false)
    }
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      company_id: 0,
      description: "",
      features: [],
      icon: "Package",
      category: "",
      price_range: "",
      is_featured: false
    })
    setNewFeature("")
    setEditingService(null)
  }

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCompany = selectedCompany === "all" || service.company_id.toString() === selectedCompany
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory
    
    return matchesSearch && matchesCompany && matchesCategory
  })

  // Pagination
  const {
    currentPage,
    totalPages,
    currentItems: paginatedServices,
    totalItems,
    itemsPerPage,
    goToPage
  } = usePagination(filteredServices, 8)

  // Calculate stats
  const totalServices = services.length
  const featuredServices = services.filter(s => s.is_featured).length
  const servicesByCategory = SERVICE_CATEGORIES.reduce((acc, category) => {
    acc[category] = services.filter(s => s.category === category).length
    return acc
  }, {} as Record<string, number>)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <span className="ml-2 text-white">Đang tải dữ liệu...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 mb-8">
        <Link href="/cms">
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            CMS
          </Button>
        </Link>
        <span className="text-white/40">/</span>
        <span className="text-white">Quản Lý Dịch Vụ</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Quản Lý Dịch Vụ
          </h1>
          <p className="text-white/80">Tổng quan và quản lý các dịch vụ của các công ty thành viên</p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm Dịch Vụ
        </Button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Tổng Dịch Vụ</p>
                <p className="text-2xl font-bold text-white">{totalServices}</p>
              </div>
              <Package className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-yellow-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Dịch Vụ Nổi Bật</p>
                <p className="text-2xl font-bold text-white">{featuredServices}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Danh Mục</p>
                <p className="text-2xl font-bold text-white">{Object.keys(servicesByCategory).filter(k => servicesByCategory[k] > 0).length}</p>
              </div>
              <Settings className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Công Ty</p>
                <p className="text-2xl font-bold text-white">{companies.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-black/50 border-white/10">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-white/80">Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Tìm theo tên, mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-white/80">Công ty</Label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Chọn công ty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">Danh mục</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {SERVICE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">&nbsp;</Label>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCompany("all")
                  setSelectedCategory("all")
                }}
                className="w-full border-white/10 text-white hover:bg-white/10"
              >
                <Filter className="h-4 w-4 mr-2" />
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card className="bg-black/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Danh Sách Dịch Vụ (Hiển thị {paginatedServices.length} trên tổng {filteredServices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/80">Dịch vụ</TableHead>
                  <TableHead className="text-white/80">Công ty</TableHead>
                  <TableHead className="text-white/80">Danh mục</TableHead>
                  <TableHead className="text-white/80">Giá</TableHead>
                  <TableHead className="text-white/80">Trạng thái</TableHead>
                  <TableHead className="text-white/80">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedServices.map((service) => (
                  <TableRow key={service.id} className="border-white/10">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{service.title}</div>
                          <div className="text-sm text-white/60 max-w-xs truncate">
                            {service.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="text-white">{service.company_name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                        {service.category || "Chưa phân loại"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-white/80">{service.price_range || "Thỏa thuận"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {service.is_featured && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                            <Star className="h-3 w-3 mr-1" />
                            Nổi bật
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(service)}
                          className="text-white/60 hover:text-white hover:bg-white/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeletingService(service)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredServices.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">Không tìm thấy dịch vụ nào</p>
              </div>
            )}
          </div>
        </CardContent>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 pb-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={goToPage}
            />
          </div>
        )}
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {isCreateMode ? "Thêm Dịch Vụ Mới" : "Chỉnh Sửa Dịch Vụ"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tên dịch vụ *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="Nhập tên dịch vụ"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_id">Công ty *</Label>
                <Select 
                  value={formData.company_id.toString()} 
                  onValueChange={(value) => setFormData({...formData, company_id: parseInt(value)})}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Chọn công ty" />
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

              <div className="space-y-2">
                <Label htmlFor="category">Danh mục</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_range">Mức giá</Label>
                <Select 
                  value={formData.price_range} 
                  onValueChange={(value) => setFormData({...formData, price_range: value})}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Chọn mức giá" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICE_RANGES.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Select 
                  value={formData.icon} 
                  onValueChange={(value) => setFormData({...formData, icon: value})}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Chọn icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {ICONS.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, is_featured: checked as boolean})
                  }
                />
                <Label htmlFor="is_featured">Dịch vụ nổi bật</Label>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả dịch vụ *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-white/5 border-white/10 text-white min-h-[120px]"
                  placeholder="Nhập mô tả chi tiết về dịch vụ"
                />
              </div>

              <div className="space-y-2">
                <Label>Tính năng/Đặc điểm</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="bg-white/5 border-white/10 text-white flex-1"
                    placeholder="Thêm tính năng"
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                  />
                  <Button
                    type="button"
                    onClick={addFeature}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/5 p-2 rounded">
                      <span className="text-sm">{feature}</span>
                      <Button
                        type="button"
                        onClick={() => removeFeature(index)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-white/10 text-white hover:bg-white/10"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>Lưu</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingService} onOpenChange={() => setDeletingService(null)}>
        <DialogContent className="bg-black/90 border-red-500/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Xác Nhận Xóa Dịch Vụ
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-white/80">
              Bạn có chắc chắn muốn xóa dịch vụ <span className="font-semibold text-red-400">{deletingService?.title}</span> không?
            </p>
            <p className="text-sm text-red-400">
              ⚠️ Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan.
            </p>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setDeletingService(null)}
                className="bg-transparent border-2 border-gray-500/50 text-white hover:bg-gray-500/20"
                disabled={deleting}
              >
                Hủy
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa Dịch Vụ
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function InternalServicesPage() {
  return (
    <InternalLayout>
      <ServicesManagementContent />
    </InternalLayout>
  )
}