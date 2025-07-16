"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Company, Project, Service } from '@/lib/schema'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { 
  ArrowLeft, 
  ArrowRight, 
  Award, 
  Building, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Code, 
  DollarSign, 
  ExternalLink, 
  FileText, 
  Github, 
  Globe, 
  Layers, 
  LayoutGrid, 
  Lightbulb, 
  Link2, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Phone, 
  Rocket, 
  Server, 
  Share2, 
  Shield, 
  Star, 
  Target, 
  Terminal, 
  Trello, 
  Trophy, 
  Users, 
  Zap 
} from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from 'date-fns'

// Hàm lấy icon dựa trên tên công nghệ
const getTechIcon = (tech: string) => {
  const techLower = tech.toLowerCase()
  
  if (techLower.includes('react')) return <Code className="h-4 w-4" />
  if (techLower.includes('node')) return <Server className="h-4 w-4" />
  if (techLower.includes('python')) return <Terminal className="h-4 w-4" />
  if (techLower.includes('aws') || techLower.includes('cloud')) return <Globe className="h-4 w-4" />
  if (techLower.includes('ai') || techLower.includes('ml')) return <Zap className="h-4 w-4" />
  if (techLower.includes('mobile')) return <Layers className="h-4 w-4" />
  if (techLower.includes('web')) return <LayoutGrid className="h-4 w-4" />
  
  return <Code className="h-4 w-4" />
}

// Hàm lấy màu gradient dựa trên status
const getStatusGradient = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'from-green-600 to-emerald-600'
    case 'inactive':
      return 'from-red-600 to-orange-600'
    case 'pending':
      return 'from-yellow-600 to-amber-600'
    default:
      return 'from-purple-600 to-blue-600'
  }
}

// Hàm lấy icon dựa trên status
const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return <CheckCircle className="h-4 w-4 text-green-400" />
    case 'inactive':
      return <Clock className="h-4 w-4 text-red-400" />
    case 'pending':
      return <Trello className="h-4 w-4 text-yellow-400" />
    default:
      return <Target className="h-4 w-4 text-gray-400" />
  }
}

// Hàm format ngày tháng
const formatDate = (date: Date) => {
  return format(new Date(date), 'dd/MM/yyyy')
}

