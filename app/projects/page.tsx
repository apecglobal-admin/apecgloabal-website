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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <Header />

      {/* Hero Carousel Section */}
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20"></div>
        <div className="container mx-auto relative z-10">
          <PageHeroCarousel slides={heroSlides} />
        </div>
      </section>

      {/* Stats Section - AI Style */}
      <section className="py-20 px-4 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-purple-900/5 to-black/0"></div>
        
        <div className="container mx-auto relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group">
              <Card className="bg-black/50 border-purple-500/30 hover:border-cyan-500/50 text-center transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-8 relative">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-purple-600/20 to-cyan-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <TrendingUp className="h-8 w-8 text-purple-400" />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:animate-pulse">{inProgressCount}</div>
                  <div className="text-white/60">Dự án đang triển khai</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="group">
              <Card className="bg-black/50 border-purple-500/30 hover:border-cyan-500/50 text-center transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-8 relative">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-purple-600/20 to-cyan-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:animate-pulse">{completedCount}</div>
                  <div className="text-white/60">Dự án hoàn thành</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="group">
              <Card className="bg-black/50 border-purple-500/30 hover:border-cyan-500/50 text-center transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-8 relative">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-purple-600/20 to-cyan-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <Users className="h-8 w-8 text-cyan-400" />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:animate-pulse">
                    {projectsData.reduce((sum, project) => sum + (project.team_size || 0), 0)}
                  </div>
                  <div className="text-white/60">Chuyên gia tham gia</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="group">
              <Card className="bg-black/50 border-purple-500/30 hover:border-cyan-500/50 text-center transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-8 relative">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-purple-600/20 to-cyan-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <Calendar className="h-8 w-8 text-orange-400" />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:animate-pulse">{projectsData.length}</div>
                  <div className="text-white/60">Tổng số dự án</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Projects List - AI Style */}
      <section id="projects-grid" className="py-20 px-4 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-cyan-900/5 to-black/0"></div>
        
        <div className="container mx-auto relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-16 gap-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center mr-4 shadow-lg shadow-purple-900/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                Danh Sách Dự Án
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Badge 
                variant="outline" 
                className="border-purple-500/30 text-purple-300 bg-black/30 px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-purple-900/20 transition-colors"
              >
                Tất cả dự án ({projectsData.length})
              </Badge>
              <Badge 
                variant="outline" 
                className="border-cyan-500/30 text-cyan-300 bg-black/30 px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-cyan-900/20 transition-colors"
              >
                Đang phát triển ({inProgressCount})
              </Badge>
              <Badge 
                variant="outline" 
                className="border-green-500/30 text-green-300 bg-black/30 px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-green-900/20 transition-colors"
              >
                Hoàn thành ({completedCount})
              </Badge>
            </div>
          </div>
          
          <div className="space-y-16 stagger-animation">
            {projectsWithVietnameseStatus.map((project, index) => {
              const IconComponent = getTechIcon(project.technologies || []);
              const colorGradient = getStatusGradient(project.status || '');
              return (
                <div key={index} className="relative group">
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-purple-500/30 rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-cyan-500/30 rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <Card
                    className="bg-black/50 border-purple-500/30 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden"
                  >
                    <div className="grid md:grid-cols-3 gap-8 p-8">
                      {/* Project Info */}
                      <div className="md:col-span-2 space-y-8">
                        <div className="flex items-start space-x-6">
                          <div
                            className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${colorGradient} flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-900/20 group-hover:scale-110 transition-transform duration-500`}
                          >
                            <IconComponent className="h-10 w-10 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                                {project.name}
                              </h3>
                              <div className="flex items-center space-x-1 bg-black/30 py-1 px-2 rounded-full border border-purple-500/20">
                                {getStatusIcon(project.status || '')}
                                <span className="text-white/80 text-xs ml-1">{project.status}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                              <Badge 
                                variant="outline" 
                                className="border-purple-500/30 text-purple-300 bg-black/30 px-3 py-1 rounded-full"
                              >
                                {project.company_name || 'ApecTech'}
                              </Badge>
                              <Badge 
                                className={`${getStatusColor(project.status || '')} px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider`}
                              >
                                {project.status}
                              </Badge>
                              {project.is_featured && (
                                <Badge 
                                  className="bg-amber-600 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider"
                                >
                                  Dự án nổi bật
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-white/80 leading-relaxed">{project.description}</p>
                        
                        {project.goals && project.goals.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-white/90 font-medium">Mục tiêu dự án:</h4>
                            <ul className="list-disc list-inside text-white/70 space-y-1">
                              {project.goals.map((goal, idx) => (
                                <li key={idx}>{goal}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <h4 className="text-white/90 font-medium">Công nghệ sử dụng:</h4>
                          <div className="flex flex-wrap gap-2">
                            {(project.technologies || []).map((tech, idx) => (
                              <Badge 
                                key={idx} 
                                variant="outline" 
                                className="border-cyan-500/30 text-cyan-300 bg-black/30 hover:bg-cyan-900/20 transition-colors duration-300 cursor-default"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Project Stats */}
                      <div className="space-y-6">
                        {/* Progress */}
                        <div className="relative">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white/80 text-sm">Tiến độ dự án</span>
                            <span className="text-cyan-400 font-medium">{project.progress || 0}%</span>
                          </div>
                          <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${colorGradient}`}
                              style={{ width: `${project.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Timeline & Team */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-black/30 p-4 rounded-xl border border-purple-500/20">
                            <div className="flex items-center mb-2">
                              <Calendar className="h-4 w-4 text-purple-400 mr-2" />
                              <span className="text-white/80 text-sm">Thời gian</span>
                            </div>
                            <div className="text-white font-medium">
                              {project.start_date ? new Date(project.start_date).toLocaleDateString('vi-VN', {year: 'numeric', month: 'numeric'}) : ''} - 
                              {project.end_date ? new Date(project.end_date).toLocaleDateString('vi-VN', {year: 'numeric', month: 'numeric'}) : ''}
                            </div>
                          </div>
                          <div className="bg-black/30 p-4 rounded-xl border border-purple-500/20">
                            <div className="flex items-center mb-2">
                              <Users className="h-4 w-4 text-cyan-400 mr-2" />
                              <span className="text-white/80 text-sm">Đội ngũ</span>
                            </div>
                            <div className="text-white font-medium">{project.team_size || 0} người</div>
                          </div>
                          
                          <div className="bg-black/30 p-4 rounded-xl border border-purple-500/20">
                            <div className="flex items-center mb-2">
                              <Globe className="h-4 w-4 text-green-400 mr-2" />
                              <span className="text-white/80 text-sm">Địa điểm</span>
                            </div>
                            <div className="text-white font-medium">{project.location || 'Hà Nội'}</div>
                          </div>
                          
                          <div className="bg-black/30 p-4 rounded-xl border border-purple-500/20">
                            <div className="flex items-center mb-2">
                              <Zap className="h-4 w-4 text-yellow-400 mr-2" />
                              <span className="text-white/80 text-sm">Độ ưu tiên</span>
                            </div>
                            <div className="text-white font-medium">
                              {project.priority === 'high' ? 'Cao' : 
                               project.priority === 'medium' ? 'Trung bình' : 
                               project.priority === 'low' ? 'Thấp' : 'Bình thường'}
                            </div>
                          </div>
                        </div>
                        
                        {/* Thông tin bổ sung */}
                        {project.client_name && (
                          <div className="bg-black/30 p-4 rounded-xl border border-purple-500/20">
                            <div className="flex items-center mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-blue-400 mr-2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                              <span className="text-white/80 text-sm">Khách hàng</span>
                            </div>
                            <div className="text-white font-medium">{project.client_name}</div>
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 mt-8">
                          <Link href={`/projects/${project.slug}`}>
                            <Button
                              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white transition-all duration-300 shadow-lg shadow-purple-900/30 w-full"
                            >
                              Xem Chi Tiết
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                              </svg>
                            </Button>
                          </Link>
                          
                          {project.demo_url && (
                            <Link href={project.demo_url} target="_blank">
                              <Button
                                variant="outline"
                                className="border-purple-500/30 text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-cyan-600/20 hover:border-cyan-500/50 transition-all duration-300 w-full"
                              >
                                Xem Demo
                                <PlayCircle className="h-4 w-4 ml-2" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )
            })}
          </div>
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
            
            <Card className="bg-black/60 border-none shadow-2xl shadow-purple-900/20 backdrop-blur-md overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600"></div>
              
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center animate-pulse">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-6">
                  Quan Tâm Đến Dự Án AI Của Chúng Tôi?
                </h2>
                
                <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
                  Tìm hiểu thêm về cách <span className="text-cyan-400 font-semibold">ApecGlobal Group</span> có thể hợp tác 
                  để phát triển các giải pháp công nghệ trí tuệ nhân tạo tiên tiến cho doanh nghiệp của bạn.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                    <Button className="relative bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-lg px-8 py-4 transition-all duration-300 shadow-lg shadow-purple-900/30">
                      Liên Hệ Hợp Tác
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="border-purple-500/30 text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-cyan-600/20 hover:border-cyan-500/50 text-lg px-8 py-4 transition-all duration-300 group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-cyan-400">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Tải Brochure
                  </Button>
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