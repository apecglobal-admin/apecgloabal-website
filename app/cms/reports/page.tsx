"use client"

import InternalLayout from "@/components/cms-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import {
  BarChart3,
  Download,
  Calendar,
  ArrowLeft,
  FileText,
  PieChart,
  Activity,
  DollarSign,
  Users,
  Target,
  Eye,
  Filter,
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  X,
  Building2,
  Settings,
  Trash2,
  Loader2,
} from "lucide-react"
import { useState, useEffect } from "react"

export default function ReportsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("Tất cả")
  const [selectedDepartment, setSelectedDepartment] = useState("Tất cả")
  const [selectedStatus, setSelectedStatus] = useState("Tất cả")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)
  const [showManageTypesModal, setShowManageTypesModal] = useState(false)
  const [reports, setReports] = useState([])
  const [stats, setStats] = useState(null)
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState(null)
  const [debugInfo, setDebugInfo] = useState(null)
  const [reportTypes, setReportTypes] = useState([
    'Tài chính',
    'Nhân sự', 
    'Dự án',
    'Bảo mật',
    'Kinh doanh',
    'Chất lượng'
  ])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [deletingReport, setDeletingReport] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Lấy dữ liệu từ API
  const fetchReports = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pagination.limit.toString(),
        ...(selectedType !== "Tất cả" && { type: selectedType }),
        ...(selectedDepartment !== "Tất cả" && { department: selectedDepartment }),
        ...(selectedStatus !== "Tất cả" && { status: selectedStatus }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/reports?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setReports(data.reports)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/reports/stats')
      const data = await response.json()
      
      if (response.ok) {
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchDepartments = async () => {
    try {
      console.log('Fetching departments...')
      const response = await fetch('/api/departments')
      const result = await response.json()
      console.log('Departments response:', response.status, result)
      
      if (response.ok && result.success) {
        console.log('Setting departments:', result.data)
        setDepartments(result.data || [])
      } else {
        console.error('Failed to fetch departments')
        setDepartments([])
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
      setDepartments([])
    }
  }

  useEffect(() => {
    fetchReports()
  }, [currentPage, selectedType, selectedDepartment, selectedStatus, startDate, endDate, searchTerm])

  useEffect(() => {
    fetchStats()
    fetchDepartments()
  }, [])

  const reportTypesWithStats = stats?.reportTypes ? [
    { name: "Tất cả", count: stats.reportTypes.reduce((sum, type) => sum + type.count, 0), color: "bg-gray-600" },
    ...stats.reportTypes.map(type => ({
      name: type.type,
      count: type.count,
      color: getTypeColorBg(type.type)
    }))
  ] : []

  function getTypeColorBg(type) {
    switch (type) {
      case "Tài chính": return "bg-green-600"
      case "Nhân sự": return "bg-blue-600"
      case "Dự án": return "bg-purple-600"
      case "Bảo mật": return "bg-red-600"
      case "Kinh doanh": return "bg-orange-600"
      case "Chất lượng": return "bg-cyan-600"
      default: return "bg-gray-600"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hoàn thành":
        return "bg-green-600"
      case "Đang xử lý":
        return "bg-blue-600"
      case "Chờ duyệt":
        return "bg-orange-600"
      case "Từ chối":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Tài chính":
        return "bg-green-500/10 text-green-300 border-green-500/30"
      case "Nhân sự":
        return "bg-blue-500/10 text-blue-300 border-blue-500/30"
      case "Dự án":
        return "bg-purple-500/10 text-purple-300 border-purple-500/30"
      case "Bảo mật":
        return "bg-red-500/10 text-red-300 border-red-500/30"
      case "Kinh doanh":
        return "bg-orange-500/10 text-orange-300 border-orange-500/30"
      default:
        return "bg-gray-500/10 text-gray-300 border-gray-500/30"
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleCreateReport = async (formData) => {
    try {
      console.log('Creating report with data:', formData)
      setDebugInfo(`Đang tạo báo cáo: ${formData.title}`)
      
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      console.log('API response:', result)
      setDebugInfo(`API Response: ${response.status} - ${JSON.stringify(result)}`)

      if (response.ok) {
        showNotification('Tạo báo cáo thành công!', 'success')
        setShowCreateModal(false)
        fetchReports()
        fetchStats()
        setDebugInfo(`✅ Báo cáo "${formData.title}" đã được tạo thành công với ID: ${result.report?.id}`)
      } else {
        console.error('API error:', result)
        showNotification('Lỗi: ' + (result.error || 'Không thể tạo báo cáo'), 'error')
        setDebugInfo(`❌ Lỗi tạo báo cáo: ${result.error}`)
      }
    } catch (error) {
      console.error('Error creating report:', error)
      showNotification('Lỗi kết nối: ' + error.message, 'error')
      setDebugInfo(`❌ Lỗi kết nối: ${error.message}`)
    }
  }

  const handleViewReport = (report) => {
    // Mở modal xem chi tiết báo cáo
    window.open(`/cms/reports/${report.id}`, '_blank')
  }

  const handleDownloadReport = async (report) => {
    try {
      const response = await fetch(`/api/reports/${report.id}/download`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        // Tạo link tải xuống
        const link = document.createElement('a')
        link.href = data.report.file_url
        link.download = `${report.title}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Cập nhật lại danh sách để hiển thị số lượt tải mới
        fetchReports()
      } else {
        const error = await response.json()
        alert('Lỗi: ' + error.error)
      }
    } catch (error) {
      console.error('Error downloading report:', error)
      alert('Lỗi khi tải xuống báo cáo')
    }
  }

  const handleAnalyzeReport = (report) => {
    // Mở trang phân tích báo cáo
    window.open(`/cms/reports/${report.id}/analyze`, '_blank')
  }

  const handleDelete = async () => {
    if (!deletingReport) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/reports/${deletingReport.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      
      if (result.success) {
        setDeletingReport(null)
        fetchReports()
        fetchStats()
        showNotification('Xóa báo cáo thành công!', 'success')
      } else {
        showNotification('Lỗi: ' + result.error, 'error')
      }
    } catch (error) {
      console.error('Error deleting report:', error)
      showNotification('Lỗi kết nối server', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const handleExportAll = async () => {
    try {
      // Tạo file CSV với danh sách báo cáo
      const csvContent = [
        ['Tiêu đề', 'Loại', 'Phòng ban', 'Người tạo', 'Trạng thái', 'Ngày tạo', 'Lượt tải'],
        ...reports.map(report => [
          report.title,
          report.type,
          report.department_name,
          report.created_by_name,
          report.status,
          new Date(report.created_at).toLocaleDateString('vi-VN'),
          report.download_count
        ])
      ].map(row => row.join(',')).join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `bao-cao-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error exporting reports:', error)
      alert('Lỗi khi xuất báo cáo')
    }
  }

  const clearFilters = () => {
    setSelectedType("Tất cả")
    setSelectedDepartment("Tất cả")
    setSelectedStatus("Tất cả")
    setStartDate("")
    setEndDate("")
    setSearchTerm("")
    setCurrentPage(1)
  }

  return (
    <InternalLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8">
          <Link href="/cms">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cổng Nội Bộ
            </Button>
          </Link>
          <span className="text-white/40">/</span>
          <span className="text-white">Báo Cáo</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Quản Lý Báo Cáo</h1>
            <p className="text-white/60">Tạo, quản lý và theo dõi các báo cáo của tổ chức</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo Báo Cáo Mới
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle>Tạo Báo Cáo Mới</DialogTitle>
                </DialogHeader>
                <CreateReportForm onSubmit={handleCreateReport} departments={departments} reportTypes={reportTypes} />
              </DialogContent>
            </Dialog>
            <Button
              onClick={async () => {
                const testData = {
                  title: `Test Report ${new Date().toLocaleTimeString()}`,
                  type: 'Tài chính',
                  department_id: 1,
                  description: 'Test report created directly',
                  created_by: 1
                }
                await handleCreateReport(testData)
              }}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
            >
              🧪 Test Tạo
            </Button>
            <Dialog open={showManageTypesModal} onOpenChange={setShowManageTypesModal}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-transparent border-2 border-green-500/50 text-white hover:bg-green-500/20"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Quản Lý Loại
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle>Quản Lý Loại Báo Cáo</DialogTitle>
                </DialogHeader>
                <ManageReportTypesForm reportTypes={reportTypes} setReportTypes={setReportTypes} />
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"
              onClick={handleExportAll}
            >
              <Download className="h-4 w-4 mr-2" />
              Xuất Tất Cả
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats && (
            <>
              <Card className="bg-black/50 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm font-medium">Tổng Báo Cáo</p>
                      <p className="text-2xl font-bold text-white mt-2">{stats.overview.totalReports.value}</p>
                      <div className="flex items-center mt-1">
                        {stats.overview.totalReports.change >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                        )}
                        <p className={`text-sm ${stats.overview.totalReports.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {stats.overview.totalReports.change >= 0 ? '+' : ''}{stats.overview.totalReports.change} từ tháng trước
                        </p>
                      </div>
                    </div>
                    <FileText className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm font-medium">Báo Cáo Tháng Này</p>
                      <p className="text-2xl font-bold text-white mt-2">{stats.overview.thisMonthReports.value}</p>
                      <div className="flex items-center mt-1">
                        {stats.overview.thisMonthReports.change >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                        )}
                        <p className={`text-sm ${stats.overview.thisMonthReports.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {stats.overview.thisMonthReports.change >= 0 ? '+' : ''}{stats.overview.thisMonthReports.change} từ tháng trước
                        </p>
                      </div>
                    </div>
                    <Calendar className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm font-medium">Lượt Tải Xuống</p>
                      <p className="text-2xl font-bold text-white mt-2">{stats.overview.totalDownloads.value.toLocaleString()}</p>
                      <div className="flex items-center mt-1">
                        {stats.overview.totalDownloads.change >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                        )}
                        <p className={`text-sm ${stats.overview.totalDownloads.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {stats.overview.totalDownloads.change >= 0 ? '+' : ''}{stats.overview.totalDownloads.change} từ tháng trước
                        </p>
                      </div>
                    </div>
                    <Download className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm font-medium">Đang Xử Lý</p>
                      <p className="text-2xl font-bold text-white mt-2">{stats.overview.processingReports.value}</p>
                      <div className="flex items-center mt-1">
                        {stats.overview.processingReports.change >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-orange-400 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-green-400 mr-1" />
                        )}
                        <p className={`text-sm ${stats.overview.processingReports.change >= 0 ? 'text-orange-400' : 'text-green-400'}`}>
                          {stats.overview.processingReports.change >= 0 ? '+' : ''}{stats.overview.processingReports.change} từ tháng trước
                        </p>
                      </div>
                    </div>
                    <Activity className="h-8 w-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Report Type Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Loại Báo Cáo</h3>
          <div className="flex flex-wrap gap-3">
            {reportTypesWithStats.map((type, index) => (
              <Button
                key={index}
                onClick={() => {
                  setSelectedType(type.name)
                  setCurrentPage(1)
                }}
                variant="outline"
                className={`${selectedType === type.name ? "bg-purple-500/20 border-purple-400 text-white" : "bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"}`}
              >
                {type.name}
                <Badge className={`ml-2 ${type.color} text-white`}>{type.count}</Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm báo cáo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/50 border-purple-500/30 text-white placeholder:text-white/60"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
              className={`${showAdvancedFilter ? "bg-purple-500/20 border-purple-400 text-white" : "bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"}`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Bộ Lọc Nâng Cao
            </Button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilter && (
            <Card className="bg-black/50 border-purple-500/30 mb-4">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-white/80 text-sm">Phòng Ban</Label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                        <SelectValue placeholder="Chọn phòng ban" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-purple-500/30">
                        <SelectItem value="Tất cả" className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20">Tất cả</SelectItem>
                        {departments && Array.isArray(departments) ? departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.name} className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20">
                            {dept.name}
                          </SelectItem>
                        )) : null}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white/80 text-sm">Trạng Thái</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-purple-500/30">
                        <SelectItem value="Tất cả" className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20">Tất cả</SelectItem>
                        <SelectItem value="Hoàn thành" className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20">Hoàn thành</SelectItem>
                        <SelectItem value="Đang xử lý" className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20">Đang xử lý</SelectItem>
                        <SelectItem value="Chờ duyệt" className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20">Chờ duyệt</SelectItem>
                        <SelectItem value="Từ chối" className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20">Từ chối</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white/80 text-sm">Từ Ngày</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-black/50 border-purple-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-white/80 text-sm">Đến Ngày</Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-black/50 border-purple-500/30 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4 space-x-2">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="bg-transparent border-2 border-gray-500/50 text-white hover:bg-gray-500/20"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Xóa Bộ Lọc
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.length > 0 ? (
              reports.map((report) => (
                <Card
                  key={report.id}
                  className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="grid lg:grid-cols-5 gap-6 items-center">
                      {/* Report Info */}
                      <div className="lg:col-span-2">
                        <h3 className="text-xl font-bold text-white mb-2">{report.title}</h3>
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge className={`${getTypeColor(report.type)} border`}>{report.type}</Badge>
                          <Badge className={`${getStatusColor(report.status)} text-white`}>{report.status}</Badge>
                        </div>
                        <div className="text-white/60 text-sm space-y-1">
                          <p>Phòng ban: {report.department_name || 'N/A'}</p>
                          <p>Tạo bởi: {report.created_by_name || 'N/A'}</p>
                          <p>Công ty: {report.company_name || 'N/A'}</p>
                        </div>
                        {report.description && (
                          <p className="text-white/80 text-sm mt-2 line-clamp-2">{report.description}</p>
                        )}
                      </div>

                      {/* Report Details */}
                      <div className="space-y-2">
                        <div>
                          <p className="text-white/60 text-sm">Ngày tạo</p>
                          <p className="text-white">{new Date(report.created_at).toLocaleDateString('vi-VN')}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Kích thước</p>
                          <p className="text-white">{report.file_size}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Cập nhật</p>
                          <p className="text-white">{new Date(report.updated_at).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="text-center">
                        <div className="bg-black/30 rounded-lg p-4">
                          <Download className="h-6 w-6 mx-auto text-purple-400 mb-2" />
                          <p className="text-2xl font-bold text-white">{report.download_count}</p>
                          <p className="text-white/60 text-sm">Lượt tải</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent border-2 border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                          onClick={() => handleViewReport(report)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Xem
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent border-2 border-green-500/50 text-green-300 hover:bg-green-500/20"
                          onClick={() => handleDownloadReport(report)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Tải Xuống
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                          onClick={() => handleAnalyzeReport(report)}
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Phân Tích
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent border-2 border-red-500/50 text-red-300 hover:bg-red-500/20"
                          onClick={() => setDeletingReport(report)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-white/40 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Không có báo cáo nào</h3>
                <p className="text-white/60">Chưa có báo cáo nào được tạo hoặc không khớp với bộ lọc hiện tại.</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20 disabled:opacity-50"
              >
                Trước
              </Button>

              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let page;
                if (pagination.totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= pagination.totalPages - 2) {
                  page = pagination.totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={
                      currentPage === page
                        ? "bg-purple-600 text-white"
                        : "bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"
                    }
                    variant={currentPage === page ? "default" : "outline"}
                  >
                    {page}
                  </Button>
                );
              })}

              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                variant="outline"
                className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20 disabled:opacity-50"
              >
                Sau
              </Button>
            </div>
          </div>
        )}

        {/* Quick Report Templates */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-white mb-6">Mẫu Báo Cáo Nhanh</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer hover:scale-105">
              <CardContent className="p-6 text-center">
                <DollarSign className="h-12 w-12 mx-auto text-green-400 mb-4" />
                <h4 className="text-white font-medium mb-2">Báo Cáo Tài Chính</h4>
                <p className="text-white/60 text-sm">Doanh thu, chi phí, lợi nhuận</p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer hover:scale-105">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 mx-auto text-blue-400 mb-4" />
                <h4 className="text-white font-medium mb-2">Báo Cáo Nhân Sự</h4>
                <p className="text-white/60 text-sm">Hiệu suất, chấm công, đánh giá</p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer hover:scale-105">
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 mx-auto text-purple-400 mb-4" />
                <h4 className="text-white font-medium mb-2">Báo Cáo Dự Án</h4>
                <p className="text-white/60 text-sm">Tiến độ, ngân sách, chất lượng</p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer hover:scale-105">
              <CardContent className="p-6 text-center">
                <PieChart className="h-12 w-12 mx-auto text-orange-400 mb-4" />
                <h4 className="text-white font-medium mb-2">Báo Cáo Tùy Chỉnh</h4>
                <p className="text-white/60 text-sm">Tạo báo cáo theo yêu cầu</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deletingReport} onOpenChange={() => setDeletingReport(null)}>
          <DialogContent className="bg-black/90 border-red-500/30 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                Xác Nhận Xóa Báo Cáo
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <p className="text-white/80">
                Bạn có chắc chắn muốn xóa báo cáo <span className="font-semibold text-red-400">{deletingReport?.title}</span> không?
              </p>
              <p className="text-sm text-red-400">
                ⚠️ Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan.
              </p>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setDeletingReport(null)}
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
                      Xóa Báo Cáo
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

// Component tạo báo cáo mới
function CreateReportForm({ onSubmit, departments, reportTypes }) {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    department_id: '',
    description: '',
    created_by: 1 // Tạm thời hardcode, sau này sẽ lấy từ user session
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tiêu đề báo cáo')
      return
    }
    if (!formData.type) {
      alert('Vui lòng chọn loại báo cáo')
      return
    }
    if (!formData.department_id) {
      alert('Vui lòng chọn phòng ban')
      return
    }
    
    setIsSubmitting(true)
    try {
      console.log('Form data before submit:', formData)
      await onSubmit(formData)
      // Reset form sau khi tạo thành công
      setFormData({
        title: '',
        type: '',
        department_id: '',
        description: '',
        created_by: 1
      })
    } catch (error) {
      console.error('Error in form submission:', error)
      alert('Lỗi khi gửi form: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-white/80">Tiêu đề báo cáo *</Label>
        <Input
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Nhập tiêu đề báo cáo"
          className="bg-black/50 border-purple-500/30 text-white placeholder:text-white/60"
          required
        />
      </div>

      <div>
        <Label className="text-white/80">Loại báo cáo *</Label>
        <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
          <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
            <SelectValue placeholder="Chọn loại báo cáo" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 border-purple-500/30">
            {reportTypes.map((type) => (
              <SelectItem key={type} value={type} className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-white/80">Phòng ban *</Label>
        <Select value={formData.department_id.toString()} onValueChange={(value) => handleChange('department_id', parseInt(value))}>
          <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
            <SelectValue placeholder="Chọn phòng ban" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 border-purple-500/30">
            {departments && Array.isArray(departments) && departments.length > 0 ? departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id.toString()} className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20">
                {dept.name}
              </SelectItem>
            )) : (
              <SelectItem value="" disabled className="text-white/60">
                {departments && departments.length === 0 ? 'Không có phòng ban' : 'Đang tải...'}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-white/80">Mô tả</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Mô tả chi tiết về báo cáo"
          className="bg-black/50 border-purple-500/30 text-white placeholder:text-white/60"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white disabled:opacity-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Đang tạo...' : 'Tạo Báo Cáo'}
        </Button>
      </div>
    </form>
  )
}

// Component quản lý loại báo cáo
function ManageReportTypesForm({ reportTypes, setReportTypes }) {
  const [newType, setNewType] = useState('')
  const [editingIndex, setEditingIndex] = useState(-1)
  const [editingValue, setEditingValue] = useState('')

  const handleAddType = () => {
    if (newType.trim() && !reportTypes.includes(newType.trim())) {
      setReportTypes([...reportTypes, newType.trim()])
      setNewType('')
    }
  }

  const handleDeleteType = (index) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa loại báo cáo này?')) {
      const newTypes = reportTypes.filter((_, i) => i !== index)
      setReportTypes(newTypes)
    }
  }

  const handleEditType = (index) => {
    setEditingIndex(index)
    setEditingValue(reportTypes[index])
  }

  const handleSaveEdit = () => {
    if (editingValue.trim() && !reportTypes.includes(editingValue.trim())) {
      const newTypes = [...reportTypes]
      newTypes[editingIndex] = editingValue.trim()
      setReportTypes(newTypes)
      setEditingIndex(-1)
      setEditingValue('')
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(-1)
    setEditingValue('')
  }

  return (
    <div className="space-y-4">
      {/* Thêm loại mới */}
      <div className="space-y-2">
        <Label className="text-white/80">Thêm loại báo cáo mới</Label>
        <div className="flex space-x-2">
          <Input
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            placeholder="Nhập tên loại báo cáo"
            className="bg-black/50 border-purple-500/30 text-white placeholder:text-white/60"
            onKeyPress={(e) => e.key === 'Enter' && handleAddType()}
          />
          <Button
            onClick={handleAddType}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={!newType.trim() || reportTypes.includes(newType.trim())}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Danh sách loại báo cáo */}
      <div className="space-y-2">
        <Label className="text-white/80">Danh sách loại báo cáo hiện tại</Label>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {reportTypes.map((type, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-black/30 rounded border border-purple-500/20">
              {editingIndex === index ? (
                <div className="flex items-center space-x-2 flex-1">
                  <Input
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="bg-black/50 border-purple-500/30 text-white text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                  />
                  <Button
                    onClick={handleSaveEdit}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={!editingValue.trim() || reportTypes.includes(editingValue.trim())}
                  >
                    ✓
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    size="sm"
                    variant="outline"
                    className="border-gray-500 text-gray-300 hover:bg-gray-500/20"
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <>
                  <span className="text-white text-sm">{type}</span>
                  <div className="flex items-center space-x-1">
                    <Button
                      onClick={() => handleEditType(index)}
                      size="sm"
                      variant="ghost"
                      className="text-blue-400 hover:bg-blue-500/20 h-6 w-6 p-0"
                    >
                      ✏️
                    </Button>
                    <Button
                      onClick={() => handleDeleteType(index)}
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:bg-red-500/20 h-6 w-6 p-0"
                    >
                      🗑️
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {reportTypes.length === 0 && (
        <div className="text-center py-4 text-white/60">
          Chưa có loại báo cáo nào. Hãy thêm loại báo cáo đầu tiên.
        </div>
      )}

      {/* Debug Panel */}
      {debugInfo && (
        <div className="fixed bottom-4 left-4 right-4 z-50 p-4 bg-black/90 border border-yellow-500/50 rounded-lg text-yellow-100 text-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <strong>Debug Info:</strong>
              <pre className="mt-1 whitespace-pre-wrap">{debugInfo}</pre>
            </div>
            <button 
              onClick={() => setDebugInfo(null)}
              className="ml-2 text-yellow-400 hover:text-yellow-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg border transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-900/90 border-green-500/50 text-green-100' 
            : 'bg-red-900/90 border-red-500/50 text-red-100'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white text-xs">✕</span>
              </div>
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}