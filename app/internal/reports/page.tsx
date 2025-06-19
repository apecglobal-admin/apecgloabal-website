"use client"

import InternalLayout from "@/components/internal-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import { useState } from "react"

export default function ReportsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("Tất cả")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const reports = [
    {
      id: 1,
      title: "Báo Cáo Doanh Thu Q4 2024",
      type: "Tài chính",
      department: "ApecGlobal",
      createdBy: "Nguyễn Văn A",
      createdDate: "15/12/2024",
      status: "Hoàn thành",
      size: "2.4 MB",
      downloads: 45,
    },
    {
      id: 2,
      title: "Phân Tích Hiệu Suất Nhân Viên",
      type: "Nhân sự",
      department: "HR",
      createdBy: "Trần Thị B",
      createdDate: "12/12/2024",
      status: "Đang xử lý",
      size: "1.8 MB",
      downloads: 23,
    },
    {
      id: 3,
      title: "Báo Cáo Bảo Mật Hệ Thống",
      type: "Bảo mật",
      department: "GuardCam",
      createdBy: "Lê Văn C",
      createdDate: "10/12/2024",
      status: "Hoàn thành",
      size: "3.2 MB",
      downloads: 67,
    },
    {
      id: 4,
      title: "Thống Kê Dự Án ApecTech",
      type: "Dự án",
      department: "ApecTech",
      createdBy: "Phạm Thị D",
      createdDate: "08/12/2024",
      status: "Chờ duyệt",
      size: "1.5 MB",
      downloads: 12,
    },
    {
      id: 5,
      title: "Phân Tích Khách Hàng EmoCommerce",
      type: "Kinh doanh",
      department: "EmoCommerce",
      createdBy: "Hoàng Văn E",
      createdDate: "05/12/2024",
      status: "Hoàn thành",
      size: "2.1 MB",
      downloads: 34,
    },
  ]

  const stats = [
    {
      title: "Tổng Báo Cáo",
      value: "156",
      change: "+12",
      icon: FileText,
      color: "text-blue-400",
    },
    {
      title: "Báo Cáo Tháng Này",
      value: "23",
      change: "+8",
      icon: Calendar,
      color: "text-green-400",
    },
    {
      title: "Lượt Tải Xuống",
      value: "1,234",
      change: "+156",
      icon: Download,
      color: "text-purple-400",
    },
    {
      title: "Đang Xử Lý",
      value: "8",
      change: "-2",
      icon: Activity,
      color: "text-orange-400",
    },
  ]

  const reportTypes = [
    { name: "Tất cả", count: reports.length, color: "bg-gray-600" },
    { name: "Tài chính", count: 45, color: "bg-green-600" },
    { name: "Nhân sự", count: 32, color: "bg-blue-600" },
    { name: "Dự án", count: 28, color: "bg-purple-600" },
    { name: "Bảo mật", count: 15, color: "bg-red-600" },
    { name: "Kinh doanh", count: 36, color: "bg-orange-600" },
  ]

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

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "Tất cả" || report.type === selectedType
    return matchesSearch && matchesType
  })

  // Pagination
  const itemsPerPage = 3
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage)

  const handleCreateReport = () => {
    setShowCreateModal(true)
  }

  const handleViewReport = (report) => {
    alert(`Xem báo cáo: ${report.title}`)
  }

  const handleDownloadReport = (report) => {
    alert(`Tải xuống: ${report.title}`)
  }

  const handleAnalyzeReport = (report) => {
    alert(`Phân tích báo cáo: ${report.title}`)
  }

  return (
    <InternalLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8">
          <Link href="/internal">
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
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
              onClick={handleCreateReport}
            >
              <FileText className="h-4 w-4 mr-2" />
              Tạo Báo Cáo Mới
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Xuất Tất Cả
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

        {/* Report Type Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Loại Báo Cáo</h3>
          <div className="flex flex-wrap gap-3">
            {reportTypes.map((type, index) => (
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

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            variant="outline"
            className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"
          >
            <Filter className="h-4 w-4 mr-2" />
            Bộ Lọc Nâng Cao
          </Button>
          <Button
            variant="outline"
            className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Theo Thời Gian
          </Button>
          <Button
            variant="outline"
            className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"
          >
            <Users className="h-4 w-4 mr-2" />
            Theo Phòng Ban
          </Button>
        </div>

        {/* Reports List */}
        <div className="space-y-6">
          {paginatedReports.map((report) => (
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
                      <p>Phòng ban: {report.department}</p>
                      <p>Tạo bởi: {report.createdBy}</p>
                    </div>
                  </div>

                  {/* Report Details */}
                  <div className="space-y-2">
                    <div>
                      <p className="text-white/60 text-sm">Ngày tạo</p>
                      <p className="text-white">{report.createdDate}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Kích thước</p>
                      <p className="text-white">{report.size}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-center">
                    <div className="bg-black/30 rounded-lg p-4">
                      <Download className="h-6 w-6 mx-auto text-purple-400 mb-2" />
                      <p className="text-2xl font-bold text-white">{report.downloads}</p>
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
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

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              ))}

              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
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
      </div>
    </InternalLayout>
  )
}
