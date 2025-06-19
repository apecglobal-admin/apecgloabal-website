import Header from "@/components/header"
import Footer from "@/components/footer"
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
} from "lucide-react"

export default function ProjectsPage() {
  const projects = [
    {
      title: "Nền tảng AI Giáo dục Thông minh",
      company: "ApecTech",
      icon: Brain,
      status: "Đang phát triển",
      progress: 75,
      description: "Hệ thống học tập cá nhân hóa sử dụng AI để tối ưu hóa trải nghiệm giáo dục cho từng học viên.",
      timeline: "Q1 2024 - Q3 2024",
      team: "15 người",
      technologies: ["Machine Learning", "NLP", "React", "Python"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Hệ thống Bảo mật Thông minh IoT",
      company: "GuardCam",
      icon: Shield,
      status: "Beta Testing",
      progress: 90,
      description: "Giải pháp bảo mật toàn diện cho các thiết bị IoT với khả năng phát hiện và ngăn chặn tự động.",
      timeline: "Q2 2023 - Q1 2024",
      team: "12 người",
      technologies: ["Computer Vision", "IoT", "Edge Computing", "Blockchain"],
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Phân tích Cảm xúc Khách hàng Real-time",
      company: "EmoCommerce",
      icon: Heart,
      status: "Hoàn thành",
      progress: 100,
      description: "Công cụ phân tích cảm xúc khách hàng trong thời gian thực để tối ưu hóa trải nghiệm mua sắm.",
      timeline: "Q3 2023 - Q4 2023",
      team: "10 người",
      technologies: ["Emotion AI", "Computer Vision", "Real-time Analytics", "Node.js"],
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "Dashboard Phân tích Hành vi Người dùng",
      company: "TimeLoop",
      icon: Clock,
      status: "Đang phát triển",
      progress: 60,
      description: "Bảng điều khiển trực quan để theo dõi và phân tích hành vi người dùng trên các nền tảng số.",
      timeline: "Q4 2023 - Q2 2024",
      team: "8 người",
      technologies: ["Data Analytics", "D3.js", "Python", "PostgreSQL"],
      color: "from-orange-500 to-amber-500",
    },
    {
      title: "ApecNeuroOS Core Engine",
      company: "ApecNeuroOS",
      icon: Cpu,
      status: "Nghiên cứu",
      progress: 30,
      description: "Nhân hệ điều hành thông minh với khả năng tự học và tối ưu hóa tự động cho doanh nghiệp.",
      timeline: "Q1 2024 - Q4 2024",
      team: "20 người",
      technologies: ["Operating Systems", "AI/ML", "Rust", "Kubernetes"],
      color: "from-purple-500 to-violet-500",
    },
    {
      title: "Nền tảng Tích hợp API Thống nhất",
      company: "ApecGlobal",
      icon: TrendingUp,
      status: "Lên kế hoạch",
      progress: 15,
      description: "API Gateway thống nhất để kết nối tất cả các sản phẩm trong hệ sinh thái ApecGlobal.",
      timeline: "Q2 2024 - Q1 2025",
      team: "25 người",
      technologies: ["Microservices", "GraphQL", "Docker", "AWS"],
      color: "from-indigo-500 to-purple-500",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Hoàn thành":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "Beta Testing":
        return <PlayCircle className="h-5 w-5 text-blue-400" />
      case "Đang phát triển":
        return <AlertCircle className="h-5 w-5 text-orange-400" />
      case "Nghiên cứu":
        return <Brain className="h-5 w-5 text-purple-400" />
      case "Lên kế hoạch":
        return <Calendar className="h-5 w-5 text-gray-400" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hoàn thành":
        return "bg-green-600"
      case "Beta Testing":
        return "bg-blue-600"
      case "Đang phát triển":
        return "bg-orange-600"
      case "Nghiên cứu":
        return "bg-purple-600"
      case "Lên kế hoạch":
        return "bg-gray-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <Header />

      {/* Hero Section - AI Style */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Background Animation Effect */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 opacity-20" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '24px 24px'
          }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-black/80 to-black/90"></div>
        </div>
        
        {/* Floating Circuit Lines */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute w-full h-full animate-slide" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        {/* AI Nodes Animation */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-cyan-400/40 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                boxShadow: '0 0 10px 2px rgba(45, 212, 191, 0.3)'
              }}
            ></div>
          ))}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-400/40 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                boxShadow: '0 0 10px 2px rgba(139, 92, 246, 0.3)'
              }}
            ></div>
          ))}
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-block mb-6 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-30 animate-pulse"></div>
            <h1 className="relative text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Dự Án AI Tiêu Biểu
            </h1>
          </div>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed">
            Khám phá các dự án công nghệ trí tuệ nhân tạo tiên tiến đang được phát triển bởi các công ty thành viên trong hệ sinh thái
            <span className="text-cyan-400 font-semibold"> ApecGlobal Group</span>.
          </p>
        </div>
      </section>

      {/* Projects Overview - AI Style */}
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
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:animate-pulse">6</div>
                  <div className="text-white/60">Dự án AI đang triển khai</div>
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
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:animate-pulse">1</div>
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
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:animate-pulse">90+</div>
                  <div className="text-white/60">Chuyên gia AI tham gia</div>
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
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:animate-pulse">18</div>
                  <div className="text-white/60">Tháng nghiên cứu & phát triển</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Projects List - AI Style */}
      <section className="py-20 px-4 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-cyan-900/5 to-black/0"></div>
        
        <div className="container mx-auto relative">
          <div className="flex items-center justify-between mb-16">
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
                Dự Án AI Đang Triển Khai
              </h2>
            </div>
            <div className="hidden md:block h-[1px] w-1/3 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
          </div>
          
          <div className="space-y-16 stagger-animation">
            {projects.map((project, index) => {
              const IconComponent = project.icon
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
                            className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${project.color} flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-900/20 group-hover:scale-110 transition-transform duration-500`}
                          >
                            <IconComponent className="h-10 w-10 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                                {project.title}
                              </h3>
                              <div className="flex items-center space-x-1 bg-black/30 py-1 px-2 rounded-full border border-purple-500/20">
                                {getStatusIcon(project.status)}
                                <span className="text-white/80 text-xs ml-1">{project.status}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                              <Badge 
                                variant="outline" 
                                className="border-purple-500/30 text-purple-300 bg-black/30 px-3 py-1 rounded-full"
                              >
                                {project.company}
                              </Badge>
                              <Badge 
                                className={`${getStatusColor(project.status)} px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider`}
                              >
                                {project.status}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <p className="text-white/80 leading-relaxed text-lg">{project.description}</p>

                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, idx) => (
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

                      {/* Project Details */}
                      <div className="space-y-6">
                        {/* Progress */}
                        <div className="relative">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-xl blur opacity-30"></div>
                          <div className="relative bg-black/60 rounded-xl p-6 backdrop-blur-sm">
                            <div className="flex justify-between text-sm mb-3">
                              <span className="text-white/60">Tiến độ dự án</span>
                              <span className="text-white font-medium">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-black/50 rounded-full h-3 overflow-hidden border border-purple-500/20">
                              <div
                                className={`bg-gradient-to-r ${project.color} h-3 rounded-full transition-all duration-1000 relative`}
                                style={{ width: `${project.progress}%` }}
                              >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-black/30 rounded-xl p-5 border border-purple-500/20 backdrop-blur-sm group-hover:border-cyan-500/30 transition-colors duration-300">
                          <div className="flex items-center space-x-2 mb-2">
                            <Calendar className="h-5 w-5 text-cyan-400" />
                            <span className="text-white/60 text-sm">Thời gian triển khai</span>
                          </div>
                          <span className="text-white font-medium">{project.timeline}</span>
                        </div>

                        {/* Team Size */}
                        <div className="bg-black/30 rounded-xl p-5 border border-purple-500/20 backdrop-blur-sm group-hover:border-cyan-500/30 transition-colors duration-300">
                          <div className="flex items-center space-x-2 mb-2">
                            <Users className="h-5 w-5 text-cyan-400" />
                            <span className="text-white/60 text-sm">Đội ngũ phát triển</span>
                          </div>
                          <span className="text-white font-medium">{project.team}</span>
                        </div>

                        <Button
                          className={`w-full bg-gradient-to-r ${project.color} hover:opacity-90 transition-all duration-300 shadow-lg shadow-purple-900/20 group`}
                        >
                          <span className="mr-2">Xem Chi Tiết</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </Button>
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
