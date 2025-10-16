"use client"

import { useState, useEffect } from "react"
import InternalLayout from "@/components/internal-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Pencil, 
  Plus, 
  ArrowLeft, 
  Building2, 
  Users, 
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  AlertTriangle,
  Home,
  Loader2,
  X,
  Search,
  Filter
} from "lucide-react"
import { Job } from "@/lib/schema"
import Link from "next/link"
import { toast } from "sonner"
import { Pagination, usePagination } from "@/components/ui/pagination"

interface JobWithCompany extends Job {
  company_name: string
  company_logo: string
  department_name?: string
}

const JOB_TYPES = [
  "Toàn thời gian",
  "Bán thời gian", 
  "Thực tập",
  "Freelance",
  "Hợp đồng"
]

const EXPERIENCE_LEVELS = [
  "Không yêu cầu",
  "Dưới 1 năm",
  "1-2 năm",
  "2-5 năm", 
  "5-10 năm",
  "Trên 10 năm"
]

const JOB_STATUS = [
  { value: "active", label: "Đang tuyển", color: "green" },
  { value: "paused", label: "Tạm dừng", color: "yellow" },
  { value: "closed", label: "Đã đóng", color: "red" },
  { value: "filled", label: "Đã tuyển đủ", color: "blue" }
]

