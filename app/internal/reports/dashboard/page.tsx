"use client"

import InternalLayout from "@/components/internal-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  ArrowLeft,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Calendar,
  Target,
  Download,
  FileText,
  Building2,
  Eye,
} from "lucide-react"
import { useState, useEffect } from "react"

export default function ReportsDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/reports/stats')
      const data = await response.json()
      
      if (response.ok) {
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <InternalLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </InternalLayout>
    )
  }

  return (
    <InternalLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8">
          <Link href="/internal/reports">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Báo Cáo
            </Button>
          </Link>
          <span className="text-white/40">/</span>
          <span className="text-white">Tổng Quan</span>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Tổng Quan Báo Cáo</h1>
            <p className="text-white/60">Phân tích và thống kê chi tiết về hệ thống báo cáo</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Link href="/internal/reports">
              <Button
                variant="outline"
                className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"
              >
                <FileText className="h-4 w-4 mr-2" />
                Danh Sách Báo Cáo
              </Button>
            </Link>
          </div>
        </div>

        {stats && (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Report Types Chart */}
              <Card className="bg-black/50 border-purple-500/30">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Phân Bố Theo Loại Báo Cáo</h3>
                  <div className="space-y-4">
                    {stats.reportTypes.map((type, index) => {
                      const total = stats.reportTypes.reduce((sum, t) => sum + parseInt(t.count), 0)
                      const percentage = total > 0 ? Math.round((parseInt(type.count) / total) * 100) : 0
                      
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium">{type.type}</span>
                            <span className="text-white/80">{percentage}% ({type.count})</span>
                          </div>
                          <div className="w-full bg-black/30 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Department Stats */}
              <Card className="bg-black/50 border-purple-500/30">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Thống Kê Theo Phòng Ban</h3>
                  <div className="space-y-4">
                    {stats.departments.slice(0, 6).map((dept, index) => {
                      const count = parseInt(dept.count)
                      if (count === 0) return null
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Building2 className="h-5 w-5 text-blue-400" />
                            <span className="text-white font-medium">{dept.name}</span>
                          </div>
                          <Badge className="bg-purple-600 text-white">{count}</Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Top Downloaded Reports */}
              <Card className="bg-black/50 border-purple-500/30">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Báo Cáo Được Tải Nhiều Nhất</h3>
                  <div className="space-y-4">
                    {stats.topDownloaded.slice(0, 5).map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm line-clamp-1">{report.title}</p>
                          <p className="text-white/60 text-xs">{report.department_name}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Download className="h-4 w-4 text-purple-400" />
                          <span className="text-white font-bold">{report.download_count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Trend */}
              <Card className="bg-black/50 border-purple-500/30">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Xu Hướng Theo Tháng</h3>
                  <div className="space-y-4">
                    {stats.trend.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {new Date(item.month + '-01').toLocaleDateString('vi-VN', { month: 'short' })}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {new Date(item.month + '-01').toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                            </p>
                            <p className="text-white/60 text-sm">{item.count} báo cáo</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <BarChart3 className="h-5 w-5 text-purple-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Overview */}
            <Card className="bg-black/50 border-purple-500/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-6">Tình Trạng Báo Cáo</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {stats.statuses.map((status, index) => {
                    const getStatusInfo = (statusName) => {
                      switch (statusName) {
                        case 'approved':
                          return { label: 'Đã Duyệt', color: 'text-green-400', bg: 'bg-green-500/10', icon: Target }
                        case 'Đang xử lý':
                          return { label: 'Đang Xử Lý', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Activity }
                        case 'Chờ duyệt':
                          return { label: 'Chờ Duyệt', color: 'text-orange-400', bg: 'bg-orange-500/10', icon: Calendar }
                        case 'Từ chối':
                          return { label: 'Từ Chối', color: 'text-red-400', bg: 'bg-red-500/10', icon: TrendingDown }
                        default:
                          return { label: statusName, color: 'text-gray-400', bg: 'bg-gray-500/10', icon: FileText }
                      }
                    }

                    const statusInfo = getStatusInfo(status.status)
                    const IconComponent = statusInfo.icon

                    return (
                      <div key={index} className={`p-6 ${statusInfo.bg} rounded-lg text-center`}>
                        <IconComponent className={`h-8 w-8 mx-auto ${statusInfo.color} mb-2`} />
                        <p className="text-2xl font-bold text-white">{status.count}</p>
                        <p className={`text-sm ${statusInfo.color}`}>{statusInfo.label}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </InternalLayout>
  )
}