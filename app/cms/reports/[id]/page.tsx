"use client"

import InternalLayout from "@/components/cms-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  ArrowLeft,
  Download,
  BarChart3,
  FileText,
  Calendar,
  User,
  Building2,
  Eye,
  Share2,
  Edit,
  Trash2,
  TrendingUp,
  Activity,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

export default function ReportDetailPage() {
  const params = useParams()
  const reportId = params.id
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReportDetail()
  }, [reportId])

  const fetchReportDetail = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reports/${reportId}`)
      const data = await response.json()
      
      if (response.ok) {
        setReport(data.report)
      } else {
        console.error('Error fetching report:', data.error)
      }
    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/reports/${reportId}/download`, {
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
        
        // Cập nhật số lượt tải
        setReport(prev => ({
          ...prev,
          download_count: data.report.download_count
        }))
      }
    } catch (error) {
      console.error('Error downloading report:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Hoàn thành": return "bg-green-600"
      case "Đang xử lý": return "bg-blue-600"
      case "Chờ duyệt": return "bg-orange-600"
      case "Từ chối": return "bg-red-600"
      default: return "bg-gray-600"
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "Tài chính": return "bg-green-500/10 text-green-300 border-green-500/30"
      case "Nhân sự": return "bg-blue-500/10 text-blue-300 border-blue-500/30"
      case "Dự án": return "bg-purple-500/10 text-purple-300 border-purple-500/30"
      case "Bảo mật": return "bg-red-500/10 text-red-300 border-red-500/30"
      case "Kinh doanh": return "bg-orange-500/10 text-orange-300 border-orange-500/30"
      case "Chất lượng": return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
      default: return "bg-gray-500/10 text-gray-300 border-gray-500/30"
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

  if (!report) {
    return (
      <InternalLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-white/40 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Không tìm thấy báo cáo</h3>
            <p className="text-white/60 mb-4">Báo cáo không tồn tại hoặc đã bị xóa.</p>
            <Link href="/cms/reports">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại danh sách
              </Button>
            </Link>
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
          <Link href="/cms/reports">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Báo Cáo
            </Button>
          </Link>
          <span className="text-white/40">/</span>
          <span className="text-white">Chi Tiết</span>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{report.title}</h1>
            <div className="flex items-center space-x-3 mb-4">
              <Badge className={`${getTypeColor(report.type)} border`}>{report.type}</Badge>
              <Badge className={`${getStatusColor(report.status)} text-white`}>{report.status}</Badge>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Button
              onClick={handleDownload}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Tải Xuống
            </Button>
            <Link href={`/cms/reports/${reportId}/analyze`}>
              <Button
                variant="outline"
                className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Phân Tích
              </Button>
            </Link>
            <Button
              variant="outline"
              className="bg-transparent border-2 border-blue-500/50 text-white hover:bg-blue-500/20"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Chia Sẻ
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Info */}
            <Card className="bg-black/50 border-purple-500/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Thông Tin Báo Cáo</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/60 text-sm">Phòng ban</p>
                      <p className="text-white font-medium">{report.department_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Công ty</p>
                      <p className="text-white font-medium">{report.company_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Người tạo</p>
                      <p className="text-white font-medium">{report.created_by_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Email liên hệ</p>
                      <p className="text-white font-medium">{report.created_by_email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Ngày tạo</p>
                      <p className="text-white font-medium">{new Date(report.created_at).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Cập nhật lần cuối</p>
                      <p className="text-white font-medium">{new Date(report.updated_at).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                  
                  {report.description && (
                    <div>
                      <p className="text-white/60 text-sm mb-2">Mô tả</p>
                      <p className="text-white/80 leading-relaxed">{report.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Report Preview */}
            <Card className="bg-black/50 border-purple-500/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Xem Trước Báo Cáo</h3>
                <div className="bg-black/30 rounded-lg p-8 text-center">
                  <FileText className="h-16 w-16 mx-auto text-purple-400 mb-4" />
                  <p className="text-white/60 mb-4">
                    Tính năng xem trước báo cáo sẽ được triển khai trong phiên bản tiếp theo
                  </p>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Tải xuống để xem
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="bg-black/50 border-purple-500/30">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Thống Kê</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Download className="h-4 w-4 text-purple-400" />
                      <span className="text-white/80">Lượt tải xuống</span>
                    </div>
                    <span className="text-white font-bold">{report.download_count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-blue-400" />
                      <span className="text-white/80">Lượt xem</span>
                    </div>
                    <span className="text-white font-bold">{Math.floor(report.download_count * 2.5)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-green-400" />
                      <span className="text-white/80">Kích thước</span>
                    </div>
                    <span className="text-white font-bold">{report.file_size}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-black/50 border-purple-500/30">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Thao Tác Nhanh</h3>
                <div className="space-y-3">
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Tải Xuống PDF
                  </Button>
                  <Link href={`/cms/reports/${reportId}/analyze`} className="block">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Phân Tích Chi Tiết
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-2 border-blue-500/50 text-white hover:bg-blue-500/20"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Chia Sẻ Báo Cáo
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-2 border-orange-500/50 text-white hover:bg-orange-500/20"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh Sửa
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Related Reports */}
            <Card className="bg-black/50 border-purple-500/30">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Báo Cáo Liên Quan</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-black/30 rounded-lg">
                    <p className="text-white font-medium text-sm">Báo Cáo Tài Chính Q3</p>
                    <p className="text-white/60 text-xs">Cùng loại • 2 tháng trước</p>
                  </div>
                  <div className="p-3 bg-black/30 rounded-lg">
                    <p className="text-white font-medium text-sm">Phân Tích Doanh Thu</p>
                    <p className="text-white/60 text-xs">Cùng phòng ban • 1 tháng trước</p>
                  </div>
                  <div className="p-3 bg-black/30 rounded-lg">
                    <p className="text-white font-medium text-sm">Báo Cáo Hiệu Suất</p>
                    <p className="text-white/60 text-xs">Cùng người tạo • 3 tuần trước</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </InternalLayout>
  )
}