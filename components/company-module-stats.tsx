"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, Folder, Briefcase, GraduationCap, TrendingUp, Calendar, Target, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useApiCache } from "@/hooks/use-api-cache"

interface CompanyModuleStatsProps {
  companyId: string
  companyName: string
  companySlug: string
}

export default function CompanyModuleStats({ companyId, companyName, companySlug }: CompanyModuleStatsProps) {
  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    projects: 0,
    services: 0,
    jobs: 0,
    activeProjects: 0,
    completedProjects: 0,
    activeJobs: 0
  })

  const { data: statsData, loading, error } = useApiCache<any>(
    `company-stats-${companyId}`,
    async () => {
      const response = await fetch(`/api/companies/stats?company_id=${companyId}`)
      if (!response.ok) throw new Error('Failed to fetch stats')
      return response.json()
    },
    2 * 60 * 1000 // Cache 2 phút
  )

  useEffect(() => {
    if (statsData?.success) {
      setStats(prev => ({
        ...prev,
        ...statsData.stats
      }))
    }
  }, [statsData])

  const modules = [
    {
      name: "Nhân Viên",
      icon: Users,
      count: stats.employees,
      link: `/cms/companies/${companyId}/employees`,
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      description: "Quản lý danh sách nhân viên"
    },
    {
      name: "Phòng Ban",
      icon: Building2,
      count: stats.departments,
      link: `/cms/companies/${companyId}/departments`,
      color: "bg-green-500/20 text-green-400 border-green-500/30",
      description: "Quản lý cơ cấu tổ chức"
    },
    {
      name: "Dự Án",
      icon: Folder,
      count: stats.projects,
      link: `/cms/companies/${companyId}/projects`,
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      description: "Quản lý dự án công ty"
    },
    {
      name: "Dịch Vụ",
      icon: Briefcase,
      count: stats.services,
      link: `/cms/companies/${companyId}/services`,
      color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      description: "Quản lý dịch vụ cung cấp"
    },
    {
      name: "Tuyển Dụng",
      icon: GraduationCap,
      count: stats.jobs,
      link: `/cms/companies/${companyId}/jobs`,
      color: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      description: "Quản lý việc làm"
    }
  ]

  const quickStats = [
    {
      label: "Dự án hoạt động",
      value: stats.activeProjects,
      icon: Target,
      color: "text-green-400"
    },
    {
      label: "Dự án hoàn thành",
      value: stats.completedProjects,
      icon: CheckCircle,
      color: "text-blue-400"
    },
    {
      label: "Vị trí tuyển dụng",
      value: stats.activeJobs,
      icon: GraduationCap,
      color: "text-purple-400"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Modules Quản Lý</h2>
          <p className="text-white/60">{companyName}</p>
        </div>
        <Link href={`/companies/${companySlug}`}>
          <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
            Xem Trang Công Khai
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="bg-black/50 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <Card key={index} className="bg-black/50 border-white/20 hover:border-white/40 transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                    <module.icon className="h-6 w-6 text-white/80" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">{module.name}</CardTitle>
                    <p className="text-sm text-white/60">{module.description}</p>
                  </div>
                </div>
                <Badge className={module.color}>
                  {module.count}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Link href={module.link}>
                <Button 
                  className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 transition-all duration-300"
                  variant="outline"
                >
                  Quản Lý {module.name}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Company Overview */}
      <Card className="bg-black/50 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Tổng Quan Công Ty
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.employees}</div>
              <div className="text-sm text-white/60">Nhân viên</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.departments}</div>
              <div className="text-sm text-white/60">Phòng ban</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.projects}</div>
              <div className="text-sm text-white/60">Dự án</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.services}</div>
              <div className="text-sm text-white/60">Dịch vụ</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}