export default function CompanyDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [companyData, setCompanyData] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await fetch(`/api/companies/details?slug=${slug}`)

        console.log(`Fetching company data for slug: ${slug}`)
       
        
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/404')
            return
          }
          throw new Error('Failed to fetch company data')
        }
        
        const data = await response.json()
        console.log(`Company data fetched successfully:`, data)
        setCompanyData(data.company)
        setProjects(data.projects)
        setServices(data.services)
      } catch (err) {
        console.error('Error fetching company data:', err)
        setError('Failed to load company data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchCompanyData()
  }, [slug]) // Chỉ phụ thuộc vào slug, không cần router
  
  // Hiển thị loading hoặc error state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500"></div>
      </div>
    )
  }
  
  if (error || !companyData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white border border-red-200 p-8 rounded-xl max-w-md text-center shadow-lg">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Đã xảy ra lỗi</h1>
          <p className="text-gray-600 mb-6">{error || 'Không thể tải thông tin công ty. Vui lòng thử lại sau.'}</p>
          <Link href="/companies">
            <Button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
              Quay lại danh sách công ty
            </Button>
          </Link>
        </div>
      </div>
    )
  }
  
  // Mô tả chi tiết công ty
  const detailedDescription = `
    ${companyData.description}
    
    Được thành lập vào năm ${new Date(companyData.established_date).getFullYear()}, ${companyData.name} đã phát triển thành một trong những công ty hàng đầu trong lĩnh vực ${companyData.industry}. 
    Với đội ngũ ${companyData.employee_count} nhân viên tài năng và nhiệt huyết, chúng tôi cam kết mang đến những giải pháp công nghệ tiên tiến, 
    ứng dụng trí tuệ nhân tạo và tự động hóa để giải quyết các thách thức kinh doanh hiện đại.
    
    Tầm nhìn của chúng tôi là trở thành đối tác công nghệ đáng tin cậy, giúp các doanh nghiệp chuyển đổi số thành công và phát triển bền vững trong kỷ nguyên số.
  `
  
  // Các giá trị cốt lõi
  const coreValues = [
    {
      title: "Đổi Mới",
      description: "Không ngừng tìm kiếm giải pháp sáng tạo và đột phá công nghệ",
      icon: <Lightbulb className="h-6 w-6" />
    },
    {
      title: "Chất Lượng",
      description: "Cam kết cung cấp sản phẩm và dịch vụ chất lượng cao nhất",
      icon: <Award className="h-6 w-6" />
    },
    {
      title: "Hợp Tác",
      description: "Xây dựng mối quan hệ đối tác bền vững dựa trên sự tin tưởng và tôn trọng",
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "Trách Nhiệm",
      description: "Hoạt động với tinh thần trách nhiệm đối với khách hàng, nhân viên và xã hội",
      icon: <Shield className="h-6 w-6" />
    }
  ]
  
  // Các thành tựu
  const achievements = [
    "Top 10 Công ty Công nghệ Sáng tạo năm 2023",
    "Giải thưởng Sản phẩm AI xuất sắc tại Tech Awards 2022",
    "Chứng nhận ISO 27001 về An ninh Thông tin",
    "Đối tác Vàng của Microsoft và AWS"
  ]
  
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      
      {/* Breadcrumb */}
      <section className="pt-24 pb-8 px-4">
        <div className="container mx-auto">
          <div className="flex items-center text-gray-600 text-sm">
            <Link href="/" className="hover:text-red-600 transition-colors duration-300">Trang chủ</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/companies" className="hover:text-red-600 transition-colors duration-300">Công ty</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-red-600 truncate max-w-[200px]">{companyData.name}</span>
          </div>
        </div>
      </section>
      
      {/* Company Header */}
      <section className="py-16 px-4 bg-white shadow-lg">
        <div className="container mx-auto">
          <Link 
            href="/companies" 
            className="inline-flex items-center text-gray-600 hover:text-red-600 mb-8 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center mr-2 group-hover:shadow-lg transition-all duration-300">
              <ArrowLeft className="h-4 w-4 group-hover:text-red-600 transition-colors duration-300" />
            </div>
            Quay lại danh sách công ty
          </Link>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {companyData.status}
                </div>
                <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {companyData.industry}
                </div>
              </div>
              
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-red-600 leading-tight mb-4">
                  {companyData.name}
                </h1>
                
                <p className="text-gray-600 text-lg leading-relaxed">
                  {companyData.description}
                </p>
              </div>
              
              <div className="flex items-center p-4 bg-white rounded-xl shadow-lg">
                <div className="w-14 h-14 rounded-xl bg-white shadow-md overflow-hidden relative flex-shrink-0">
                  <Image 
                    src={companyData.logo_url} 
                    alt={companyData.name}
                    width={56}
                    height={56}
                    className="object-contain p-2"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">Thành lập</p>
                  <p className="text-gray-900 font-medium">
                    {formatDate(companyData.established_date)}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <span className="mr-2">Liên Hệ Hợp Tác</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Chia Sẻ
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 rounded-xl transform rotate-1 opacity-20"></div>
              <div className="relative bg-white rounded-xl p-8 shadow-2xl">
                {/* Company Stats */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-red-600" />
                      <span className="text-gray-600 text-sm">Nhân viên</span>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {companyData.employee_count} người
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Layers className="h-4 w-4 text-red-600" />
                      <span className="text-gray-600 text-sm">Phòng ban</span>
                    </div>
                    <p className="text-gray-900 font-medium">{companyData.departments?.length || 0} phòng ban</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Rocket className="h-4 w-4 text-red-600" />
                      <span className="text-gray-600 text-sm">Dự án</span>
                    </div>
                    <p className="text-gray-900 font-medium">{companyData.projectsCount || projects.length} dự án</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-red-600" />
                      <span className="text-gray-600 text-sm">Dịch vụ</span>
                    </div>
                    <p className="text-gray-900 font-medium">{companyData.servicesCount || services.length} dịch vụ</p>
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-lg bg-white shadow-md flex items-center justify-center mr-4">
                      <Phone className="h-5 w-5 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-red-600">
                      Thông Tin Liên Hệ
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 group">
                      <div className="w-8 h-8 rounded-lg bg-white shadow-md flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-all duration-300">
                        <Mail className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Email</p>
                        <a href={`mailto:${companyData.email}`} className="text-gray-900 hover:text-red-600 transition-colors duration-300">
                          {companyData.email}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 group">
                      <div className="w-8 h-8 rounded-lg bg-white border border-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:border-cyan-500/30 transition-colors duration-300">
                        <Phone className="h-4 w-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Điện thoại</p>
                        <a href={`tel:${companyData.phone}`} className="text-white hover:text-cyan-400 transition-colors duration-300">
                          {companyData.phone}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 group">
                      <div className="w-8 h-8 rounded-lg bg-white border border-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:border-cyan-500/30 transition-colors duration-300">
                        <Globe className="h-4 w-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Website</p>
                        <a href={companyData.website_url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-cyan-400 transition-colors duration-300 flex items-center">
                          {companyData.website_url.replace(/^https?:\/\//, '')}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 group">
                      <div className="w-8 h-8 rounded-lg bg-white border border-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:border-cyan-500/30 transition-colors duration-300">
                        <MapPin className="h-4 w-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Địa chỉ</p>
                        <p className="text-white">{companyData.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Company Details Tabs - AI Style */}
      <section className="py-20 px-4 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-purple-900/5 to-black/0"></div>
        
        <div className="container mx-auto relative">
          <Tabs defaultValue="about" className="w-full">
            <div className="relative max-w-2xl mx-auto mb-12">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-full blur opacity-30"></div>
              <TabsList className="relative grid grid-cols-3 bg-white border border-purple-500/30 rounded-full backdrop-blur-sm overflow-hidden">
                <TabsTrigger 
                  value="about" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-full transition-all duration-300"
                >
                  Giới Thiệu
                </TabsTrigger>
                <TabsTrigger 
                  value="projects" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-full transition-all duration-300"
                >
                  Dự Án
                </TabsTrigger>
                <TabsTrigger 
                  value="services" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-full transition-all duration-300"
                >
                  Dịch Vụ
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="about" className="mt-6 animate-fade-in-up">
              <Card className="bg-white border-purple-500/30 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-8 md:p-10">
                  <div className="prose prose-lg max-w-none text-black">
                    <div dangerouslySetInnerHTML={{ __html: detailedDescription.replace(/\n/g, '<br />') }} />
                  </div>
                  
                  {/* Core Values */}
                  <div className="mt-16">
                    <div className="flex items-center mb-8">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center mr-4 shadow-lg shadow-purple-900/20">
                        <Star className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                        Giá Trị Cốt Lõi
                      </h3>
                    </div>
                    
                    <div className="grid md:grid-cols-4 gap-6">
                      {coreValues.map((value, index) => (
                        <div key={index} className="group bg-white p-6 rounded-xl border border-purple-500/20 text-center hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10">
                          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-purple-600/20 to-cyan-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                            {React.cloneElement(value.icon, { className: "h-8 w-8 text-purple-400" })}
                          </div>
                          <h3 className="text-gray-900 font-medium mb-2 group-hover:text-cyan-600 transition-colors duration-300">{value.title}</h3>
                          <p className="text-gray-600 text-sm">{value.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Achievements */}
                  <div className="mt-16">
                    <div className="flex items-center mb-8">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center mr-4 shadow-lg shadow-purple-900/20">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                        Thành Tựu
                      </h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start space-x-4 group">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-900/20 group-hover:scale-110 transition-transform duration-300">
                            <Trophy className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="text-gray-800 text-lg group-hover:text-amber-600 transition-colors duration-300">{achievement}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Departments */}
                  {companyData.departments && companyData.departments.length > 0 && (
                    <div className="mt-16">
                      <div className="flex items-center mb-8">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center mr-4 shadow-lg shadow-purple-900/20">
                          <Building className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                          Phòng Ban
                        </h3>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-6">
                        {companyData.departments.map((department, index) => (
                          <div key={index} className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                            <div className="relative bg-white p-6 rounded-xl border border-purple-500/20 group-hover:border-cyan-500/30 transition-colors duration-300 backdrop-blur-sm shadow-md">
                              <h4 className="text-gray-900 font-medium mb-2 group-hover:text-cyan-600 transition-colors duration-300">{department.name}</h4>
                              <p className="text-gray-600 text-sm mb-4">{department.description}</p>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-1 text-gray-500 text-xs">
                                  <Users className="h-3 w-3" />
                                  <span>{department.employee_count} nhân viên</span>
                                </div>
                                <div className="text-gray-500 text-xs">
                                  Quản lý: {department.manager_name}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="projects" className="mt-6 animate-fade-in-up">
              <Card className="bg-white border-purple-500/30 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-8 md:p-10">
                  <div className="flex items-center mb-8">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center mr-4 shadow-lg shadow-purple-900/20">
                      <Rocket className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-cyan-600 bg-clip-text text-transparent">
                      Dự Án Của {companyData.name}
                    </h3>
                  </div>
                  
                  {projects.length > 0 ? (
                    <div className="space-y-8 stagger-animation">
                      {projects.map((project, index) => (
                        <div key={index} className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                          <div className="relative bg-white p-6 rounded-xl border border-purple-500/20 group-hover:border-cyan-500/30 transition-colors duration-300 backdrop-blur-sm shadow-md">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  {getStatusIcon(project.status)}
                                  <Badge className={`bg-gradient-to-r ${getStatusGradient(project.status)} px-3 py-1 text-xs font-medium uppercase tracking-wider`}>
                                    {project.status}
                                  </Badge>
                                </div>
                                
                                <Link href={`/projects/${project.slug}`}>
                                  <h4 className="text-xl font-medium text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors duration-300">{project.name}</h4>
                                </Link>
                                
                                <p className="text-gray-600 mb-4">{project.description}</p>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {project.technologies.map((tech, idx) => (
                                    <Badge 
                                      key={idx} 
                                      variant="outline" 
                                      className="border-cyan-500/30 text-cyan-600 bg-white hover:bg-cyan-50 transition-colors duration-300 cursor-default flex items-center space-x-1 px-2 py-1"
                                    >
                                      {getTechIcon(tech)}
                                      <span>{tech}</span>
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="flex flex-col space-y-4 md:w-64">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tiến độ</span>
                                    <span className="text-gray-900">{project.progress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-purple-500/20">
                                    <div
                                      className={`bg-gradient-to-r ${getStatusGradient(project.status)} h-2 rounded-full transition-all duration-1000 relative`}
                                      style={{ width: `${project.progress}%` }}
                                    >
                                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                    </div>
                                  </div>
                                </div>
                                
                                <Link href={`/projects/${project.slug}`}>
                                  <Button 
                                    variant="outline" 
                                    className="w-full border-purple-500/30 text-gray-900 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-cyan-600/20 hover:border-cyan-500/50 transition-all duration-300"
                                  >
                                    <span className="mr-2">Xem Chi Tiết</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                                      <line x1="5" y1="12" x2="19" y2="12"></line>
                                      <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 border border-purple-500/20 flex items-center justify-center mb-4">
                        <FileText className="h-10 w-10 text-purple-400" />
                      </div>
                      <h4 className="text-xl font-medium text-gray-900 mb-2">Chưa có dự án nào</h4>
                      <p className="text-gray-600">Công ty chưa có dự án nào được công bố.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="services" className="mt-6 animate-fade-in-up">
              <Card className="bg-white border-purple-500/30 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-8 md:p-10">
                  <div className="flex items-center mb-8">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center mr-4 shadow-lg shadow-purple-900/20">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-cyan-600 bg-clip-text text-transparent">
                      Dịch Vụ Của {companyData.name}
                    </h3>
                  </div>
                  
                  {services.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animation">
                      {services.map((service, index) => (
                        <div key={index} className="group">
                          <Card className="bg-white border-purple-500/30 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden h-full">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                            
                            <CardHeader className="text-center pt-8">
                              <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur opacity-40 group-hover:opacity-70 transition-opacity duration-300 animate-pulse"></div>
                                <div className="relative w-full h-full bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                  {/* Dynamically render icon based on service.icon */}
                                  {service.icon === 'code' && <Code className="h-10 w-10 text-white" />}
                                  {service.icon === 'server' && <Server className="h-10 w-10 text-white" />}
                                  {service.icon === 'globe' && <Globe className="h-10 w-10 text-white" />}
                                  {service.icon === 'zap' && <Zap className="h-10 w-10 text-white" />}
                                  {service.icon === 'shield' && <Shield className="h-10 w-10 text-white" />}
                                  {!['code', 'server', 'globe', 'zap', 'shield'].includes(service.icon) && <Layers className="h-10 w-10 text-white" />}
                                </div>
                              </div>
                              <CardTitle className="text-xl text-gray-900 group-hover:text-cyan-600 transition-colors duration-300">
                                {service.title}
                              </CardTitle>
                            </CardHeader>
                            
                            <CardContent className="text-center pb-8">
                              <p className="text-gray-600 text-sm leading-relaxed mb-6">{service.description}</p>
                              
                              {service.features && service.features.length > 0 && (
                                <div className="space-y-2 mb-6 text-left">
                                  {service.features.slice(0, 3).map((feature, idx) => (
                                    <div key={idx} className="flex items-center space-x-2">
                                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                                      <span className="text-gray-700 text-sm">{feature}</span>
                                    </div>
                                  ))}
                                  {service.features.length > 3 && (
                                    <div className="text-cyan-600 text-sm text-center">+ {service.features.length - 3} tính năng khác</div>
                                  )}
                                </div>
                              )}
                              
                              <Link href={`/services/${service.id}`}>
                                <Button variant="outline" className="border-purple-500/30 text-gray-900 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-cyan-600/20 hover:border-cyan-500/50 transition-all duration-300">
                                  <span className="mr-2">Tìm Hiểu Thêm</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                  </svg>
                                </Button>
                              </Link>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 border border-purple-500/20 flex items-center justify-center mb-4">
                        <FileText className="h-10 w-10 text-purple-400" />
                      </div>
                      <h4 className="text-xl font-medium text-gray-900 mb-2">Chưa có dịch vụ nào</h4>
                      <p className="text-gray-600">Công ty chưa có dịch vụ nào được công bố.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* CTA Section - AI Style */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Background circuit pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50h100M50 0v100" stroke="white" strokeWidth="0.5" fill="none" />
                <circle cx="50" cy="50" r="3" fill="white" />
                <circle cx="0" cy="50" r="3" fill="white" />
                <circle cx="100" cy="50" r="3" fill="white" />
                <circle cx="50" cy="0" r="3" fill="white" />
                <circle cx="50" cy="100" r="3" fill="white" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-pattern)" />
          </svg>
        </div>
        
        {/* AI Nodes Animation */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400/40 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                boxShadow: '0 0 10px 2px rgba(45, 212, 191, 0.3)'
              }}
            ></div>
          ))}
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto relative">
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 border-t-2 border-l-2 border-purple-500/20 rounded-tl-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 border-b-2 border-r-2 border-cyan-500/20 rounded-br-3xl"></div>
            
            <Card className="bg-white border-none shadow-2xl shadow-purple-900/20 backdrop-blur-md overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600"></div>
              
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center animate-pulse">
                  <MessageSquare className="h-10 w-10 text-white" />
                </div>
                
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-6">
                  Bắt Đầu Hợp Tác Với {companyData.name}
                </h2>
                
                <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
                  Liên hệ với chúng tôi ngay hôm nay để tìm hiểu thêm về các dịch vụ và giải pháp AI tiên tiến 
                  mà <span className="text-cyan-400 font-semibold">{companyData.name}</span> có thể cung cấp cho doanh nghiệp của bạn.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                    <Button className="relative bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-lg px-8 py-4 transition-all duration-300 shadow-lg shadow-purple-900/30">
                      Liên Hệ Ngay
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </Button>
                  </div>
                  
                  <a href={companyData.website_url} target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="outline"
                      className="border-purple-500/30 text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-cyan-600/20 hover:border-cyan-500/50 text-lg px-8 py-4 transition-all duration-300 group"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-cyan-400">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      </svg>
                      Truy Cập Website
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}