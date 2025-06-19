import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getProjectBySlug, getRelatedProjects } from '@/lib/db'
import { Project } from '@/lib/schema'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { 
  ArrowLeft, 
  ArrowRight, 
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
  MessageSquare, 
  Rocket, 
  Server, 
  Share2, 
  Shield, 
  Star, 
  Target, 
  Terminal, 
  Trello, 
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
  switch (status.toLowerCase()) {
    case 'completed':
      return 'from-green-600 to-emerald-600'
    case 'in progress':
      return 'from-blue-600 to-cyan-600'
    case 'planning':
      return 'from-purple-600 to-indigo-600'
    case 'on hold':
      return 'from-yellow-600 to-amber-600'
    default:
      return 'from-purple-600 to-blue-600'
  }
}

// Hàm lấy icon dựa trên status
const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-400" />
    case 'in progress':
      return <Clock className="h-4 w-4 text-blue-400" />
    case 'planning':
      return <Trello className="h-4 w-4 text-purple-400" />
    case 'on hold':
      return <Layers className="h-4 w-4 text-yellow-400" />
    default:
      return <Target className="h-4 w-4 text-gray-400" />
  }
}

// Hàm format tiền tệ
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount)
}

// Hàm tính thời gian dự án
const calculateProjectDuration = (startDate: Date, endDate: Date) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const diffMonths = Math.ceil(diffDays / 30)
  
  if (diffMonths < 1) {
    return `${diffDays} ngày`
  } else {
    return `${diffMonths} tháng`
  }
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const projectData = await getProjectBySlug(slug)
  
  if (!projectData) {
    notFound()
  }
  
  const relatedProjects = await getRelatedProjects(projectData.id, projectData.company_id, 3)
  
  // Mô tả chi tiết dự án
  const detailedDescription = `
    ${projectData.description}
    
    Dự án này được phát triển bởi đội ngũ chuyên gia của ${projectData.company_name} với mục tiêu tạo ra giải pháp công nghệ tiên tiến 
    ứng dụng trí tuệ nhân tạo và tự động hóa để giải quyết các thách thức kinh doanh hiện đại.
    
    Với sự kết hợp giữa công nghệ AI tiên tiến và kinh nghiệm chuyên môn trong ngành, dự án đã đạt được những kết quả đáng kể, 
    mang lại giá trị thực tế cho khách hàng và đối tác.
  `
  
  // Các tính năng dự án (nếu không có dữ liệu thực, sử dụng dữ liệu mẫu)
  const projectFeatures = projectData.features || [
    "Tích hợp trí tuệ nhân tạo để phân tích dữ liệu và đưa ra dự đoán chính xác",
    "Giao diện người dùng hiện đại, thân thiện và dễ sử dụng",
    "Khả năng xử lý hàng triệu giao dịch mỗi giây với độ trễ thấp",
    "Hệ thống bảo mật đa lớp bảo vệ dữ liệu người dùng",
    "Tích hợp liền mạch với các hệ thống hiện có",
    "Khả năng mở rộng để đáp ứng nhu cầu tăng trưởng"
  ]
  
  // Các thách thức dự án
  const projectChallenges = projectData.challenges || [
    "Xử lý khối lượng dữ liệu lớn với yêu cầu thời gian thực",
    "Đảm bảo tính bảo mật và tuân thủ quy định về dữ liệu",
    "Tích hợp với các hệ thống legacy đang hoạt động",
    "Tối ưu hóa hiệu suất trên nhiều nền tảng khác nhau"
  ]
  
  // Các giải pháp
  const projectSolutions = projectData.solutions || [
    "Phát triển kiến trúc microservices để tăng khả năng mở rộng",
    "Áp dụng các thuật toán AI tiên tiến để xử lý và phân tích dữ liệu",
    "Sử dụng công nghệ container để đảm bảo triển khai nhất quán",
    "Thiết kế hệ thống bảo mật đa lớp với mã hóa end-to-end"
  ]
  
  // Các kết quả dự án
  const projectResults = projectData.results || [
    "Tăng 45% hiệu suất xử lý so với hệ thống cũ",
    "Giảm 30% chi phí vận hành hàng tháng",
    "Tăng 25% tỷ lệ chuyển đổi người dùng",
    "Giảm 60% thời gian phản hồi hệ thống"
  ]
  
  // Đánh giá từ khách hàng
  const testimonials = projectData.testimonials || [
    {
      name: "Nguyễn Văn A",
      position: "Giám đốc Công nghệ",
      company: "Công ty XYZ",
      content: "Dự án đã vượt xa mong đợi của chúng tôi. Đội ngũ phát triển đã làm việc chuyên nghiệp và đưa ra giải pháp sáng tạo cho các thách thức phức tạp."
    },
    {
      name: "Trần Thị B",
      position: "Giám đốc Điều hành",
      company: "Tập đoàn ABC",
      content: "Giải pháp AI được phát triển đã giúp chúng tôi tự động hóa nhiều quy trình, tiết kiệm thời gian và nguồn lực đáng kể."
    }
  ]
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <Header />
      
      {/* Breadcrumb - AI Style */}
      <section className="pt-8 px-4">
        <div className="container mx-auto">
          <div className="flex items-center text-white/60 text-sm">
            <Link href="/" className="hover:text-cyan-400 transition-colors duration-300">Trang chủ</Link>
            <span className="mx-2 text-purple-500/50">/</span>
            <Link href="/projects" className="hover:text-cyan-400 transition-colors duration-300">Dự án</Link>
            <span className="mx-2 text-purple-500/50">/</span>
            <span className="text-cyan-400/80 truncate max-w-[200px]">{projectData.name}</span>
          </div>
        </div>
      </section>
      
      {/* Project Header - AI Style */}
      <section className="py-16 px-4 relative">
        {/* Background Animation Effect */}
        <div className="absolute inset-0 bg-black/50">
          <div className="absolute inset-0 opacity-10" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '24px 24px'
          }}></div>
        </div>
        
        <div className="container mx-auto relative">
          <Link 
            href="/projects" 
            className="inline-flex items-center text-white/60 hover:text-cyan-400 mb-8 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-black/30 border border-purple-500/30 flex items-center justify-center mr-2 group-hover:border-cyan-500/50 transition-colors duration-300">
              <ArrowLeft className="h-4 w-4 group-hover:text-cyan-400 transition-colors duration-300" />
            </div>
            Quay lại danh sách dự án
          </Link>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <Badge className={`bg-gradient-to-r ${getStatusGradient(projectData.status)} px-3 py-1 text-xs font-medium uppercase tracking-wider`}>
                  {projectData.status}
                </Badge>
                <div className="flex items-center space-x-1 bg-black/30 py-1 px-2 rounded-full">
                  <Badge variant="outline" className="border-purple-500/30 text-purple-300 bg-black/30">
                    {projectData.company_name}
                  </Badge>
                </div>
              </div>
              
              <div>
                <div className="inline-block relative mb-2">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 rounded-lg blur opacity-30"></div>
                  <h1 className="relative text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
                    {projectData.name}
                  </h1>
                </div>
                
                <p className="text-white/80 text-lg leading-relaxed">
                  {projectData.description}
                </p>
              </div>
              
              <div className="flex items-center p-4 bg-black/30 rounded-xl border border-purple-500/20 backdrop-blur-sm">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-600/10 to-cyan-600/10 overflow-hidden relative flex-shrink-0 border border-purple-500/20">
                  <Image 
                    src={projectData.company_logo || '/placeholder-logo.png'} 
                    alt={projectData.company_name}
                    width={56}
                    height={56}
                    className="object-contain p-2"
                  />
                </div>
                <div className="ml-4">
                  <p className="text-white/60 text-sm">Phát triển bởi</p>
                  <Link href={`/companies/${projectData.company_slug}`} className="text-white font-medium hover:text-cyan-400 transition-colors duration-300">
                    {projectData.company_name}
                  </Link>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                  <Button className="relative bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 shadow-lg shadow-purple-900/20">
                    <span className="mr-2">Liên Hệ Về Dự Án</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  className="border-purple-500/30 text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-cyan-600/20 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <Share2 className="mr-2 h-4 w-4 text-cyan-400" />
                  Chia Sẻ Dự Án
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-xl blur opacity-30"></div>
              <div className="relative bg-black/60 rounded-xl p-8 border border-purple-500/30 backdrop-blur-sm">
                {/* Project Stats */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-cyan-400" />
                      <span className="text-white/60 text-sm">Thời gian</span>
                    </div>
                    <p className="text-white font-medium">
                      {calculateProjectDuration(projectData.start_date, projectData.end_date)}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-cyan-400" />
                      <span className="text-white/60 text-sm">Đội ngũ</span>
                    </div>
                    <p className="text-white font-medium">{projectData.team_size} chuyên gia</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-cyan-400" />
                      <span className="text-white/60 text-sm">Ngân sách</span>
                    </div>
                    <p className="text-white font-medium">{formatCurrency(projectData.budget)}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-cyan-400" />
                      <span className="text-white/60 text-sm">Tiến độ</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden border border-purple-500/20">
                        <div
                          className={`bg-gradient-to-r ${getStatusGradient(projectData.status)} h-2 rounded-full transition-all duration-1000 relative`}
                          style={{ width: `${projectData.progress}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                      <span className="text-white font-medium">{projectData.progress}%</span>
                    </div>
                  </div>
                </div>
                
                {/* Technologies */}
                <div className="space-y-4">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center mr-4 shadow-lg shadow-purple-900/20">
                      <Code className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                      Công Nghệ Sử Dụng
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {projectData.technologies.map((tech, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="border-cyan-500/30 text-cyan-300 bg-black/30 hover:bg-cyan-900/20 transition-colors duration-300 cursor-default flex items-center space-x-1 px-3 py-1.5"
                      >
                        {getTechIcon(tech)}
                        <span>{tech}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Project Details Tabs - AI Style */}
      <section className="py-20 px-4 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-purple-900/5 to-black/0"></div>
        
        <div className="container mx-auto relative">
          <Tabs defaultValue="overview" className="w-full">
            <div className="relative max-w-2xl mx-auto mb-12">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-full blur opacity-30"></div>
              <TabsList className="relative grid grid-cols-4 bg-black/60 border border-purple-500/30 rounded-full backdrop-blur-sm overflow-hidden">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-full transition-all duration-300"
                >
                  Tổng Quan
                </TabsTrigger>
                <TabsTrigger 
                  value="features" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-full transition-all duration-300"
                >
                  Tính Năng
                </TabsTrigger>
                <TabsTrigger 
                  value="challenges" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-full transition-all duration-300"
                >
                  Thách Thức
                </TabsTrigger>
                <TabsTrigger 
                  value="results" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-full transition-all duration-300"
                >
                  Kết Quả
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="overview" className="mt-6 animate-fade-in-up">
              <Card className="bg-black/50 border-purple-500/30 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-8 md:p-10">
                  <div className="prose prose-invert prose-lg max-w-none text-white">
                    <div dangerouslySetInnerHTML={{ __html: detailedDescription.replace(/\n/g, '<br />') }} />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6 mt-16">
                    <div className="group bg-black/30 p-6 rounded-xl border border-purple-500/20 text-center hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-purple-600/20 to-cyan-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                        <Rocket className="h-8 w-8 text-purple-400" />
                      </div>
                      <h3 className="text-white font-medium mb-2 group-hover:text-cyan-300 transition-colors duration-300">Hiệu Suất Cao</h3>
                      <p className="text-white/70 text-sm">Tối ưu hóa hiệu suất và tốc độ xử lý với thuật toán AI tiên tiến</p>
                    </div>
                    <div className="group bg-black/30 p-6 rounded-xl border border-purple-500/20 text-center hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-purple-600/20 to-cyan-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                        <Shield className="h-8 w-8 text-cyan-400" />
                      </div>
                      <h3 className="text-white font-medium mb-2 group-hover:text-cyan-300 transition-colors duration-300">Bảo Mật Tối Đa</h3>
                      <p className="text-white/70 text-sm">Hệ thống bảo mật đa lớp bảo vệ dữ liệu với công nghệ mã hóa tiên tiến</p>
                    </div>
                    <div className="group bg-black/30 p-6 rounded-xl border border-purple-500/20 text-center hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-purple-600/20 to-cyan-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                        <Zap className="h-8 w-8 text-green-400" />
                      </div>
                      <h3 className="text-white font-medium mb-2 group-hover:text-cyan-300 transition-colors duration-300">Tự Động Hóa</h3>
                      <p className="text-white/70 text-sm">Tự động hóa quy trình với công nghệ AI giúp tiết kiệm thời gian và nguồn lực</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="mt-6 animate-fade-in-up">
              <Card className="bg-black/50 border-purple-500/30 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-8 md:p-10">
                  <div className="flex items-center mb-8">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center mr-4 shadow-lg shadow-purple-900/20">
                      <Lightbulb className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                      Tính Năng Nổi Bật
                    </h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 stagger-animation">
                    {projectFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-4 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-900/20 group-hover:scale-110 transition-transform duration-300">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white/90 text-lg group-hover:text-cyan-300 transition-colors duration-300">{feature}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-12 relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-xl blur opacity-30"></div>
                    <div className="relative bg-black/60 p-6 rounded-xl border border-cyan-500/20 backdrop-blur-sm">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-900/20">
                          <Star className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">Điểm Nổi Bật</h3>
                      </div>
                      <p className="text-white/70">
                        Dự án này nổi bật với khả năng tích hợp trí tuệ nhân tạo vào quy trình kinh doanh, 
                        giúp tự động hóa các tác vụ phức tạp và đưa ra dự đoán chính xác dựa trên dữ liệu. 
                        Điều này giúp doanh nghiệp tiết kiệm thời gian, giảm chi phí và tăng hiệu quả hoạt động.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="challenges" className="mt-6 animate-fade-in-up">
              <Card className="bg-black/50 border-purple-500/30 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-8 md:p-10">
                  <div className="grid md:grid-cols-2 gap-12">
                    <div>
                      <div className="flex items-center mb-8">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 flex items-center justify-center mr-4 shadow-lg shadow-red-900/20">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-orange-200 to-red-200 bg-clip-text text-transparent">
                          Thách Thức
                        </h3>
                      </div>
                      
                      <div className="space-y-6 stagger-animation">
                        {projectChallenges.map((challenge, index) => (
                          <div key={index} className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/10 to-orange-600/10 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                            <div className="relative bg-black/60 p-6 rounded-xl border border-red-500/20 group-hover:border-orange-500/30 transition-colors duration-300 backdrop-blur-sm">
                              <p className="text-white/90 group-hover:text-orange-300 transition-colors duration-300">{challenge}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-8">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center mr-4 shadow-lg shadow-cyan-900/20">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 8v4l3 3"></path>
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                          Giải Pháp
                        </h3>
                      </div>
                      
                      <div className="space-y-6 stagger-animation">
                        {projectSolutions.map((solution, index) => (
                          <div key={index} className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                            <div className="relative bg-black/60 p-6 rounded-xl border border-cyan-500/20 group-hover:border-blue-500/30 transition-colors duration-300 backdrop-blur-sm">
                              <p className="text-white/90 group-hover:text-cyan-300 transition-colors duration-300">{solution}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="results" className="mt-6 animate-fade-in-up">
              <Card className="bg-black/50 border-purple-500/30 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-8 md:p-10">
                  <div className="flex items-center mb-12">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center mr-4 shadow-lg shadow-green-900/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-green-200 to-emerald-200 bg-clip-text text-transparent">
                      Kết Quả Đạt Được
                    </h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-12 stagger-animation">
                    {projectResults.map((result, index) => (
                      <div key={index} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600/10 to-emerald-600/10 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                        <div className="relative bg-black/60 p-6 rounded-xl border border-green-500/20 group-hover:border-emerald-500/30 transition-colors duration-300 backdrop-blur-sm flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-600/20 to-emerald-600/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <CheckCircle className="h-6 w-6 text-green-400" />
                          </div>
                          <p className="text-white/90 text-lg group-hover:text-green-300 transition-colors duration-300">{result}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Testimonials */}
                  <div className="space-y-8">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent mb-6">
                      Đánh Giá Từ Khách Hàng
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {testimonials.map((testimonial, index) => (
                        <div key={index} className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                          <div className="relative bg-black/60 p-6 rounded-xl border border-purple-500/20 group-hover:border-cyan-500/30 transition-colors duration-300 backdrop-blur-sm">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600/20 to-cyan-600/20 flex items-center justify-center mr-3 overflow-hidden">
                                {testimonial.avatar ? (
                                  <Image 
                                    src={testimonial.avatar} 
                                    alt={testimonial.name}
                                    width={48}
                                    height={48}
                                    className="object-cover"
                                  />
                                ) : (
                                  <Users className="h-6 w-6 text-white" />
                                )}
                              </div>
                              <div>
                                <p className="text-white font-medium">{testimonial.name}</p>
                                <p className="text-white/60 text-sm">{testimonial.position}, {testimonial.company}</p>
                              </div>
                            </div>
                            <p className="text-white/80 italic">{testimonial.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Related Projects - AI Style */}
      {relatedProjects.length > 0 && (
        <section className="py-20 px-4 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-purple-900/5 to-black/0"></div>
          
          <div className="container mx-auto relative">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-16"></div>
            
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center mr-4 shadow-lg shadow-purple-900/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                  Dự Án Liên Quan
                </h2>
              </div>
              <div className="hidden md:block h-[1px] w-1/4 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 stagger-animation">
              {relatedProjects.map((project, index) => (
                <Link href={`/projects/${project.slug}`} key={index} className="group">
                  <Card className="bg-black/50 border-purple-500/30 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden h-full">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        {getStatusIcon(project.status)}
                        <Badge className={`bg-gradient-to-r ${getStatusGradient(project.status)} px-3 py-1 text-xs font-medium uppercase tracking-wider`}>
                          {project.status}
                        </Badge>
                      </div>
                      
                      <h3 className="text-white font-medium mb-3 line-clamp-2 group-hover:text-cyan-300 transition-colors duration-300">{project.name}</h3>
                      <p className="text-white/60 text-sm mb-6 line-clamp-3">{project.description}</p>
                      
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-black/30 border border-purple-500/20">
                            <Image 
                              src={project.company_logo || '/placeholder-logo.png'} 
                              alt={project.company_name}
                              width={24}
                              height={24}
                              className="object-contain p-1"
                            />
                          </div>
                          <span className="text-white/60 text-xs">{project.company_name}</span>
                        </div>
                        <div className="text-white/60 text-xs flex items-center">
                          <Target className="h-3 w-3 mr-1" />
                          {project.progress}%
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full border-purple-500/30 text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-cyan-600/20 hover:border-cyan-500/50 transition-all duration-300"
                      >
                        <span className="mr-2">Xem Chi Tiết</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      
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
            
            <Card className="bg-black/60 border-none shadow-2xl shadow-purple-900/20 backdrop-blur-md overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600"></div>
              
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center animate-pulse">
                  <MessageSquare className="h-10 w-10 text-white" />
                </div>
                
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-6">
                  Quan Tâm Đến Dự Án AI Này?
                </h2>
                
                <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
                  Liên hệ với <span className="text-cyan-400 font-semibold">{projectData.company_name}</span> ngay hôm nay để tìm hiểu thêm về dự án 
                  <span className="text-cyan-400 font-semibold"> {projectData.name}</span> và cách chúng tôi có thể giúp doanh nghiệp của bạn 
                  ứng dụng công nghệ AI tiên tiến.
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
                  
                  <Link href={`/companies/${projectData.company_slug}`}>
                    <Button
                      variant="outline"
                      className="border-purple-500/30 text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-cyan-600/20 hover:border-cyan-500/50 text-lg px-8 py-4 transition-all duration-300 group"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-cyan-400">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                      Xem Công Ty
                    </Button>
                  </Link>
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