"use client"

import { useState, useEffect } from "react"
import InternalLayout from "@/components/internal-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Pencil, 
  Plus, 
  ArrowLeft, 
  Building2, 
  Users, 
  Folder, 
  Briefcase,
  TrendingUp,
  BarChart3,
  Loader2,
  X
} from "lucide-react"
import { Company } from "@/lib/schema"
import Image from "next/image"
import { LogoUpload } from "@/components/ui/logo-upload"
import Link from "next/link"
import { Pagination, usePagination } from "@/components/ui/pagination"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"

interface CompanyStats {
  id: number
  name: string
  logo_url: string
  industry: string
  status: string
  employee_count: number
  projects_count: number
  departments_count: number
  active_projects: number
}

function CompaniesManagementContent() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [companiesStats, setCompaniesStats] = useState<CompanyStats[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreateMode, setIsCreateMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    logo_url: "",
    website_url: "",
    email: "",
    phone: "",
    address: "",
    established_date: "",
    employee_count: 0,
    industry: "",
    status: "active",
    mission: "",
    vision: "",
    values: [] as string[],
    achievements: [] as string[],
    facebook_url: "",
    twitter_url: "",
    linkedin_url: "",
    youtube_url: "",
    is_featured: false,
    display_order: 0,
    meta_title: "",
    meta_description: ""
  })

  useEffect(() => {
    fetchCompanies()
    fetchCompaniesStats()
  }, [])

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies')
      if (!response.ok) throw new Error('Failed to fetch companies')
      const result = await response.json()
      
      const companiesData = result.data || result
      setCompanies(Array.isArray(companiesData) ? companiesData : [])
    } catch (error) {
      console.error('Error fetching companies:', error)
      toast.error('Không thể tải danh sách công ty')
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCompaniesStats = async () => {
    try {
      // Fetch companies with their stats
      const [companiesRes, projectsRes, employeesRes, departmentsRes] = await Promise.all([
        fetch('/api/companies'),
        fetch('/api/projects'),
        fetch('/api/employees'),
        fetch('/api/departments')
      ])

      const companies = await companiesRes.json()
      const projects = await projectsRes.json()
      const employees = await employeesRes.json()
      const departments = await departmentsRes.json()

      const companiesData = companies.data || []
      const projectsData = projects.data || []
      const employeesData = employees.data || []
      const departmentsData = departments.data || []

      // Calculate stats for each company
      const stats = companiesData.map((company: Company) => {
        const companyProjects = projectsData.filter((p: any) => p.company_id === company.id)
        const companyEmployees = employeesData.filter((e: any) => e.company_id === company.id)
        const companyDepartments = departmentsData.filter((d: any) => d.company_id === company.id)
        const activeProjects = companyProjects.filter((p: any) => 
          p.status === 'in_progress' || p.status === 'active'
        )

        return {
          id: company.id,
          name: company.name,
          logo_url: company.logo_url,
          industry: company.industry,
          status: company.status,
          employee_count: companyEmployees.length,
          projects_count: companyProjects.length,
          departments_count: companyDepartments.length,
          active_projects: activeProjects.length
        }
      })

      setCompaniesStats(stats)
    } catch (error) {
      console.error('Error fetching companies stats:', error)
    }
  }

  // Filter companies
  const filteredCompanies = companiesStats.filter((company) => {
    const matchesSearch = 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.industry && company.industry.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesSearch
  })

  // Pagination
  const {
    currentPage,
    totalPages,
    currentItems: paginatedCompanies,
    totalItems,
    itemsPerPage,
    goToPage
  } = usePagination(filteredCompanies, 8)

  const handleEdit = (company: Company) => {
    setEditingCompany(company)
    setIsCreateMode(false)
    setFormData({
      name: company.name,
      slug: company.slug,
      description: company.description,
      short_description: company.short_description || "",
      logo_url: company.logo_url || "",
      website_url: company.website_url || "",
      email: company.email || "",
      phone: company.phone || "",
      address: company.address || "",
      established_date: company.established_date ? new Date(company.established_date).toISOString().split('T')[0] : "",
      employee_count: company.employee_count,
      industry: company.industry || "",
      status: company.status,
      mission: company.mission || "",
      vision: company.vision || "",
      values: company.values || [],
      achievements: company.achievements || [],
      facebook_url: company.facebook_url || "",
      twitter_url: company.twitter_url || "",
      linkedin_url: company.linkedin_url || "",
      youtube_url: company.youtube_url || "",
      is_featured: company.is_featured || false,
      display_order: company.display_order || 0,
      meta_title: company.meta_title || "",
      meta_description: company.meta_description || ""
    })
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingCompany(null)
    setIsCreateMode(true)
    resetForm()
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (isSaving) return
    
    setIsSaving(true)
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        toast.error('Tên công ty là bắt buộc')
        return
      }

      // Auto-generate slug if empty
      let slug = formData.slug.trim()
      if (!slug && isCreateMode) {
        slug = generateSlug(formData.name)
      }

      if (!slug) {
        toast.error('Slug là bắt buộc')
        return
      }

      // Validate slug format
      if (!/^[a-z0-9-]+$/.test(slug)) {
        toast.error('Slug chỉ được chứa chữ thường, số và dấu gạch ngang')
        return
      }

      // Validate email format if provided
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error('Email không hợp lệ')
        return
      }

      // Validate website URL format if provided
      if (formData.website_url && formData.website_url.trim() && 
          !/^https?:\/\/.+/.test(formData.website_url)) {
        toast.error('Website URL phải bắt đầu với http:// hoặc https://')
        return
      }

      const url = isCreateMode ? '/api/companies' : '/api/companies'
      const method = isCreateMode ? 'POST' : 'PUT'
      const body = isCreateMode ? { ...formData, slug } : { id: editingCompany?.id, ...formData, slug }

      const requestBody = {
        ...body,
        established_date: formData.established_date ? new Date(formData.established_date) : null
      }

      console.log(`${method} ${url} - Request body:`, requestBody)

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      console.log(`${method} ${url} - Response status:`, response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.log(`${method} ${url} - Error response:`, errorData)
        throw new Error(errorData.error || `Failed to ${isCreateMode ? 'create' : 'update'} company`)
      }

      const responseData = await response.json()
      console.log(`${method} ${url} - Success response:`, responseData)

      toast.success(`${isCreateMode ? 'Tạo' : 'Cập nhật'} công ty thành công!`)
      setIsDialogOpen(false)
      setEditingCompany(null)
      resetForm()
      fetchCompanies()
      fetchCompaniesStats()
    } catch (error) {
      console.error(`Error ${isCreateMode ? 'creating' : 'updating'} company:`, error)
      toast.error(`Không thể ${isCreateMode ? 'tạo' : 'cập nhật'} công ty: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }



  const handleLogoUpload = (result: { url: string; public_id: string }) => {
    setFormData(prev => ({ ...prev, logo_url: result.url }))
  }

  const handleLogoDelete = () => {
    setFormData(prev => ({ ...prev, logo_url: "" }))
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      // Auto-generate slug only in create mode and if slug is empty or matches previous auto-generated slug
      slug: isCreateMode && (!prev.slug || prev.slug === generateSlug(prev.name)) 
        ? generateSlug(name) 
        : prev.slug
    }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      short_description: "",
      logo_url: "",
      website_url: "",
      email: "",
      phone: "",
      address: "",
      established_date: "",
      employee_count: 0,
      industry: "",
      status: "active",
      mission: "",
      vision: "",
      values: [],
      achievements: [],
      facebook_url: "",
      twitter_url: "",
      linkedin_url: "",
      youtube_url: "",
      is_featured: false,
      display_order: 0,
      meta_title: "",
      meta_description: ""
    })
    setEditingCompany(null)
  }

  // Calculate overall stats
  const totalProjects = companiesStats.reduce((sum, company) => sum + company.projects_count, 0)
  const totalEmployees = companiesStats.reduce((sum, company) => sum + company.employee_count, 0)
  const totalDepartments = companiesStats.reduce((sum, company) => sum + company.departments_count, 0)
  const totalActiveProjects = companiesStats.reduce((sum, company) => sum + company.active_projects, 0)

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
        <Link href="/internal">
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cổng Nội Bộ
          </Button>
        </Link>
        <span className="text-white/40">/</span>
        <span className="text-white">Quản Lý Công Ty</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Quản Lý Công Ty
          </h1>
          <p className="text-white/80">Tổng quan và quản lý thông tin các công ty thành viên</p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm Công Ty
        </Button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Tổng Công Ty</p>
                <p className="text-2xl font-bold text-white">{companies.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Tổng Dự Án</p>
                <p className="text-2xl font-bold text-white">{totalProjects}</p>
                <p className="text-xs text-green-400">{totalActiveProjects} đang hoạt động</p>
              </div>
              <Folder className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Tổng Nhân Viên</p>
                <p className="text-2xl font-bold text-white">{totalEmployees}</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Tổng Phòng Ban</p>
                <p className="text-2xl font-bold text-white">{totalDepartments}</p>
              </div>
              <Briefcase className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Companies Overview */}
      <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-white">Tổng Quan Công Ty</CardTitle>
              <CardDescription className="text-white/80">
                Hiển thị {paginatedCompanies.length} trên tổng số {filteredCompanies.length} công ty
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Tìm kiếm công ty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-purple-500/30">
                  <TableHead className="text-white">Logo</TableHead>
                  <TableHead className="text-white">Tên Công Ty</TableHead>
                  <TableHead className="text-white">Ngành</TableHead>
                  <TableHead className="text-white">Dự Án</TableHead>
                  <TableHead className="text-white">Phòng Ban</TableHead>
                  <TableHead className="text-white">Nhân Viên</TableHead>
                  <TableHead className="text-white">Trạng Thái</TableHead>
                  <TableHead className="text-white">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCompanies && paginatedCompanies.length > 0 ? (
                  paginatedCompanies.map((company) => (
                    <TableRow key={company.id} className="border-b border-purple-500/30 hover:bg-white/5">
                      <TableCell>
                        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                          {company.logo_url ? (
                            <Image
                              src={company.logo_url}
                              alt={`${company.name} logo`}
                              width={48}
                              height={48}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Building2 className="h-6 w-6 text-white/60" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-white">{company.name}</TableCell>
                      <TableCell className="text-white/80">{company.industry}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{company.projects_count}</span>
                          <span className="text-xs text-green-400">{company.active_projects} hoạt động</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{company.departments_count}</TableCell>
                      <TableCell className="text-white">{company.employee_count}</TableCell>
                      <TableCell>
                        <Badge 
                          className={company.status === 'active' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                          }
                        >
                          {company.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(companies.find(c => c.id === company.id)!)}
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-white/60">
                      Không có dữ liệu công ty nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black/90 border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-white">
              {isCreateMode ? 'Thêm Công Ty Mới' : 'Chỉnh Sửa Công Ty'}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/10">
              <TabsTrigger value="basic" className="text-white data-[state=active]:bg-purple-600">Thông Tin Cơ Bản</TabsTrigger>
              <TabsTrigger value="content" className="text-white data-[state=active]:bg-purple-600">Nội Dung</TabsTrigger>
              <TabsTrigger value="social" className="text-white data-[state=active]:bg-purple-600">Mạng Xã Hội</TabsTrigger>
              <TabsTrigger value="seo" className="text-white data-[state=active]:bg-purple-600">SEO</TabsTrigger>
            </TabsList>
            
            {/* Tab 1: Thông Tin Cơ Bản */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-white">Tên Công Ty *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="Nhập tên công ty..."
                  />
                </div>
                <div>
                  <Label htmlFor="slug" className="text-white">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="url-friendly-name"
                  />
                  <p className="text-white/60 text-xs mt-1">
                    URL: /companies/{formData.slug || 'slug'}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="short_description" className="text-white">Mô Tả Ngắn</Label>
                <Input
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="Mô tả ngắn gọn về công ty..."
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white">Mô Tả Chi Tiết</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <div>
                <LogoUpload
                  onUpload={handleLogoUpload}
                  onDelete={handleLogoDelete}
                  currentImage={formData.logo_url}
                  label="Logo Công Ty"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website_url" className="text-white">Website</Label>
                  <Input
                    id="website_url"
                    value={formData.website_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="contact@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-white">Điện Thoại</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="industry" className="text-white">Ngành</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-white">Địa Chỉ</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  rows={2}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="established_date" className="text-white">Ngày Thành Lập</Label>
                  <Input
                    id="established_date"
                    type="date"
                    value={formData.established_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, established_date: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="employee_count" className="text-white">Số Nhân Viên</Label>
                  <Input
                    id="employee_count"
                    type="number"
                    value={formData.employee_count}
                    onChange={(e) => setFormData(prev => ({ ...prev, employee_count: parseInt(e.target.value) || 0 }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="display_order" className="text-white">Thứ Tự Hiển Thị</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: !!checked }))}
                />
                <Label htmlFor="is_featured" className="text-white">Công ty nổi bật</Label>
              </div>
            </TabsContent>

            {/* Tab 2: Nội Dung */}
            <TabsContent value="content" className="space-y-4">
              <div>
                <Label htmlFor="mission" className="text-white">Sứ Mệnh</Label>
                <Textarea
                  id="mission"
                  value={formData.mission}
                  onChange={(e) => setFormData(prev => ({ ...prev, mission: e.target.value }))}
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="Sứ mệnh của công ty..."
                />
              </div>

              <div>
                <Label htmlFor="vision" className="text-white">Tầm Nhìn</Label>
                <Textarea
                  id="vision"
                  value={formData.vision}
                  onChange={(e) => setFormData(prev => ({ ...prev, vision: e.target.value }))}
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="Tầm nhìn của công ty..."
                />
              </div>

              <div>
                <Label className="text-white">Giá Trị Cốt Lõi</Label>
                <div className="space-y-2">
                  {formData.values.map((value, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={value}
                        onChange={(e) => {
                          const newValues = [...formData.values]
                          newValues[index] = e.target.value
                          setFormData(prev => ({ ...prev, values: newValues }))
                        }}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder={`Giá trị ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newValues = formData.values.filter((_, i) => i !== index)
                          setFormData(prev => ({ ...prev, values: newValues }))
                        }}
                        className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-500/30"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, values: [...prev.values, ""] }))}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm Giá Trị
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-white">Thành Tựu</Label>
                <div className="space-y-2">
                  {formData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={achievement}
                        onChange={(e) => {
                          const newAchievements = [...formData.achievements]
                          newAchievements[index] = e.target.value
                          setFormData(prev => ({ ...prev, achievements: newAchievements }))
                        }}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        placeholder={`Thành tựu ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newAchievements = formData.achievements.filter((_, i) => i !== index)
                          setFormData(prev => ({ ...prev, achievements: newAchievements }))
                        }}
                        className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-500/30"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, achievements: [...prev.achievements, ""] }))}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm Thành Tựu
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Tab 3: Mạng Xã Hội */}
            <TabsContent value="social" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook_url" className="text-white">Facebook</Label>
                  <Input
                    id="facebook_url"
                    value={formData.facebook_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, facebook_url: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="https://facebook.com/company"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter_url" className="text-white">Twitter</Label>
                  <Input
                    id="twitter_url"
                    value={formData.twitter_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, twitter_url: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="https://twitter.com/company"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="linkedin_url" className="text-white">LinkedIn</Label>
                  <Input
                    id="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="https://linkedin.com/company/company"
                  />
                </div>
                <div>
                  <Label htmlFor="youtube_url" className="text-white">YouTube</Label>
                  <Input
                    id="youtube_url"
                    value={formData.youtube_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="https://youtube.com/company"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tab 4: SEO */}
            <TabsContent value="seo" className="space-y-4">
              <div>
                <Label htmlFor="meta_title" className="text-white">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="Tiêu đề SEO (60 ký tự)"
                  maxLength={60}
                />
                <p className="text-white/60 text-sm mt-1">{formData.meta_title.length}/60 ký tự</p>
              </div>

              <div>
                <Label htmlFor="meta_description" className="text-white">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="Mô tả SEO (160 ký tự)"
                  maxLength={160}
                />
                <p className="text-white/60 text-sm mt-1">{formData.meta_description.length}/160 ký tự</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-4 border-t border-white/20">
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false)
                resetForm()
              }}
              disabled={isSaving}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 disabled:opacity-50"
            >
              Hủy
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isCreateMode ? 'Đang tạo...' : 'Đang lưu...'}
                </>
              ) : (
                isCreateMode ? 'Tạo Công Ty' : 'Lưu Thay Đổi'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function CompaniesManagementPage() {
  return (
    <InternalLayout>
      <CompaniesManagementContent />
    </InternalLayout>
  )
}