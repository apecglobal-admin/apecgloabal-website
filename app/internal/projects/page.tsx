"use client"

import InternalLayout from "@/components/internal-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
} from "lucide-react"
import { useState } from "react"

export default function InternalProjectsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("Tất cả")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const projects = [
    {
      id: 1,
      name: "AI Education Platform",
      description: "Nền tảng học tập thông minh với AI cá nhân hóa",
      company: "ApecTech",
      manager: "Nguyễn Văn A",
      team: 12,
      progress: 85,
      status: "Đang phát triển",
      priority: "Cao",
      startDate: "01/03/2024",
      endDate: "15/01/2025",
      budget: "500,000 USD",
      spent: "425,000 USD",
    },
    {
      id: 2,
      name: "Smart Security System",
      description: "Hệ thống bảo mật IoT với AI detection",
      company: "GuardCam",
      manager: "Trần Thị B",
      team: 8,
      progress: 92,
      status: "Beta Testing",
      priority: "Cao",
      startDate: "15/06/2023",
      endDate: "10/01/2025",
      budget: "300,000 USD",
      spent: "276,000 USD",
    },
    {
      id: 3,
      name: "Emotion Analytics Engine",
      description: "Công cụ phân tích cảm xúc khách hàng real-time",
      company: "EmoCommerce",
      manager: "Lê Văn C",
      team: 6,
      progress: 100,
      status: "Hoàn thành",
      priority: "Trung bình",
      startDate: "01/09/2023",
      endDate: "30/11/2024",
      budget: "200,000 USD",
      spent: "195,000 USD",
    },
    {
      id: 4,
      name: "Behavioral Analytics Dashboard",
      description: "Dashboard phân tích hành vi người dùng",
      company: "TimeLoop",
      manager: "Phạm Thị D",
      team: 5,
      progress: 60,
      status: "Đang phát triển",
      priority: "Trung bình",
      startDate: "01/10/2024",
      endDate: "30/03/2025",
      budget: "150,000 USD",
      spent: "90,000 USD",
    },
    {
      id: 5,
      name: "ApecNeuroOS Core",
      description: "Nhân hệ điều hành doanh nghiệp thông minh",
      company: "ApecNeuroOS",
      manager: "Hoàng Văn E",
      team: 15,
      progress: 30,
      status: "Nghiên cứu",
      priority: "Cao",
      startDate: "01/01/2024",
      endDate: "31/12/2024",
      budget: "800,000 USD",
      spent: "240,000 USD",
    },
  ]

  const stats = [
    {
      title: "Tổng Dự Án",
      value: "25",
      change: "+3",
      icon: Target,
      color: "text-purple-400",
    },
    {
      title: "Đang Triển Khai",
      value: "15",
      change: "+2",
      icon: TrendingUp,
      color: "text-blue-400",
    },
    {
      title: "Hoàn Thành",
      value: "8",
      change: "+1",
      icon: CheckCircle,
      color: "text-green-400",
    },
    {
      title: "Ngân Sách",
      value: "2.5M USD",
      change: "+15%",
      icon: BarChart3,
      color: "text-orange-400",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hoàn thành":
        return "bg-green-600"
      case "Beta Testing":
        return "bg-blue-600"
      case "Đang phát triển":
        return "bg-orange-600"
      case "Nghiên cứu":
        return "bg-purple-600"
      case "Tạm dừng":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Cao":
        return "bg-red-500/10 text-red-300 border-red-500/30"
      case "Trung bình":
        return "bg-orange-500/10 text-orange-300 border-orange-500/30"
      case "Thấp":
        return "bg-green-500/10 text-green-300 border-green-500/30"
      default:
        return "bg-gray-500/10 text-gray-300 border-gray-500/30"
    }
  }

  const getCompanyColor = (company: string) => {
    switch (company) {
      case "ApecTech":
        return "bg-blue-500/10 text-blue-300 border-blue-500/30"
      case "GuardCam":
        return "bg-green-500/10 text-green-300 border-green-500/30"
      case "EmoCommerce":
        return "bg-pink-500/10 text-pink-300 border-pink-500/30"
      case "TimeLoop":
        return "bg-orange-500/10 text-orange-300 border-orange-500/30"
      case "ApecNeuroOS":
        return "bg-purple-500/10 text-purple-300 border-purple-500/30"
      default:
        return "bg-gray-500/10 text-gray-300 border-gray-500/30"
    }
  }

  const handleCreateProject = () => {
    setShowCreateModal(true)
  }

  const handleViewProject = (project) => {
    alert(`Xem chi tiết dự án: ${project.name}`)
  }

  const handleEditProject = (project) => {
    alert(`Chỉnh sửa dự án: ${project.name}`)
  }

  const handleProjectReport = (project) => {
    alert(`Báo cáo dự án: ${project.name}`)
  }

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.manager.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "Tất cả" || project.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  // Pagination
  const itemsPerPage = 3
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage)

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
              placeholder="Tìm kiếm dự án theo tên, công ty, quản lý..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder:text-white/50"
            />
          </div>
          <Button
            variant="outline"
            className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"
          >
            <Filter className="h-4 w-4 mr-2" />
            Bộ Lọc
          </Button>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          {paginatedProjects.map((project) => (
            <Card
              key={project.id}
              className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-4 gap-6">
                  {/* Project Info */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{project.name}</h3>
                        <Badge className={`${getCompanyColor(project.company)} border`}>{project.company}</Badge>
                      </div>
                      <p className="text-white/80 mb-3">{project.description}</p>
                      <div className="flex items-center space-x-4 text-white/60 text-sm">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {project.manager}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {project.team} thành viên
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                      <Badge className={`${getPriorityColor(project.priority)} border`}>{project.priority}</Badge>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Tiến độ</span>
                        <span className="text-white">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
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
                          <span>Bắt đầu: {project.startDate}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-red-400" />
                          <span>Kết thúc: {project.endDate}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-white/60 text-sm mb-1">Ngân sách</p>
                      <div className="text-white text-sm space-y-1">
                        <p>Tổng: {project.budget}</p>
                        <p>Đã chi: {project.spent}</p>
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

        {/* Quick Actions */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-white mb-6">Thao Tác Nhanh</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer hover:scale-105">
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
      </div>
    </InternalLayout>
  )
}
