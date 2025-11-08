"use client"

import InternalLayout from "@/components/cms-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProjectDetailModal } from "@/components/project-detail-modal"
import { ProjectCreateModal } from "@/components/project-create-modal"
import { ProjectReportModal } from "@/components/project-report-modal"
import { ProjectImportModal } from "@/components/project-import-modal"
import Link from "next/link"
import {
  Plus,
  Search,
  Filter,
  ArrowLeft,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  Target,
  BarChart3,
  Eye,
  Edit,
  DollarSign,
  Loader2,
  Trash2,
  Archive,
  Copy,
  Download,
  Upload,
  MoreVertical,
  Play,
  Pause,
  RefreshCw,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Pagination, usePagination } from "@/components/ui/pagination"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { useDispatch, useSelector } from "react-redux"
import { listProjects, listStatusProject } from "@/src/features/project/projectApi"
import { listCompanies } from "@/src/features/company/companyApi"

export default function InternalProjectsPage() {
  const dispatch = useDispatch();
  const { projects, statusProject, loading } = useSelector(
    (state: any) => state.project
  );
  const { companies } = useSelector(
    (state: any) => state.company
  );
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedCompany, setSelectedCompany] = useState("all")
  
  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [deletingProject, setDeletingProject] = useState(null)
  const [deleting, setDeleting] = useState(false)
  
  // Bulk operations
  const [selectedProjects, setSelectedProjects] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [bulkOperationLoading, setBulkOperationLoading] = useState(false)

  useEffect(() => {
    dispatch(listProjects() as any);
    dispatch(listCompanies() as any);
    dispatch(listStatusProject() as any);
  }, [dispatch]);

  // Helper function to get status name by ID
  const getStatusName = (statusId: number) => {
    const status = statusProject.find(s => parseInt(s.id) === statusId)
    return status ? status.name : 'Không xác định'
  }

  // Calculate stats from actual data
  const inProgressCount = projects.filter(p => 
    p.project_status_id === 2 // "Đang thực hiện"
  ).length
  
  const completedCount = projects.filter(p => 
    p.project_status_id === 4 // "Hoàn thành"
  ).length
  
  const delayedCount = projects.filter(p =>
    p.project_status_id === 6 // "Trễ tiến độ"
  ).length
  
  const totalBudget = projects.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0)
  const totalSpent = projects.reduce((sum, p) => sum + (parseFloat(p.spent) || 0), 0)
  
  const stats = [
    {
      title: "Tổng Dự Án",
      value: projects.length.toString(),
      change: "+3",
      icon: Target,
      color: "text-purple-400",
    },
    {
      title: "Đang Triển Khai",
      value: inProgressCount.toString(),
      change: "+2",
      icon: TrendingUp,
      color: "text-blue-400",
    },
    {
      title: "Hoàn Thành",
      value: completedCount.toString(),
      change: "+1",
      icon: CheckCircle,
      color: "text-green-400",
    },
    {
      title: "Ngân Sách",
      value: `${(totalBudget / 1000000).toFixed(1)}M VND`,
      change: "+15%",
      icon: BarChart3,
      color: "text-orange-400",
    },
  ]

  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 1: // Lập kế hoạch
        return "bg-yellow-600"
      case 2: // Đang thực hiện
        return "bg-blue-600"
      case 3: // Tạm dừng
        return "bg-orange-600"
      case 4: // Hoàn thành
        return "bg-green-600"
      case 5: // Hủy
        return "bg-red-600"
      case 6: // Trễ tiến độ
        return "bg-red-700"
      case 7: // Bảo trì và nâng cấp
        return "bg-purple-600"
      default:
        return "bg-gray-600"
    }
  }

  const getCompanyColor = (companyName: string) => {
    const colors = [
      "bg-blue-500/20 text-blue-300 border-blue-500/50",
      "bg-green-500/20 text-green-300 border-green-500/50", 
      "bg-purple-500/20 text-purple-300 border-purple-500/50",
      "bg-orange-500/20 text-orange-300 border-orange-500/50",
      "bg-pink-500/20 text-pink-300 border-pink-500/50"
    ]
    const hash = companyName?.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0) || 0
    return colors[Math.abs(hash) % colors.length]
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
      case "cao":
        return "bg-red-500/20 text-red-300 border-red-500/50"
      case "medium":
      case "trung bình":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50"
      case "low":
      case "thấp":
        return "bg-green-500/20 text-green-300 border-green-500/50"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/50"
    }
  }

  const getPriorityLabel = (priority: string) => {
    const priorityMap = {
      'high': 'Cao',
      'medium': 'Trung bình',
      'low': 'Thấp'
    }
    return priorityMap[priority?.toLowerCase()] || priority || 'Chưa xác định'
  }

  const handleCreateProject = () => {
    setShowCreateModal(true)
  }

  const handleViewProject = (project) => {
    setSelectedProjectId(project.id)
    setEditMode(false)
    setShowDetailModal(true)
  }

  const handleEditProject = (project) => {
    setSelectedProjectId(project.id)
    setEditMode(true)
    setShowDetailModal(true)
  }

  const handleProjectReport = (project) => {
    setSelectedProjectId(project.id)
    setShowReportModal(true)
  }

  const handleDeleteProject = async () => {
  }

  const handleArchiveProject = async (projectId) => {
  }

  const handleCloneProject = async (project) => {
  }

  const handleQuickStatusUpdate = async (projectId, statusId) => {

  }

  // Bulk operations handlers
  const handleSelectProject = (projectId, checked) => {
    if (checked) {
      setSelectedProjects([...selectedProjects, projectId])
    } else {
      setSelectedProjects(selectedProjects.filter(id => id !== projectId))
    }
  }

  const handleSelectAll = (checked) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedProjects(paginatedProjects.map(project => project.id))
    } else {
      setSelectedProjects([])
    }
  }

  const handleBulkArchive = async () => {
    // Implement bulk archive
  }

  const handleBulkDelete = async () => {
    // Implement bulk delete
  }

  const handleExportProjects = () => {
    const csvContent = [
      ['Tên dự án', 'Trạng thái', 'Tiến độ', 'Ngân sách', 'Đã chi', 'Ngày bắt đầu', 'Ngày kết thúc'],
      ...filteredProjects.map(project => [
        project.name,
        getStatusName(project.project_status_id),
        `${project.progress || 0}%`,
        formatCurrency(parseFloat(project.budget) || 0),
        formatCurrency(parseFloat(project.spent) || 0),
        formatDate(project.start_date),
        formatDate(project.end_date)
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `projects_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    toast.success('Đã xuất danh sách dự án!')
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác định'
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.client_name && project.client_name.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = selectedStatus === "all" || project.project_status_id === parseInt(selectedStatus)
    
    const matchesCompany = selectedCompany === "all" || project.company_id === parseInt(selectedCompany)
    
    return matchesSearch && matchesStatus && matchesCompany
  })

  // Pagination with custom hook
  const {
    currentPage: currentPageFromHook,
    totalPages,
    currentItems: paginatedProjects,
    totalItems,
    itemsPerPage,
    goToPage
  } = usePagination(filteredProjects, 6)

  return (
    <InternalLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8">
          <Link href="/cms">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              CMS
            </Button>
          </Link>
          <span className="text-white/40">/</span>
          <span className="text-white">Quản Lý Dự Án</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Quản Lý Dự Án</h1>
            <p className="text-white/60">Theo dõi và quản lý tất cả dự án của ApecGlobal Group</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
              onClick={handleCreateProject}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tạo Dự Án Mới
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="bg-black/50 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm font-medium">{stat.title}</p>
                      <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                      <p className="text-green-400 text-sm mt-1">{stat.change} từ tháng trước</p>
                    </div>
                    <IconComponent className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
            <Input
              placeholder="Tìm kiếm dự án theo tên, mô tả, khách hàng..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
              }}
              className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
            />
          </div>
          
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="bg-black/30 border-purple-500/30 text-white min-w-[200px]">
              <SelectValue placeholder="Chọn công ty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả công ty</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id.toString()}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="bg-black/30 border-purple-500/30 text-white min-w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              {statusProject.map((status) => (
                <SelectItem key={status.id} value={status.id}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"
            onClick={() => {
              setSearchTerm("")
              setSelectedStatus("all")
              setSelectedCompany("all")
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Đặt Lại
          </Button>
        </div>

        {/* Quick Status Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-white/60 text-sm self-center mr-2">Lọc nhanh:</span>
          {[
            { label: "Tất cả", value: "all", count: projects.length },
            ...statusProject.map((status) => ({
              label: status.name,
              value: status.id,
              count: projects.filter((p) => p.project_status_id === parseInt(status.id)).length,
            })),
          ].map((filter) => (
            <Button
              key={filter.value}
              variant={selectedStatus === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(filter.value)}
              className={
                selectedStatus === filter.value
                  ? "bg-purple-600 text-white border-purple-500"
                  : "bg-black/30 border-purple-500/30 text-white hover:bg-purple-500/20"
              }
            >
              {filter.label} ({filter.count})
            </Button>
          ))}
        </div>

        {/* Project Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-green-600/20 to-green-500/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm font-medium">Hoàn thành</p>
                  <p className="text-2xl font-bold text-white">{completedCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-600/20 to-orange-500/20 border-orange-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-300 text-sm font-medium">Đang thực hiện</p>
                  <p className="text-2xl font-bold text-white">{inProgressCount}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm font-medium">Tổng ngân sách</p>
                  <p className="text-lg font-bold text-white">{formatCurrency(totalBudget)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Actions Toolbar */}
        {selectedProjects.length > 0 && (
          <div className="bg-purple-600/20 border border-purple-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-white font-medium">
                  Đã chọn {selectedProjects.length} dự án
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedProjects([])
                    setSelectAll(false)
                  }}
                  className="bg-transparent border-white/30 text-white hover:bg-white/10"
                >
                  Bỏ chọn tất cả
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkArchive}
                  disabled={bulkOperationLoading}
                  className="bg-transparent border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/20"
                >
                  {bulkOperationLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Archive className="h-4 w-4 mr-2" />}
                  Lưu trữ
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={bulkOperationLoading}
                  className="bg-transparent border-red-500/50 text-red-300 hover:bg-red-500/20"
                >
                  {bulkOperationLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Export/Import Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={selectAll}
              onCheckedChange={handleSelectAll}
              className="border-white/30"
            />
            <span className="text-white/70 text-sm">Chọn tất cả</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportProjects}
              className="bg-transparent border-green-500/50 text-green-300 hover:bg-green-500/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Xuất Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImportModal(true)}
              className="bg-transparent border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
            >
              <Upload className="h-4 w-4 mr-2" />
              Nhập Excel
            </Button>
          </div>
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <span className="ml-2 text-white">Đang tải dự án...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {paginatedProjects.length === 0 ? (
              <div className="text-center py-20">
                <Target className="h-16 w-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/60">Chưa có dự án nào</p>
                <Button
                  className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                  onClick={handleCreateProject}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo Dự Án Đầu Tiên
                </Button>
              </div>
            ) : (
              paginatedProjects
              .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
              .map((project) => (
                <Card
                  key={project.id}
                  className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Checkbox
                        checked={selectedProjects.includes(project.id)}
                        onCheckedChange={(checked) => handleSelectProject(project.id, checked)}
                        className="border-white/30 mt-1"
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-black/90 border-purple-500/30">
                          <DropdownMenuItem onClick={() => handleViewProject(project)} className="text-white hover:bg-white/10">
                            <Eye className="h-4 w-4 mr-2" />
                            Chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditProject(project)} className="text-white hover:bg-white/10">
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCloneProject(project)} className="text-white hover:bg-white/10">
                            <Copy className="h-4 w-4 mr-2" />
                            Sao chép
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleQuickStatusUpdate(project.id, 2)} className="text-white hover:bg-white/10">
                            <Play className="h-4 w-4 mr-2" />
                            Bắt đầu
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleQuickStatusUpdate(project.id, 3)} className="text-white hover:bg-white/10">
                            <Pause className="h-4 w-4 mr-2" />
                            Tạm dừng
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleArchiveProject(project.id)} className="text-white hover:bg-white/10">
                            <Archive className="h-4 w-4 mr-2" />
                            Lưu trữ
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeletingProject(project)} className="text-red-400 hover:bg-red-500/20">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="grid lg:grid-cols-4 gap-6">
                      {/* Project Info */}
                      <div className="lg:col-span-2 space-y-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-white">{project.name}</h3>
                            {companies.find(c => c.id === project.company_id) && (
                              <Badge className={`${getCompanyColor(companies.find(c => c.id === project.company_id)?.name || '')} border`}>
                                {companies.find(c => c.id === project.company_id)?.name}
                              </Badge>
                            )}
                          </div>
                          <p className="text-white/80 mb-3">{project.description || 'Chưa có mô tả'}</p>
                          <div className="flex items-center space-x-4 text-white/60 text-sm">
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {project.members?.length || 0} thành viên
                            </span>
                            {project.team_size > 0 && (
                              <span className="flex items-center">
                                <Target className="h-4 w-4 mr-1" />
                                Quy mô: {project.team_size}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(project.project_status_id)}>
                            {getStatusName(project.project_status_id)}
                          </Badge>
                          <Badge className={`${getPriorityColor(project.priority)} border`}>
                            {getPriorityLabel(project.priority)}
                          </Badge>
                        </div>

                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Tiến độ</span>
                            <span className="text-white">{project.progress || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${project.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Project Details */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-white/60 text-sm mb-1">Thời gian</p>
                          <div className="text-white text-sm space-y-1">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-green-400" />
                              <span>Bắt đầu: {formatDate(project.start_date)}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-red-400" />
                              <span>Kết thúc: {formatDate(project.end_date)}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-white/60 text-sm mb-1">Ngân sách</p>
                          <div className="text-white text-sm space-y-1">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-2 text-green-400" />
                              <span>Tổng: {formatCurrency(parseFloat(project.budget) || 0)}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-2 text-red-400" />
                              <span>Đã chi: {formatCurrency(parseFloat(project.spent) || 0)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent border-2 border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                          onClick={() => handleViewProject(project)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Chi Tiết
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent border-2 border-green-500/50 text-green-300 hover:bg-green-500/20"
                          onClick={() => handleEditProject(project)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh Sửa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                          onClick={() => handleProjectReport(project)}
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Báo Cáo
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPageFromHook}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={goToPage}
                />
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-white mb-6">Thao Tác Nhanh</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card 
              className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer hover:scale-105"
              onClick={handleCreateProject}
            >
              <CardContent className="p-6 text-center">
                <Plus className="h-12 w-12 mx-auto text-purple-400 mb-4" />
                <h4 className="text-white font-medium mb-2">Tạo Dự Án Mới</h4>
                <p className="text-white/60 text-sm">Khởi tạo dự án mới với template</p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer hover:scale-105">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-blue-400 mb-4" />
                <h4 className="text-white font-medium mb-2">Báo Cáo Tổng Hợp</h4>
                <p className="text-white/60 text-sm">Xem báo cáo tiến độ tất cả dự án</p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer hover:scale-105">
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 mx-auto text-green-400 mb-4" />
                <h4 className="text-white font-medium mb-2">Lịch Dự Án</h4>
                <p className="text-white/60 text-sm">Xem timeline và milestone</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals */}
        <ProjectDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          projectId={selectedProjectId}
          editMode={editMode}
        />

        <ProjectCreateModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            dispatch(listProjects() as any)
          }}
        />

        <ProjectReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          projectId={selectedProjectId}
        />

        <ProjectImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            dispatch(listProjects() as any)
            setShowImportModal(false)
          }}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deletingProject} onOpenChange={() => setDeletingProject(null)}>
          <DialogContent className="bg-black/90 border-red-500/30 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                Xác Nhận Xóa Dự Án
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <p className="text-white/80">
                Bạn có chắc chắn muốn xóa dự án <span className="font-semibold text-red-400">{deletingProject?.name}</span> không?
              </p>
              <p className="text-sm text-red-400">
                ⚠️ Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan (task, member, v.v.).
              </p>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setDeletingProject(null)}
                  className="bg-transparent border-2 border-gray-500/50 text-white hover:bg-gray-500/20"
                  disabled={deleting}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleDeleteProject}
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
                      Xóa Dự Án
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </InternalLayout>
  )
}