function JobsManagementContent() {
  const [jobs, setJobs] = useState<JobWithCompany[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingJob, setEditingJob] = useState<JobWithCompany | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreateMode, setIsCreateMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    company_id: 0,
    department_id: 0,
    location: "",
    type: "",
    experience_required: "",
    salary_range: "",
    description: "",
    requirements: [] as string[],
    benefits: [] as string[],
    skills: [] as string[],
    status: "active",
    urgent: false,
    remote_ok: false
  })
  const [locationManuallyEdited, setLocationManuallyEdited] = useState(false)

  // Temporary states for adding arrays
  const [newRequirement, setNewRequirement] = useState("")
  const [newBenefit, setNewBenefit] = useState("")
  const [newSkill, setNewSkill] = useState("")

  useEffect(() => {
    fetchJobs()
    fetchCompanies()
    fetchDepartments()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/jobs')
      if (!response.ok) throw new Error('Failed to fetch jobs')
      const result = await response.json()
      
      const jobsData = result.data || result
      setJobs(Array.isArray(jobsData) ? jobsData : [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
      toast.error('Không thể tải danh sách việc làm')
      setJobs([])
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

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments')
      if (!response.ok) throw new Error('Failed to fetch departments')
      const result = await response.json()
      const departmentsData = result.data || result
      setDepartments(Array.isArray(departmentsData) ? departmentsData : [])
    } catch (error) {
      console.error('Error fetching departments:', error)
      setDepartments([])
    }
  }

  const handleCompanyChange = (companyId: number) => {
    setFormData((prev) => ({
      ...prev,
      company_id: companyId,
      department_id: 0,
    }))

    if (!locationManuallyEdited && companyId) {
      const selectedCompany = companies.find((company) => company.id === companyId)
      if (selectedCompany?.address) {
        setFormData((prev) => ({
          ...prev,
          location: selectedCompany.address ?? prev.location,
        }))
      }
    }
  }

  const handleEdit = (job: JobWithCompany) => {
    setEditingJob(job)
    setIsCreateMode(false)
    setFormData({
      title: job.title,
      company_id: job.company_id,
      department_id: job.department_id || 0,
      location: job.location || "",
      type: job.type || "",
      experience_required: job.experience_required || "",
      salary_range: job.salary_range || "",
      description: job.description,
      requirements: job.requirements || [],
      benefits: job.benefits || [],
      skills: job.skills || [],
      status: job.status,
      urgent: job.urgent || false,
      remote_ok: job.remote_ok || false
    })
    setLocationManuallyEdited(false)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingJob(null)
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
        toast.error('Tiêu đề công việc là bắt buộc')
        return
      }

      if (!formData.company_id) {
        toast.error('Vui lòng chọn công ty')
        return
      }

      if (!formData.description.trim()) {
        toast.error('Mô tả công việc là bắt buộc')
        return
      }

      const url = isCreateMode ? '/api/jobs' : '/api/jobs'
      const method = isCreateMode ? 'POST' : 'PUT'
      const body = isCreateMode ? formData : { id: editingJob?.id, ...formData }

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
        throw new Error(errorData.error || `Failed to ${isCreateMode ? 'create' : 'update'} job`)
      }

      const responseData = await response.json()
      console.log(`${method} ${url} - Success response:`, responseData)

      toast.success(`${isCreateMode ? 'Tạo' : 'Cập nhật'} việc làm thành công!`)
      setIsDialogOpen(false)
      setEditingJob(null)
      resetForm()
      fetchJobs()
    } catch (error) {
      console.error(`Error ${isCreateMode ? 'creating' : 'updating'} job:`, error)
      toast.error(`Không thể ${isCreateMode ? 'tạo' : 'cập nhật'} việc làm: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (job: JobWithCompany) => {
    if (!confirm('Bạn có chắc chắn muốn xóa việc làm này?')) return

    try {
      const response = await fetch('/api/jobs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: job.id })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete job')
      }

      toast.success('Xóa việc làm thành công!')
      fetchJobs()
    } catch (error) {
      console.error('Error deleting job:', error)
      toast.error('Không thể xóa việc làm')
    }
  }

  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }))
      setNewRequirement("")
    }
  }

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }))
  }

  const addBenefit = () => {
    if (newBenefit.trim() && !formData.benefits.includes(newBenefit.trim())) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }))
      setNewBenefit("")
    }
  }

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      company_id: 0,
      department_id: 0,
      location: "",
      type: "",
      experience_required: "",
      salary_range: "",
      description: "",
      requirements: [],
      benefits: [],
      skills: [],
      status: "active",
      urgent: false,
      remote_ok: false
    })
    setLocationManuallyEdited(false)
    setNewRequirement("")
    setNewBenefit("")
    setNewSkill("")
    setEditingJob(null)
  }

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCompany = selectedCompany === "all" || job.company_id.toString() === selectedCompany
    const matchesStatus = selectedStatus === "all" || job.status === selectedStatus
    const matchesType = selectedType === "all" || job.type === selectedType
    
    return matchesSearch && matchesCompany && matchesStatus && matchesType
  })

  // Pagination
  const {
    currentPage,
    totalPages,
    currentItems: paginatedJobs,
    totalItems,
    itemsPerPage,
    goToPage
  } = usePagination(filteredJobs, 8)

  // Calculate stats
  const totalJobs = jobs.length
  const activeJobs = jobs.filter(j => j.status === 'active').length
  const urgentJobs = jobs.filter(j => j.urgent).length
  const remoteJobs = jobs.filter(j => j.remote_ok).length

  // Get filtered departments based on selected company
  const filteredDepartments = formData.company_id 
    ? departments.filter(dept => dept.company_id === formData.company_id)
    : departments

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
        <span className="text-white">Quản Lý Tuyển Dụng</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Quản Lý Tuyển Dụng
          </h1>
          <p className="text-white/80">Tổng quan và quản lý các vị trí tuyển dụng của các công ty thành viên</p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm Việc Làm
        </Button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black/50 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Tổng Việc Làm</p>
                <p className="text-2xl font-bold text-white">{totalJobs}</p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Đang Tuyển</p>
                <p className="text-2xl font-bold text-white">{activeJobs}</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-red-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Tuyển Gấp</p>
                <p className="text-2xl font-bold text-white">{urgentJobs}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Làm Từ Xa</p>
                <p className="text-2xl font-bold text-white">{remoteJobs}</p>
              </div>
              <Home className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-black/50 border-white/10">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label className="text-white/80">Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Tìm theo tiêu đề, công ty..."
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
              <Label className="text-white/80">Trạng thái</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {JOB_STATUS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">Loại hình</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Chọn loại hình" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {JOB_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
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
                  setSelectedStatus("all")
                  setSelectedType("all")
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

      {/* Jobs Table */}
      <Card className="bg-black/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Danh Sách Việc Làm (Hiển thị {paginatedJobs.length} trên tổng {filteredJobs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/80">Vị trí</TableHead>
                  <TableHead className="text-white/80">Công ty</TableHead>
                  <TableHead className="text-white/80">Địa điểm</TableHead>
                  <TableHead className="text-white/80">Loại hình</TableHead>
                  <TableHead className="text-white/80">Mức lương</TableHead>
                  <TableHead className="text-white/80">Trạng thái</TableHead>
                  <TableHead className="text-white/80">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedJobs.map((job) => {
                  const statusInfo = JOB_STATUS.find(s => s.value === job.status) || JOB_STATUS[0]
                  
                  return (
                    <TableRow key={job.id} className="border-white/10">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-white flex items-center space-x-2">
                            <span>{job.title}</span>
                            {job.urgent && (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/50 text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Gấp
                              </Badge>
                            )}
                            {job.remote_ok && (
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 text-xs">
                                <Home className="h-3 w-3 mr-1" />
                                Remote
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-white/60">
                            {job.experience_required && `Kinh nghiệm: ${job.experience_required}`}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-white">{job.company_name}</div>
                        {job.department_name && (
                          <div className="text-sm text-white/60">{job.department_name}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-white/80">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location || "Chưa xác định"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {job.type || "Chưa xác định"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-white/80">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {job.salary_range || "Thỏa thuận"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`border-${statusInfo.color}-500/50 text-${statusInfo.color}-400`}
                        >
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(job)}
                            className="text-white/60 hover:text-white hover:bg-white/10"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(job)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            {filteredJobs.length === 0 && (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">Không tìm thấy việc làm nào</p>
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
        <DialogContent className="bg-black/90 border-white/10 text-white max-w-6xl">
          <DialogHeader>
            <DialogTitle>
              {isCreateMode ? "Thêm Việc Làm Mới" : "Chỉnh Sửa Việc Làm"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[80vh] overflow-y-auto pr-2">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                Thông Tin Cơ Bản
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề công việc *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="Nhập tiêu đề công việc"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_id">Công ty *</Label>
                <Select 
                  value={formData.company_id ? formData.company_id.toString() : ""}
                  onValueChange={(value) => handleCompanyChange(parseInt(value))}
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
                <Label htmlFor="department_id">Phòng ban</Label>
                <Select 
                  value={formData.department_id.toString()} 
                  onValueChange={(value) => setFormData({...formData, department_id: parseInt(value)})}
                  disabled={!formData.company_id}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Không xác định</SelectItem>
                    {filteredDepartments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Địa điểm</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => {
                    setLocationManuallyEdited(true)
                    setFormData({...formData, location: e.target.value})
                  }}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="Nhập địa điểm làm việc"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Loại hình công việc</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({...formData, type: value})}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Chọn loại hình" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience_required">Kinh nghiệm yêu cầu</Label>
                <Select 
                  value={formData.experience_required} 
                  onValueChange={(value) => setFormData({...formData, experience_required: value})}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Chọn mức kinh nghiệm" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary_range">Mức lương</Label>
                <Input
                  id="salary_range"
                  value={formData.salary_range}
                  onChange={(e) => setFormData({...formData, salary_range: e.target.value})}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="VD: 15-25 triệu"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({...formData, status: value})}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_STATUS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="urgent"
                    checked={formData.urgent}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, urgent: checked as boolean})
                    }
                  />
                  <Label htmlFor="urgent">Tuyển gấp</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remote_ok"
                    checked={formData.remote_ok}
                    onCheckedChange={(checked) => 
                      setFormData({...formData, remote_ok: checked as boolean})
                    }
                  />
                  <Label htmlFor="remote_ok">Có thể làm từ xa</Label>
                </div>
              </div>
            </div>

            {/* Middle Column - Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                Mô Tả Công Việc
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả chi tiết *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-white/5 border-white/10 text-white min-h-[200px]"
                  placeholder="Mô tả chi tiết về công việc, trách nhiệm và môi trường làm việc..."
                />
              </div>

              <div className="space-y-2">
                <Label>Yêu cầu công việc</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    className="bg-white/5 border-white/10 text-white flex-1"
                    placeholder="Thêm yêu cầu"
                    onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                  />
                  <Button
                    type="button"
                    onClick={addRequirement}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/5 p-2 rounded">
                      <span className="text-sm">{req}</span>
                      <Button
                        type="button"
                        onClick={() => removeRequirement(index)}
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

            {/* Right Column - Benefits & Skills */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                Quyền Lợi & Kỹ Năng
              </h3>
              
              <div className="space-y-2">
                <Label>Quyền lợi</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    className="bg-white/5 border-white/10 text-white flex-1"
                    placeholder="Thêm quyền lợi"
                    onKeyPress={(e) => e.key === 'Enter' && addBenefit()}
                  />
                  <Button
                    type="button"
                    onClick={addBenefit}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/5 p-2 rounded">
                      <span className="text-sm">{benefit}</span>
                      <Button
                        type="button"
                        onClick={() => removeBenefit(index)}
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

              <div className="space-y-2">
                <Label>Kỹ năng cần thiết</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="bg-white/5 border-white/10 text-white flex-1"
                    placeholder="Thêm kỹ năng"
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button
                    type="button"
                    onClick={addSkill}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/5 p-2 rounded">
                      <span className="text-sm">{skill}</span>
                      <Button
                        type="button"
                        onClick={() => removeSkill(index)}
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
    </div>
  )
}

export default function InternalJobsPage() {
  return (
    <InternalLayout>
      <JobsManagementContent />
    </InternalLayout>
  )
}