"use client"

import { useState, useEffect } from "react"
import InternalLayout from "@/components/internal-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Building2, Users, Briefcase, Settings, BarChart3, RefreshCw, AlertCircle } from "lucide-react"
import { toast } from "sonner"

function CompaniesAdminContent() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/companies')
      if (!response.ok) throw new Error('Failed to fetch companies')
      const result = await response.json()
      setCompanies(result.data || [])
    } catch (error) {
      console.error('Error fetching companies:', error)
      toast.error('Không thể tải danh sách công ty')
    } finally {
      setLoading(false)
    }
  }

  const updateDatabase = async () => {
    try {
      setUpdating(true)
      const response = await fetch('/api/admin/update-companies-db', {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to update database')
      const result = await response.json()
      
      if (result.success) {
        toast.success('Database đã được cập nhật thành công!')
        fetchCompanies() // Refresh data
      } else {
        throw new Error(result.error || 'Update failed')
      }
    } catch (error) {
      console.error('Error updating database:', error)
      toast.error('Không thể cập nhật database')
    } finally {
      setUpdating(false)
    }
  }

  const updateCompanyStats = async (companyId: number) => {
    try {
      const response = await fetch(`/api/companies/stats?company_id=${companyId}`, {
        method: 'PUT'
      })
      if (!response.ok) throw new Error('Failed to update stats')
      const result = await response.json()
      
      if (result.success) {
        toast.success('Thống kê công ty đã được cập nhật!')
        fetchCompanies() // Refresh data
      }
    } catch (error) {
      console.error('Error updating company stats:', error)
      toast.error('Không thể cập nhật thống kê')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Quản Lý Database Công Ty
          </h1>
          <p className="text-white/80">Cập nhật và quản lý cơ sở dữ liệu công ty</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={updateDatabase}
            disabled={updating}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {updating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Cập nhật Database
              </>
            )}
          </Button>
          <Button
            onClick={fetchCompanies}
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company: any) => (
          <Card key={company.id} className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                    {company.logo_url ? (
                      <img
                        src={company.logo_url}
                        alt={`${company.name} logo`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Building2 className="h-6 w-6 text-white/60" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{company.name}</CardTitle>
                    <p className="text-white/60 text-sm">{company.slug}</p>
                  </div>
                </div>
                <Badge 
                  className={company.is_featured 
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' 
                    : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                  }
                >
                  {company.is_featured ? 'Nổi bật' : 'Bình thường'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-white/80 text-sm">
                <p className="mb-2">{company.short_description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span>Thứ tự hiển thị: {company.display_order}</span>
                  <span>Nhân viên: {company.employee_count}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Trạng thái</span>
                  <Badge className={company.status === 'active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                  }>
                    {company.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Dự án</span>
                  <span className="text-white">{company.projects_count || 0}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Dịch vụ</span>
                  <span className="text-white">{company.services_count || 0}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Phòng ban</span>
                  <span className="text-white">{company.departments_count || 0}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => updateCompanyStats(company.id)}
                  size="sm"
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 flex-1"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Cập nhật thống kê
                </Button>
                <Button
                  onClick={() => window.open(`/companies/${company.slug}`, '_blank')}
                  size="sm"
                  variant="outline"
                  className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30"
                >
                  Xem
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Status */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Trạng thái hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{companies.length}</div>
              <div className="text-white/60 text-sm">Tổng công ty</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {companies.filter((c: any) => c.status === 'active').length}
              </div>
              <div className="text-white/60 text-sm">Công ty hoạt động</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {companies.filter((c: any) => c.is_featured).length}
              </div>
              <div className="text-white/60 text-sm">Công ty nổi bật</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {companies.reduce((sum: number, c: any) => sum + (c.employee_count || 0), 0)}
              </div>
              <div className="text-white/60 text-sm">Tổng nhân viên</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function CompaniesAdminPage() {
  return (
    <InternalLayout>
      <CompaniesAdminContent />
    </InternalLayout>
  )
}