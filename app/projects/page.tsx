import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PageHeroCarousel from "@/components/page-hero-carousel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Brain,
  Shield,
  Heart,
  Clock,
  Cpu,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  Code,
  Server,
  Database,
  Globe,
  Zap,
  Layers,
  ArrowRight,
  FileText,
} from "lucide-react"
import { getAllProjects } from "@/lib/db"
import { Project } from "@/lib/schema"

// Hàm lấy icon dựa trên công nghệ
const getTechIcon = (technologies: string[]) => {
  if (!technologies || technologies.length === 0) return Brain;
  
  const techString = technologies.join(' ').toLowerCase();
  
  if (techString.includes('ai') || techString.includes('machine learning') || techString.includes('ml')) return Brain;
  if (techString.includes('security') || techString.includes('bảo mật')) return Shield;
  if (techString.includes('analytics') || techString.includes('phân tích')) return TrendingUp;
  if (techString.includes('iot') || techString.includes('edge')) return Cpu;
  if (techString.includes('react') || techString.includes('vue') || techString.includes('angular')) return Code;
  if (techString.includes('node') || techString.includes('express') || techString.includes('backend')) return Server;
  if (techString.includes('sql') || techString.includes('database') || techString.includes('postgres')) return Database;
  if (techString.includes('web') || techString.includes('cloud') || techString.includes('aws')) return Globe;
  if (techString.includes('mobile') || techString.includes('app')) return Layers;
  
  return Zap; // Default icon
}

// Hàm lấy màu gradient dựa trên status
const getStatusGradient = (status: string) => {
  const statusLower = status?.toLowerCase() || '';
  
  if (statusLower.includes('hoàn thành') || statusLower.includes('complete')) 
    return 'from-green-500 to-emerald-500';
  if (statusLower.includes('đang phát triển') || statusLower.includes('progress')) 
    return 'from-blue-500 to-cyan-500';
  if (statusLower.includes('thử nghiệm') || statusLower.includes('beta') || statusLower.includes('testing')) 
    return 'from-orange-500 to-amber-500';
  if (statusLower.includes('nghiên cứu') || statusLower.includes('research')) 
    return 'from-purple-500 to-violet-500';
  if (statusLower.includes('lên kế hoạch') || statusLower.includes('plan')) 
    return 'from-indigo-500 to-purple-500';
  
  return 'from-blue-500 to-cyan-500'; // Default color
}

// Hàm chuyển đổi trạng thái sang tiếng Việt
const translateStatus = (status: string) => {
  const statusLower = status?.toLowerCase() || '';
  
  if (statusLower.includes('complete') || statusLower.includes('completed')) 
    return 'Hoàn thành';
  if (statusLower.includes('progress') || statusLower.includes('in progress')) 
    return 'Đang phát triển';
  if (statusLower.includes('beta') || statusLower.includes('testing')) 
    return 'Thử nghiệm';
  if (statusLower.includes('research')) 
    return 'Nghiên cứu';
  if (statusLower.includes('plan') || statusLower.includes('planning')) 
    return 'Lên kế hoạch';
  if (statusLower.includes('pending')) 
    return 'Chờ xử lý';
  if (statusLower.includes('cancel') || statusLower.includes('cancelled')) 
    return 'Đã hủy';
  if (statusLower.includes('pause') || statusLower.includes('paused')) 
    return 'Tạm dừng';
  
  return status; // Giữ nguyên nếu không khớp
}

