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
  Share2,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

export default function ReportAnalyzePage() {
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
      }
    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      setLoading(false)
    }
  }

  // Dữ liệu mẫu cho phân tích
  const analysisData = {
    overview: {
      totalViews: Math.floor(Math.random() * 1000) + 500,
      avgRating: (Math.random() * 2 + 3).toFixed(1),
      completionRate: Math.floor(Math.random() * 30) + 70,
      shareCount: Math.floor(Math.random() * 50) + 10
    },
    trends: [
      { month: 'T1', views: 120, downloads: 45 },
      { month: 'T2', views: 150, downloads: 52 },
      { month: 'T3', views: 180, downloads: 67 },
      { month: 'T4', views: 220, downloads: 78 },
      { month: 'T5', views: 190, downloads: 65 },
      { month: 'T6', views: 250, downloads: 89 }
    ],
    demographics: [
      { department: 'Tài chính', percentage: 35, count: 45 },
      { department: 'Nhân sự', percentage: 25, count: 32 },
      { department: 'IT', percentage: 20, count: 26 },
      { department: 'Marketing', percentage: 15, count: 19 },
      { department: 'Khác', percentage: 5, count: 6 }
    ],
    performance: {
      readTime: '12 phút',
      bounceRate: '15%',
      engagement: '85%',
      satisfaction: '4.2/5'
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
            <BarChart3 className="h-16 w-16 mx-auto text-white/40 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Không tìm thấy báo cáo</h3>
            <p className="text-white/60 mb-4">Không thể phân tích báo cáo này.</p>
            <Link href="/internal/reports">
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
          <Link href="/internal/reports">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Báo Cáo
            </Button>
          </Link>
          <span className="text-white/40">/</span>
          <Link href={`/internal/reports/${reportId}`}>
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
              Chi Tiết
            </Button>
          </Link>
          <span className="text-white/40">/</span>
          <span className="text-white">Phân Tích</span>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Phân Tích Báo Cáo</h1>
            <p className="text-white/60">{report.title}</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <Button
              variant="outline"
              className="bg-transparent border-2 border-green-500/50 text-white hover:bg-green-500/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Xuất Phân Tích
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-2 border-blue-500/50 text-white hover:bg-blue-500/20"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Chia Sẻ
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-medium">Tổng Lượt Xem</p>
                  <p className="text-2xl font-bold text-white mt-2">{analysisData.overview.totalViews}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                    <p className="text-green-400 text-sm">+12% từ tháng trước</p>
                  </div>
                </div>
                <Activity className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-medium">Đánh Giá Trung Bình</p>
                  <p className="text-2xl font-bold text-white mt-2">{analysisData.overview.avgRating}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                    <p className="text-green-400 text-sm">+0.3 từ tháng trước</p>
                  </div>
                </div>
                <Target className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-medium">Tỷ Lệ Hoàn Thành</p>
                  <p className="text-2xl font-bold text-white mt-2">{analysisData.overview.completionRate}%</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                    <p className="text-green-400 text-sm">+5% từ tháng trước</p>
                  </div>
                </div>
                <PieChart className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-medium">Lượt Chia Sẻ</p>
                  <p className="text-2xl font-bold text-white mt-2">{analysisData.overview.shareCount}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                    <p className="text-green-400 text-sm">+8% từ tháng trước</p>
                  </div>
                </div>
                <Users className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Trend Chart */}
          <Card className="bg-black/50 border-purple-500/30">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">Xu Hướng Xem & Tải Xuống</h3>
              <div className="space-y-4">
                {analysisData.trends.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{item.month}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Tháng {item.month.slice(1)}</p>
                        <p className="text-white/60 text-sm">{item.views} lượt xem</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{item.downloads}</p>
                      <p className="text-white/60 text-sm">tải xuống</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Demographics */}
          <Card className="bg-black/50 border-purple-500/30">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">Phân Bố Theo Phòng Ban</h3>
              <div className="space-y-4">
                {analysisData.demographics.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{item.department}</span>
                      <span className="text-white/80">{item.percentage}% ({item.count})</span>
                    </div>
                    <div className="w-full bg-black/30 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="bg-black/50 border-purple-500/30 mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-6">Chỉ Số Hiệu Suất</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-black/30 rounded-lg">
                <Calendar className="h-8 w-8 mx-auto text-blue-400 mb-2" />
                <p className="text-2xl font-bold text-white">{analysisData.performance.readTime}</p>
                <p className="text-white/60 text-sm">Thời gian đọc TB</p>
              </div>
              <div className="text-center p-4 bg-black/30 rounded-lg">
                <TrendingDown className="h-8 w-8 mx-auto text-red-400 mb-2" />
                <p className="text-2xl font-bold text-white">{analysisData.performance.bounceRate}</p>
                <p className="text-white/60 text-sm">Tỷ lệ thoát</p>
              </div>
              <div className="text-center p-4 bg-black/30 rounded-lg">
                <Activity className="h-8 w-8 mx-auto text-green-400 mb-2" />
                <p className="text-2xl font-bold text-white">{analysisData.performance.engagement}</p>
                <p className="text-white/60 text-sm">Mức độ tương tác</p>
              </div>
              <div className="text-center p-4 bg-black/30 rounded-lg">
                <Target className="h-8 w-8 mx-auto text-purple-400 mb-2" />
                <p className="text-2xl font-bold text-white">{analysisData.performance.satisfaction}</p>
                <p className="text-white/60 text-sm">Mức độ hài lòng</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insights & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-black/50 border-purple-500/30">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Nhận Xét Chính</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white font-medium">Hiệu suất tốt</p>
                    <p className="text-white/60 text-sm">Báo cáo có tỷ lệ xem và tải xuống cao, cho thấy nội dung có giá trị.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white font-medium">Xu hướng tăng trưởng</p>
                    <p className="text-white/60 text-sm">Lượt xem tăng đều qua các tháng, đặc biệt mạnh trong 2 tháng gần đây.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white font-medium">Phân bố đều</p>
                    <p className="text-white/60 text-sm">Báo cáo được quan tâm bởi nhiều phòng ban khác nhau.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-purple-500/30">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Đề Xuất Cải Thiện</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white font-medium">Tối ưu nội dung</p>
                    <p className="text-white/60 text-sm">Thêm biểu đồ và hình ảnh để tăng tính trực quan.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white font-medium">Mở rộng phân phối</p>
                    <p className="text-white/60 text-sm">Chia sẻ báo cáo đến các phòng ban ít tương tác.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white font-medium">Cập nhật định kỳ</p>
                    <p className="text-white/60 text-sm">Tạo phiên bản cập nhật hàng quý để duy trì sự quan tâm.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </InternalLayout>
  )
}