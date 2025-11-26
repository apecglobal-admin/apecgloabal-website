"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import InternalLayout from "@/components/cms-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building2, Users, Folder, Briefcase, GraduationCap, TrendingUp, Calendar, Target, CheckCircle, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import CompanyModuleStats from "@/components/company-module-stats"

function CompanyDashboardContent() {
  const params = useParams()
  const router = useRouter()
  const companyId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [companyInfo, setCompanyInfo] = useState<any>(null)
  const [recentActivities, setRecentActivities] = useState<any[]>([])

  useEffect(() => {
    fetchCompanyInfo()
  }, [companyId])

  const fetchCompanyInfo = async () => {
    try {
      setLoading(true)
      
      // Fetch company info by ID
      const response = await fetch(`/api/companies`)
      if (!response.ok) throw new Error('Failed to fetch company')
      
      const data = await response.json()
      if (data.success) {
        // Find company by ID
        const company = data.data.find((c: any) => c.id.toString() === companyId)
        if (company) {
          setCompanyInfo(company)
        } else {
          toast.error('Không tìm thấy công ty')
          router.push('/cms/companies')
        }
      }
    } catch (error) {
      console.error('Error fetching company:', error)
      toast.error('Không thể tải thông tin công ty')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!companyInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Không tìm thấy công ty</h2>
          <Link href="/cms/companies">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Quay lại danh sách
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/cms/companies">
            <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
              {companyInfo.logo_url ? (
                <img
                  src={companyInfo.logo_url}
                  alt={`${companyInfo.name} logo`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Building2 className="h-8 w-8 text-white/60" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{companyInfo.name}</h1>
              <p className="text-white/80">{companyInfo.short_description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge className={companyInfo.is_featured 
                  ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' 
                  : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                }>
                  {companyInfo.is_featured ? 'Nổi bật' : 'Bình thường'}
                </Badge>
                <Badge className={companyInfo.status === 'active' 
                  ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                  : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                }>
                  {companyInfo.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link href={`/companies/${companyInfo.slug}`}>
            <Button 
              variant="outline" 
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Xem Trang Công Khai
            </Button>
          </Link>
          <Link href={`/cms/companies`}>
            <Button 
              variant="outline" 
              className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30"
            >
              Chỉnh Sửa Thông Tin
            </Button>
          </Link>
        </div>
      </div>

      {/* Company Info Card */}
      <Card className="bg-black/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Thông Tin Cơ Bản
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-white/60 mb-2">Ngành nghề</h4>
              <p className="text-white">{companyInfo.industry || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white/60 mb-2">Số nhân viên</h4>
              <p className="text-white">{companyInfo.employee_count || 0} nhân viên</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white/60 mb-2">Ngày thành lập</h4>
              <p className="text-white">
                {companyInfo.established_date 
                  ? new Date(companyInfo.established_date).toLocaleDateString('vi-VN')
                  : 'Chưa cập nhật'
                }
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white/60 mb-2">Website</h4>
              <p className="text-white">
                {companyInfo.website_url ? (
                  <a 
                    href={companyInfo.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    {companyInfo.website_url}
                  </a>
                ) : (
                  'Chưa cập nhật'
                )}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white/60 mb-2">Email</h4>
              <p className="text-white">{companyInfo.email || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white/60 mb-2">Điện thoại</h4>
              <p className="text-white">{companyInfo.phone || 'Chưa cập nhật'}</p>
            </div>
          </div>
          
          {companyInfo.address && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-white/60 mb-2">Địa chỉ</h4>
              <p className="text-white">{companyInfo.address}</p>
            </div>
          )}
          
          {companyInfo.description && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-white/60 mb-2">Mô tả</h4>
              <p className="text-white">{companyInfo.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Company Mission & Vision */}
      {(companyInfo.mission || companyInfo.vision) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {companyInfo.mission && (
            <Card className="bg-black/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Sứ Mệnh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">{companyInfo.mission}</p>
              </CardContent>
            </Card>
          )}
          
          {companyInfo.vision && (
            <Card className="bg-black/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Tầm Nhìn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">{companyInfo.vision}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Values & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {companyInfo.values && companyInfo.values.length > 0 && (
          <Card className="bg-black/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Giá Trị Cốt Lõi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {companyInfo.values.map((value: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    <span className="text-white/80">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {companyInfo.achievements && companyInfo.achievements.length > 0 && (
          <Card className="bg-black/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Thành Tựu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {companyInfo.achievements.map((achievement: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-white/80">{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Company Module Stats */}
      <CompanyModuleStats 
        companyId={companyId} 
        companyName={companyInfo.name} 
        companySlug={companyInfo.slug}
      />
    </div>
  )
}

export default function CompanyDashboardPage() {
  return (
    <InternalLayout>
      <CompanyDashboardContent />
    </InternalLayout>
  )
}