export default async function ProjectsPage() {
  // Lấy dữ liệu dự án từ database
  const projectsData = await getAllProjects();
  
  // Chuyển đổi trạng thái sang tiếng Việt
  const projectsWithVietnameseStatus = projectsData.map(project => ({
    ...project,
    status: translateStatus(project.status || '')
  }));

  // Hàm lấy icon dựa trên status
  const getStatusIcon = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower.includes('hoàn thành') || statusLower.includes('complete'))
      return <CheckCircle className="h-5 w-5 text-green-400" />
    if (statusLower.includes('thử nghiệm') || statusLower.includes('beta') || statusLower.includes('testing'))
      return <PlayCircle className="h-5 w-5 text-blue-400" />
    if (statusLower.includes('đang phát triển') || statusLower.includes('progress'))
      return <AlertCircle className="h-5 w-5 text-orange-400" />
    if (statusLower.includes('nghiên cứu') || statusLower.includes('research'))
      return <Brain className="h-5 w-5 text-purple-400" />
    if (statusLower.includes('lên kế hoạch') || statusLower.includes('plan'))
      return <Calendar className="h-5 w-5 text-gray-400" />
    
    return <AlertCircle className="h-5 w-5 text-gray-400" />
  }

  // Hàm lấy màu nền dựa trên status
  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower.includes('hoàn thành') || statusLower.includes('complete'))
      return "bg-green-600"
    if (statusLower.includes('thử nghiệm') || statusLower.includes('beta') || statusLower.includes('testing'))
      return "bg-blue-600"
    if (statusLower.includes('đang phát triển') || statusLower.includes('progress'))
      return "bg-orange-600"
    if (statusLower.includes('nghiên cứu') || statusLower.includes('research'))
      return "bg-purple-600"
    if (statusLower.includes('lên kế hoạch') || statusLower.includes('plan'))
      return "bg-gray-600"
    
    return "bg-gray-600"
  }
  
  // Tính toán số lượng dự án theo trạng thái
  const inProgressCount = projectsWithVietnameseStatus.filter(p => 
    p.status?.toLowerCase().includes('đang phát triển') && 
    p.progress < 100
  ).length;
  
  const completedCount = projectsWithVietnameseStatus.filter(p => 
    p.status?.toLowerCase().includes('hoàn thành') ||
    p.progress === 100
  ).length;

  // Hero slides for Projects page
  const heroSlides = [
    {
      title: "DỰ ÁN CÔNG NGHỆ",
      subtitle: "Khám phá danh mục dự án công nghệ đa dạng của ApecGlobal Group, từ AI và machine learning đến các giải pháp doanh nghiệp tiên tiến",
      gradient: "from-purple-400 via-white to-cyan-400",
      backgroundImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Xem Tất Cả Dự Án",
        href: "#projects-grid",
        gradient: "from-purple-600 to-cyan-600",
        hoverGradient: "from-purple-700 to-cyan-700"
      },
      secondaryButton: {
        text: "Liên Hệ Hợp Tác",
        href: "/contact",
        borderColor: "border-purple-500/50",
        hoverBg: "bg-purple-500/20",
        hoverBorder: "border-purple-400"
      }
    },
    {
      title: "DỰ ÁN AI & MACHINE LEARNING",
      subtitle: "Các dự án tiên phong trong lĩnh vực trí tuệ nhân tạo, từ computer vision đến natural language processing và deep learning",
      gradient: "from-blue-400 via-white to-cyan-400",
      backgroundImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Khám Phá AI Projects",
        href: "#projects-grid",
        gradient: "from-blue-600 to-cyan-600",
        hoverGradient: "from-blue-700 to-cyan-700"
      },
      secondaryButton: {
        text: "Dịch Vụ AI",
        href: "/services",
        borderColor: "border-blue-500/50",
        hoverBg: "bg-blue-500/20",
        hoverBorder: "border-blue-400"
      }
    },
    {
      title: "DỰ ÁN WEB & MOBILE",
      subtitle: "Phát triển ứng dụng web và mobile hiện đại với công nghệ tiên tiến, UX/UI tối ưu và hiệu suất cao",
      gradient: "from-green-400 via-white to-emerald-400",
      backgroundImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Xem Web & Mobile",
        href: "#projects-grid",
        gradient: "from-green-600 to-emerald-600",
        hoverGradient: "from-green-700 to-emerald-700"
      },
      secondaryButton: {
        text: "Yêu Cầu Báo Giá",
        href: "/contact",
        borderColor: "border-green-500/50",
        hoverBg: "bg-green-500/20",
        hoverBorder: "border-green-400"
      }
    },
    {
      title: "DỰ ÁN ENTERPRISE",
      subtitle: "Giải pháp doanh nghiệp quy mô lớn, tích hợp hệ thống phức tạp và tối ưu hóa quy trình kinh doanh",
      gradient: "from-orange-400 via-white to-amber-400",
      backgroundImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Enterprise Solutions",
        href: "#projects-grid",
        gradient: "from-orange-600 to-amber-600",
        hoverGradient: "from-orange-700 to-amber-700"
      },
      secondaryButton: {
        text: "Tư Vấn Chuyên Sâu",
        href: "/contact",
        borderColor: "border-orange-500/50",
        hoverBg: "bg-orange-500/20",
        hoverBorder: "border-orange-400"
      }
    }
  ]

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />

      {/* Hero Carousel Section */}
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 overflow-hidden">
        <div className="hero-carousel-container relative z-10">
          <PageHeroCarousel slides={heroSlides} />
        </div>
      </section>

      {/* Stats Section - AI Style */}
      <section className="section-standard bg-gradient-to-br from-gray-50/50 to-red-50/30">
        <div className="container-standard">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Thống Kê Dự Án
            </div>
            <h2 className="heading-h2 mb-4">
              Tổng Quan <span className="text-red-600">Dự Án</span>
            </h2>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá những con số ấn tượng về các dự án công nghệ mà ApecGlobal Group 
              đã và đang triển khai
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
              <div className="relative card-feature p-8 bg-white rounded-2xl text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-red-600 mb-2">{inProgressCount}</div>
                <div className="text-gray-600">Dự án đang triển khai</div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform"></div>
              <div className="relative card-feature p-8 bg-white rounded-2xl text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-red-600 mb-2">{completedCount}</div>
                <div className="text-gray-600">Dự án hoàn thành</div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
              <div className="relative card-feature p-8 bg-white rounded-2xl text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {projectsData.reduce((sum, project) => sum + (project.team_size || 0), 0)}
                </div>
                <div className="text-gray-600">Chuyên gia tham gia</div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform"></div>
              <div className="relative card-feature p-8 bg-white rounded-2xl text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-red-600 mb-2">{projectsData.length}</div>
                <div className="text-gray-600">Tổng số dự án</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects List - AI Style */}
      <section id="projects-grid" className="section-standard">
        <div className="container-standard">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Code className="w-4 h-4 mr-2" />
              Danh Sách Dự Án
            </div>
            <h2 className="heading-h2 mb-4">
              Dự Án <span className="text-red-600">Công Nghệ</span>
            </h2>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá danh mục dự án công nghệ đa dạng từ AI, machine learning đến 
              các giải pháp doanh nghiệp tiên tiến
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              Tất cả dự án ({projectsData.length})
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              Đang phát triển ({inProgressCount})
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Hoàn thành ({completedCount})
            </div>
          </div>
          
          <div className="space-y-12">
            {projectsWithVietnameseStatus.map((project, index) => {
              const IconComponent = getTechIcon(project.technologies || []);
              const colors = [
                { bg: 'bg-red-100', text: 'text-red-600', gradient: 'from-red-100 to-red-200' },
                { bg: 'bg-blue-100', text: 'text-blue-600', gradient: 'from-blue-100 to-blue-200' },
                { bg: 'bg-green-100', text: 'text-green-600', gradient: 'from-green-100 to-green-200' },
                { bg: 'bg-purple-100', text: 'text-purple-600', gradient: 'from-purple-100 to-purple-200' },
                { bg: 'bg-orange-100', text: 'text-orange-600', gradient: 'from-orange-100 to-orange-200' },
                { bg: 'bg-pink-100', text: 'text-pink-600', gradient: 'from-pink-100 to-pink-200' }
              ]
              const color = colors[index % colors.length]
              
              return (
                <div key={index} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${color.gradient} rounded-2xl transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} group-hover:${index % 2 === 0 ? 'rotate-2' : '-rotate-2'} transition-transform opacity-20`}></div>
                  
                  <div className="relative card-feature p-8 bg-white rounded-2xl">
                    <div className="grid md:grid-cols-3 gap-8">
                      {/* Project Info */}
                      <div className="md:col-span-2 space-y-6">
                        <div className="flex items-start space-x-6">
                          <div className={`w-20 h-20 ${color.bg} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                            <IconComponent className={`h-10 w-10 ${color.text}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <h3 className="heading-h3 text-red-600 group-hover:text-red-700 transition-colors duration-300">
                                {project.name}
                              </h3>
                              <div className="flex items-center space-x-1 bg-gray-100 py-1 px-2 rounded-full">
                                {getStatusIcon(project.status || '')}
                                <span className="text-gray-600 text-sm ml-1">{project.status}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                              <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                {project.company_name || 'ApecTech'}
                              </div>
                              <div className={`inline-flex items-center px-3 py-1 ${getStatusColor(project.status || '')} text-white rounded-full text-sm font-medium`}>
                                {project.status}
                              </div>
                              {project.is_featured && (
                                <div className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                                  Dự án nổi bật
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 leading-relaxed">{project.description}</p>
                        
                        {project.goals && project.goals.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-red-600 font-medium">Mục tiêu dự án:</h4>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                              {project.goals.map((goal, idx) => (
                                <li key={idx}>{goal}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <h4 className="text-red-600 font-medium">Công nghệ sử dụng:</h4>
                          <div className="flex flex-wrap gap-2">
                            {(project.technologies || []).map((tech, idx) => (
                              <div key={idx} className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                {tech}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Project Stats */}
                      <div className="space-y-6">
                        {/* Progress */}
                        <div className="relative">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500 text-sm">Tiến độ dự án</span>
                            <span className="text-red-600 font-medium">{project.progress || 0}%</span>
                          </div>
                          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${color.gradient}`}
                              style={{ width: `${project.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Timeline & Team */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="card-standard p-4">
                            <div className="flex items-center mb-2">
                              <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-gray-500 text-sm">Thời gian</span>
                            </div>
                            <div className="text-red-600 font-medium text-sm">
                              {project.start_date ? new Date(project.start_date).toLocaleDateString('vi-VN', {year: 'numeric', month: 'numeric'}) : ''} - 
                              {project.end_date ? new Date(project.end_date).toLocaleDateString('vi-VN', {year: 'numeric', month: 'numeric'}) : ''}
                            </div>
                          </div>
                          <div className="card-standard p-4">
                            <div className="flex items-center mb-2">
                              <Users className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-gray-500 text-sm">Đội ngũ</span>
                            </div>
                            <div className="text-red-600 font-medium">{project.team_size || 0} người</div>
                          </div>
                          
                          <div className="card-standard p-4">
                            <div className="flex items-center mb-2">
                              <Globe className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-gray-500 text-sm">Địa điểm</span>
                            </div>
                            <div className="text-red-600 font-medium">{project.location || 'Hà Nội'}</div>
                          </div>
                          
                          <div className="card-standard p-4">
                            <div className="flex items-center mb-2">
                              <Zap className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-gray-500 text-sm">Độ ưu tiên</span>
                            </div>
                            <div className="text-red-600 font-medium">
                              {project.priority === 'high' ? 'Cao' : 
                               project.priority === 'medium' ? 'Trung bình' : 
                               project.priority === 'low' ? 'Thấp' : 'Bình thường'}
                            </div>
                          </div>
                        </div>
                        
                        {/* Thông tin bổ sung */}
                        {project.client_name && (
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center mb-2">
                              <Users className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-gray-500 text-sm">Khách hàng</span>
                            </div>
                            <div className="text-red-600 font-medium">{project.client_name}</div>
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 mt-8">
                          <Link href={`/projects/${project.slug}`}>
                            <Button className="btn-primary w-full">
                              Xem Chi Tiết
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          </Link>
                          
                          {project.demo_url && (
                            <Link href={project.demo_url} target="_blank">
                              <Button variant="outline" className="btn-outline w-full">
                                Xem Demo
                                <PlayCircle className="h-4 w-4 ml-2" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-standard bg-gradient-to-br from-gray-50/50 to-red-50/30">
        <div className="container-standard">
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
              
              <div className="relative card-feature p-12 bg-white rounded-2xl text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Brain className="h-10 w-10 text-red-600" />
                </div>
                
                <h2 className="heading-h2 text-red-600 mb-6">
                  Quan Tâm Đến Dự Án AI Của Chúng Tôi?
                </h2>
                
                <p className="text-body-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                  Tìm hiểu thêm về cách <span className="text-red-600 font-semibold">ApecGlobal Group</span> có thể hợp tác 
                  để phát triển các giải pháp công nghệ trí tuệ nhân tạo tiên tiến cho doanh nghiệp của bạn.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link href="/contact">
                    <Button className="btn-primary text-lg px-8 py-4">
                      Liên Hệ Hợp Tác
                      <Users className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  
                  <Button variant="outline" className="btn-outline text-lg px-8 py-4">
                    <FileText className="mr-2 w-5 h-5" />
                    Tải Brochure
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}