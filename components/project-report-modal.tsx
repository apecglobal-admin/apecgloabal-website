"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Download,
  Users,
  DollarSign,
  Target,
  Clock,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

interface ProjectReport {
  id: number
  name: string
  company_name: string
  company_logo: string
  status: string
  progress: number
  start_date: string
  end_date: string
  budget: number
  spent_budget: number
  team_size: number
  total_tasks: number
  completed_tasks: number
  in_progress_tasks: number
  pending_tasks: number
  overdue_tasks: number
  total_hours_estimated: number
  total_hours_actual: number
  milestones_total: number
  milestones_completed: number
  client_name: string
  manager_name: string
}

interface ProjectReportModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: number | null
}

export function ProjectReportModal({ isOpen, onClose, projectId }: ProjectReportModalProps) {
  const [report, setReport] = useState<ProjectReport | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && projectId) {
      fetchProjectReport()
    }
  }, [isOpen, projectId])

  const fetchProjectReport = async () => {
    if (!projectId) return
    
    setLoading(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '/api'
      const response = await fetch(`${baseUrl}/projects/${projectId}/report`)
      const result = await response.json()
      if (result.success) {
        setReport(result.data)
      } else {
        toast.error('Không thể tải báo cáo dự án')
      }
    } catch (error) {
      console.error('Error fetching project report:', error)
      toast.error('Không thể tải báo cáo dự án')
    } finally {
      setLoading(false)
    }
  }

  const handleExportReport = () => {
    toast.info('Chức năng xuất báo cáo sẽ được cập nhật sau')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600/20 text-green-400 border-green-500/30'
      case 'in_progress':
        return 'bg-blue-600/20 text-blue-400 border-blue-500/30'
      case 'on_hold':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30'
      case 'cancelled':
        return 'bg-red-600/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planning':
        return 'Lên kế hoạch'
      case 'in_progress':
        return 'Đang thực hiện'
      case 'on_hold':
        return 'Tạm dừng'
      case 'completed':
        return 'Hoàn thành'
      case 'cancelled':
        return 'Đã hủy'
      default:
        return status
    }
  }

  const calculateBudgetUsage = () => {
    if (!report || !report.budget) return 0
    return Math.round((report.spent_budget / report.budget) * 100)
  }

  const calculateTaskCompletion = () => {
    if (!report || !report.total_tasks) return 0
    return Math.round((report.completed_tasks / report.total_tasks) * 100)
  }

  const calculateTimeEfficiency = () => {
    if (!report || !report.total_hours_estimated) return 0
    return Math.round((report.total_hours_actual / report.total_hours_estimated) * 100)
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border-purple-500/30 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">
              Báo Cáo Dự Án: {report?.name}
            </DialogTitle>
            <Button
              onClick={handleExportReport}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Xuất Báo Cáo
            </Button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <span className="ml-2 text-white">Đang tải báo cáo...</span>
          </div>
        ) : report ? (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-black/50 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Trạng thái</p>
                      <Badge className={getStatusColor(report.status)}>
                        {getStatusText(report.status)}
                      </Badge>
                    </div>
                    <Target className="h-6 w-6 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Tiến độ</p>
                      <p className="text-xl font-bold text-white">{report.progress}%</p>
                    </div>
                    <TrendingUp className="h-6 w-6 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Ngân sách</p>
                      <p className="text-lg font-bold text-white">{calculateBudgetUsage()}%</p>
                    </div>
                    <DollarSign className="h-6 w-6 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-orange-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Đội ngũ</p>
                      <p className="text-xl font-bold text-white">{report.team_size}</p>
                    </div>
                    <Users className="h-6 w-6 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Task Progress */}
              <Card className="bg-black/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-lg">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Tiến Độ Công Việc
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Hoàn thành</span>
                      <span className="text-white">{report.completed_tasks}/{report.total_tasks}</span>
                    </div>
                    <Progress value={calculateTaskCompletion()} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-white/80">Hoàn thành: {report.completed_tasks}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-white/80">Đang làm: {report.in_progress_tasks}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="text-white/80">Chờ: {report.pending_tasks}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-white/80">Quá hạn: {report.overdue_tasks}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Time Tracking */}
              <Card className="bg-black/50 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-lg">
                    <Clock className="h-5 w-5 mr-2" />
                    Theo Dõi Thời Gian
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Hiệu suất thời gian</span>
                      <span className="text-white">{calculateTimeEfficiency()}%</span>
                    </div>
                    <Progress value={calculateTimeEfficiency()} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Ước tính:</span>
                      <span className="text-white">{report.total_hours_estimated}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Thực tế:</span>
                      <span className="text-white">{report.total_hours_actual}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Chênh lệch:</span>
                      <span className={report.total_hours_actual > report.total_hours_estimated ? "text-red-400" : "text-green-400"}>
                        {report.total_hours_actual > report.total_hours_estimated ? '+' : ''}
                        {report.total_hours_actual - report.total_hours_estimated}h
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Info */}
              <Card className="bg-black/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Thông Tin Dự Án</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-white/60">Công ty:</p>
                      <p className="text-white">{report.company_name}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Quản lý:</p>
                      <p className="text-white">{report.manager_name || 'Chưa phân công'}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Khách hàng:</p>
                      <p className="text-white">{report.client_name || 'Chưa xác định'}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Ngân sách:</p>
                      <p className="text-white">
                        {(report.budget / 1000000).toFixed(1)}M VND
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60">Bắt đầu:</p>
                      <p className="text-white">
                        {report.start_date ? new Date(report.start_date).toLocaleDateString('vi-VN') : 'Chưa xác định'}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60">Kết thúc:</p>
                      <p className="text-white">
                        {report.end_date ? new Date(report.end_date).toLocaleDateString('vi-VN') : 'Chưa xác định'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Indicators */}
              <Card className="bg-black/50 border-orange-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Chỉ Số Hiệu Suất
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        {calculateTaskCompletion()}%
                      </div>
                      <p className="text-white/60 text-sm">Hoàn thành công việc</p>
                      <div className="mt-1">
                        {calculateTaskCompletion() >= 80 ? (
                          <Badge className="bg-green-600/20 text-green-400 text-xs">Xuất sắc</Badge>
                        ) : calculateTaskCompletion() >= 60 ? (
                          <Badge className="bg-yellow-600/20 text-yellow-400 text-xs">Tốt</Badge>
                        ) : (
                          <Badge className="bg-red-600/20 text-red-400 text-xs">Cần cải thiện</Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">
                        {calculateBudgetUsage()}%
                      </div>
                      <p className="text-white/60 text-sm">Sử dụng ngân sách</p>
                      <div className="mt-1">
                        {calculateBudgetUsage() <= 80 ? (
                          <Badge className="bg-green-600/20 text-green-400 text-xs">Tiết kiệm</Badge>
                        ) : calculateBudgetUsage() <= 100 ? (
                          <Badge className="bg-yellow-600/20 text-yellow-400 text-xs">Đúng kế hoạch</Badge>
                        ) : (
                          <Badge className="bg-red-600/20 text-red-400 text-xs">Vượt ngân sách</Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400 mb-1">
                        {calculateTimeEfficiency()}%
                      </div>
                      <p className="text-white/60 text-sm">Hiệu suất thời gian</p>
                      <div className="mt-1">
                        {calculateTimeEfficiency() <= 100 ? (
                          <Badge className="bg-green-600/20 text-green-400 text-xs">Đúng hạn</Badge>
                        ) : calculateTimeEfficiency() <= 120 ? (
                          <Badge className="bg-yellow-600/20 text-yellow-400 text-xs">Chấp nhận được</Badge>
                        ) : (
                          <Badge className="bg-red-600/20 text-red-400 text-xs">Chậm tiến độ</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Milestones Progress */}
            <Card className="bg-black/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Tiến Độ Cột Mốc</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Cột mốc hoàn thành</span>
                    <span className="text-white font-bold">
                      {report.milestones_completed}/{report.milestones_total}
                    </span>
                  </div>
                  <Progress 
                    value={report.milestones_total ? (report.milestones_completed / report.milestones_total) * 100 : 0} 
                    className="h-3" 
                  />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">
                      {report.milestones_total ? Math.round((report.milestones_completed / report.milestones_total) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-white/60">Không thể tải báo cáo dự án</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}