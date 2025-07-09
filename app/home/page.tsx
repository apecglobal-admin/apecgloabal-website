import React from "react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import HeroCarousel from "@/components/hero-carousel"
import MemberCompanies from "@/components/member-companies"
import HomeStats from "@/components/home-stats"
import { 
  Star, Quote, ArrowRight, Rocket, Shield, Brain, Network, Cloud, Cpu, Atom, 
  Zap, Target, Building2, History, Crown, Users, Globe, Code, Database, 
  Smartphone, Monitor, Server, Briefcase, UserCheck, MapPin, Calendar,
  Award, CheckCircle, Play, ExternalLink, Mail, Phone, Clock, DollarSign,
  TrendingUp, BarChart3, PieChart, Activity, Settings, Layers, Package,
  Wrench, Headphones, BookOpen, GraduationCap, Coffee, Heart
} from "lucide-react"
import { getAllProjects } from "@/lib/db"

export default async function HomePage() {
  let dbProjects = []
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
    const projectsResponse = await fetch(`${baseUrl}/api/projects`, {
      cache: 'no-store'
    })
    
    if (projectsResponse.ok) {
      const projectsResult = await projectsResponse.json()
      dbProjects = projectsResult.success ? projectsResult.data : projectsResult
    } else {
      console.error('Failed to fetch projects from API')
      dbProjects = await getAllProjects()
    }
  } catch (error) {
    console.error('Error fetching projects from API:', error)
    dbProjects = await getAllProjects()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white">
      <Header />

      {/* Hero Carousel Section */}
      <section className="relative pt-20 lg:pt-24 pb-12 sm:pb-16 lg:pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20"></div>
        <div className="container mx-auto relative z-10">
          <HeroCarousel />
        </div>
      </section>

      {/* Stats Section */}
      <HomeStats />

      {/* Giới thiệu công ty */}
      <section className="py-16 px-4 bg-gradient-to-br from-black/50 to-purple-900/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Về ApecGlobal
              </h2>
              <p className="text-white/80 text-lg mb-6 leading-relaxed">
                ApecGlobal là tập đoàn công nghệ hàng đầu Việt Nam, được thành lập năm 2020 với sứ mệnh 
                kết nối và thống nhất hệ sinh thái công nghệ. Chúng tôi tập trung vào việc phát triển 
                các giải pháp công nghệ tiên tiến, từ AI, Blockchain đến IoT và Cloud Computing.
              </p>
              <p className="text-white/70 mb-8 leading-relaxed">
                Với đội ngũ hơn 500 chuyên gia công nghệ và 5 công ty thành viên, ApecGlobal đã triển khai 
                thành công hơn 100 dự án lớn, phục vụ hơn 1000 khách hàng trên toàn quốc và khu vực.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/about" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center">
                  Tìm Hiểu Thêm
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="/contact" className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-medium hover:bg-white/20 transition-all flex items-center justify-center">
                  Liên Hệ Ngay
                  <Phone className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-8 rounded-2xl border border-purple-500/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">2020</div>
                    <div className="text-white/70 text-sm">Năm thành lập</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">5+</div>
                    <div className="text-white/70 text-sm">Công ty thành viên</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">500+</div>
                    <div className="text-white/70 text-sm">Chuyên gia</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">1000+</div>
                    <div className="text-white/70 text-sm">Khách hàng</div>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-white/5 rounded-lg">
                  <h4 className="text-white font-semibold mb-2 flex items-center">
                    <Award className="h-5 w-5 text-yellow-400 mr-2" />
                    Thành tựu nổi bật
                  </h4>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>• Top 10 công ty công nghệ hàng đầu Việt Nam</li>
                    <li>• Giải thưởng Sao Khuê 2023</li>
                    <li>• Chứng nhận ISO 27001:2013</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Technology Showcase */}
        <section className="py-16 px-4 bg-black/30">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Công Nghệ Tiên Tiến
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* AI & Machine Learning */}
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 p-6 rounded-xl border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 hover:scale-105 group">
                <div className="text-center">
                  <div className="relative mb-6">
                    <Brain className="h-16 w-16 mx-auto text-purple-400 group-hover:text-purple-300 transition-colors" />
                    <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">AI & Machine Learning</h3>
                  <p className="text-white/80 mb-4">
                    Trí tuệ nhân tạo và học máy để tối ưu hóa quy trình và ra quyết định thông minh
                  </p>
                  <div className="flex justify-center space-x-2">
                    <span className="bg-purple-600/50 text-purple-200 px-3 py-1 rounded-full text-xs">Deep Learning</span>
                    <span className="bg-purple-600/50 text-purple-200 px-3 py-1 rounded-full text-xs">NLP</span>
                  </div>
                </div>
              </div>

              {/* Blockchain */}
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 p-6 rounded-xl border border-blue-500/30 hover:border-blue-400/60 transition-all duration-500 hover:scale-105 group">
                <div className="text-center">
                  <div className="relative mb-6">
                    <Network className="h-16 w-16 mx-auto text-blue-400 group-hover:text-blue-300 transition-colors" />
                    <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Blockchain</h3>
                  <p className="text-white/80 mb-4">
                    Công nghệ blockchain bảo mật cao cho các giao dịch và hợp đồng thông minh
                  </p>
                  <div className="flex justify-center space-x-2">
                    <span className="bg-blue-600/50 text-blue-200 px-3 py-1 rounded-full text-xs">Smart Contracts</span>
                    <span className="bg-blue-600/50 text-blue-200 px-3 py-1 rounded-full text-xs">DeFi</span>
                  </div>
                </div>
              </div>

              {/* Cloud Computing */}
              <div className="bg-gradient-to-br from-green-900/40 to-green-800/40 p-6 rounded-xl border border-green-500/30 hover:border-green-400/60 transition-all duration-500 hover:scale-105 group">
                <div className="text-center">
                  <div className="relative mb-6">
                    <Cloud className="h-16 w-16 mx-auto text-green-400 group-hover:text-green-300 transition-colors" />
                    <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Cloud Computing</h3>
                  <p className="text-white/80 mb-4">
                    Hạ tầng đám mây linh hoạt và có thể mở rộng cho mọi quy mô doanh nghiệp
                  </p>
                  <div className="flex justify-center space-x-2">
                    <span className="bg-green-600/50 text-green-200 px-3 py-1 rounded-full text-xs">AWS</span>
                    <span className="bg-green-600/50 text-green-200 px-3 py-1 rounded-full text-xs">Kubernetes</span>
                  </div>
                </div>
              </div>

              {/* IoT */}
              <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/40 p-6 rounded-xl border border-orange-500/30 hover:border-orange-400/60 transition-all duration-500 hover:scale-105 group">
                <div className="text-center">
                  <div className="relative mb-6">
                    <Cpu className="h-16 w-16 mx-auto text-orange-400 group-hover:text-orange-300 transition-colors" />
                    <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Internet of Things</h3>
                  <p className="text-white/80 mb-4">
                    Kết nối thông minh các thiết bị và cảm biến cho hệ sinh thái IoT toàn diện
                  </p>
                  <div className="flex justify-center space-x-2">
                    <span className="bg-orange-600/50 text-orange-200 px-3 py-1 rounded-full text-xs">Sensors</span>
                    <span className="bg-orange-600/50 text-orange-200 px-3 py-1 rounded-full text-xs">Edge Computing</span>
                  </div>
                </div>
              </div>

              {/* Cybersecurity */}
              <div className="bg-gradient-to-br from-red-900/40 to-red-800/40 p-6 rounded-xl border border-red-500/30 hover:border-red-400/60 transition-all duration-500 hover:scale-105 group">
                <div className="text-center">
                  <div className="relative mb-6">
                    <Shield className="h-16 w-16 mx-auto text-red-400 group-hover:text-red-300 transition-colors" />
                    <div className="absolute inset-0 bg-red-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Bảo Mật Số</h3>
                  <p className="text-white/80 mb-4">
                    Hệ thống bảo mật đa lớp bảo vệ dữ liệu và giao dịch với độ tin cậy cao nhất
                  </p>
                  <div className="flex justify-center space-x-2">
                    <span className="bg-red-600/50 text-red-200 px-3 py-1 rounded-full text-xs">Zero Trust</span>
                    <span className="bg-red-600/50 text-red-200 px-3 py-1 rounded-full text-xs">Encryption</span>
                  </div>
                </div>
              </div>

              {/* Quantum Computing */}
              <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-800/40 p-6 rounded-xl border border-indigo-500/30 hover:border-indigo-400/60 transition-all duration-500 hover:scale-105 group">
                <div className="text-center">
                  <div className="relative mb-6">
                    <Atom className="h-16 w-16 mx-auto text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                    <div className="absolute inset-0 bg-indigo-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Quantum Computing</h3>
                  <p className="text-white/80 mb-4">
                    Nghiên cứu và phát triển công nghệ điện toán lượng tử cho tương lai
                  </p>
                  <div className="flex justify-center space-x-2">
                    <span className="bg-indigo-600/50 text-indigo-200 px-3 py-1 rounded-full text-xs">Qubits</span>
                    <span className="bg-indigo-600/50 text-indigo-200 px-3 py-1 rounded-full text-xs">Algorithms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dịch vụ chính */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dịch Vụ Của Chúng Tôi
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto text-lg">
                Cung cấp giải pháp công nghệ toàn diện từ tư vấn, phát triển đến triển khai và bảo trì
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Phát triển phần mềm */}
              <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-6 rounded-xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-500 hover:scale-105 group">
                <div className="text-center">
                  <Code className="h-12 w-12 mx-auto text-blue-400 mb-4 group-hover:animate-pulse" />
                  <h3 className="text-xl font-semibold mb-3 text-white">Phát Triển Phần Mềm</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Thiết kế và phát triển ứng dụng web, mobile, desktop với công nghệ hiện đại
                  </p>
                  <ul className="text-white/70 text-xs space-y-1 mb-4">
                    <li>• Web Application (React, Vue, Angular)</li>
                    <li>• Mobile App (React Native, Flutter)</li>
                    <li>• Desktop App (Electron, .NET)</li>
                    <li>• API & Microservices</li>
                  </ul>
                  <Link href="/services/software-development" className="text-blue-400 text-sm hover:text-blue-300 flex items-center justify-center">
                    Xem chi tiết <ExternalLink className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Tư vấn công nghệ */}
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-500 hover:scale-105 group">
                <div className="text-center">
                  <Briefcase className="h-12 w-12 mx-auto text-purple-400 mb-4 group-hover:animate-pulse" />
                  <h3 className="text-xl font-semibold mb-3 text-white">Tư Vấn Công Nghệ</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Tư vấn chiến lược công nghệ, chuyển đổi số và tối ưu hóa quy trình
                  </p>
                  <ul className="text-white/70 text-xs space-y-1 mb-4">
                    <li>• Digital Transformation</li>
                    <li>• Technology Strategy</li>
                    <li>• Process Optimization</li>
                    <li>• IT Infrastructure</li>
                  </ul>
                  <Link href="/services/consulting" className="text-purple-400 text-sm hover:text-purple-300 flex items-center justify-center">
                    Xem chi tiết <ExternalLink className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Cloud & DevOps */}
              <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 p-6 rounded-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-500 hover:scale-105 group">
                <div className="text-center">
                  <Server className="h-12 w-12 mx-auto text-green-400 mb-4 group-hover:animate-pulse" />
                  <h3 className="text-xl font-semibold mb-3 text-white">Cloud & DevOps</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Triển khai và quản lý hạ tầng cloud, CI/CD và monitoring
                  </p>
                  <ul className="text-white/70 text-xs space-y-1 mb-4">
                    <li>• AWS, Azure, Google Cloud</li>
                    <li>• Docker & Kubernetes</li>
                    <li>• CI/CD Pipeline</li>
                    <li>• Monitoring & Logging</li>
                  </ul>
                  <Link href="/services/cloud-devops" className="text-green-400 text-sm hover:text-green-300 flex items-center justify-center">
                    Xem chi tiết <ExternalLink className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* AI & Data Analytics */}
              <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 p-6 rounded-xl border border-orange-500/20 hover:border-orange-400/40 transition-all duration-500 hover:scale-105 group">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-orange-400 mb-4 group-hover:animate-pulse" />
                  <h3 className="text-xl font-semibold mb-3 text-white">AI & Data Analytics</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Phân tích dữ liệu, machine learning và trí tuệ nhân tạo
                  </p>
                  <ul className="text-white/70 text-xs space-y-1 mb-4">
                    <li>• Machine Learning Models</li>
                    <li>• Data Visualization</li>
                    <li>• Predictive Analytics</li>
                    <li>• Natural Language Processing</li>
                  </ul>
                  <Link href="/services/ai-analytics" className="text-orange-400 text-sm hover:text-orange-300 flex items-center justify-center">
                    Xem chi tiết <ExternalLink className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Bảo mật & Audit */}
              <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 p-6 rounded-xl border border-red-500/20 hover:border-red-400/40 transition-all duration-500 hover:scale-105 group">
                <div className="text-center">
                  <Shield className="h-12 w-12 mx-auto text-red-400 mb-4 group-hover:animate-pulse" />
                  <h3 className="text-xl font-semibold mb-3 text-white">Bảo Mật & Audit</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Đánh giá bảo mật, penetration testing và compliance
                  </p>
                  <ul className="text-white/70 text-xs space-y-1 mb-4">
                    <li>• Security Assessment</li>
                    <li>• Penetration Testing</li>
                    <li>• Compliance Audit</li>
                    <li>• Security Training</li>
                  </ul>
                  <Link href="/services/security" className="text-red-400 text-sm hover:text-red-300 flex items-center justify-center">
                    Xem chi tiết <ExternalLink className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Hỗ trợ & Bảo trì */}
              <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 rounded-xl border border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-500 hover:scale-105 group">
                <div className="text-center">
                  <Headphones className="h-12 w-12 mx-auto text-indigo-400 mb-4 group-hover:animate-pulse" />
                  <h3 className="text-xl font-semibold mb-3 text-white">Hỗ Trợ & Bảo Trì</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Hỗ trợ kỹ thuật 24/7, bảo trì và nâng cấp hệ thống
                  </p>
                  <ul className="text-white/70 text-xs space-y-1 mb-4">
                    <li>• 24/7 Technical Support</li>
                    <li>• System Maintenance</li>
                    <li>• Performance Monitoring</li>
                    <li>• Regular Updates</li>
                  </ul>
                  <Link href="/services/support" className="text-indigo-400 text-sm hover:text-indigo-300 flex items-center justify-center">
                    Xem chi tiết <ExternalLink className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Overview */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Tổng Quan ApecGlobal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white/5 p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
                <div className="text-center">
                  <Target className="h-12 w-12 mx-auto text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">Tầm Nhìn</h3>
                  <p className="text-white/70">
                    Trở thành tập đoàn công nghệ hàng đầu, định hình tương lai số của Việt Nam và khu vực.
                  </p>
                </div>
              </div>
              
              <div className="bg-white/5 p-6 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all">
                <div className="text-center">
                  <Building2 className="h-12 w-12 mx-auto text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">Sứ Mệnh</h3>
                  <p className="text-white/70">
                    Kết nối và thống nhất hệ sinh thái công nghệ, tạo ra các giải pháp đột phá cho doanh nghiệp.
                  </p>
                </div>
              </div>
              
              <div className="bg-white/5 p-6 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all">
                <div className="text-center">
                  <History className="h-12 w-12 mx-auto text-green-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">Lịch Sử</h3>
                  <p className="text-white/70">
                    Thành lập 2020, phát triển từ startup công nghệ thành tập đoàn đa ngành với 5 công ty thành viên.
                  </p>
                </div>
              </div>
              
              <div className="bg-white/5 p-6 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all">
                <div className="text-center">
                  <Crown className="h-12 w-12 mx-auto text-yellow-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">Lãnh Đạo</h3>
                  <p className="text-white/70">
                    Đội ngũ lãnh đạo giàu kinh nghiệm với tầm nhìn chiến lược và khả năng thực thi xuất sắc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4 bg-black/30">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Đánh Giá Từ Khách Hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-6 rounded-xl border border-blue-500/20 hover:border-blue-400/40 transition-all">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-blue-400 mr-3" />
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-white/80 text-sm mb-4 italic">
                  "ApecGlobal đã giúp chúng tôi chuyển đổi số hoàn toàn. Giải pháp AI của họ đã tăng hiệu suất doanh nghiệp lên 300%."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    N
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Nguyễn Văn A</p>
                    <p className="text-white/60 text-xs">CEO, TechCorp Vietnam</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-purple-400 mr-3" />
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-white/80 text-sm mb-4 italic">
                  "Hệ thống blockchain của ApecGlobal đã mang lại sự bảo mật tuyệt đối cho các giao dịch của chúng tôi. Rất ấn tượng!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    T
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Trần Thị B</p>
                    <p className="text-white/60 text-xs">CTO, Innovation Hub</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 p-6 rounded-xl border border-green-500/20 hover:border-green-400/40 transition-all">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-green-400 mr-3" />
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-white/80 text-sm mb-4 italic">
                  "Đội ngũ ApecGlobal chuyên nghiệp, nhiệt tình và có tầm nhìn xa. Chúng tôi rất hài lòng về chất lượng dịch vụ."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    L
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Lê Văn C</p>
                    <p className="text-white/60 text-xs">Director, Smart Solutions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Member Companies */}
        <MemberCompanies />

        {/* Dự án nổi bật */}
        <section className="py-16 px-4 bg-gradient-to-br from-black/30 to-blue-900/20">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Dự Án Nổi Bật
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto text-lg">
                Những dự án tiêu biểu thể hiện năng lực và kinh nghiệm của ApecGlobal
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Dự án 1 - E-commerce Platform */}
              <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl border border-blue-500/30 hover:border-blue-400/60 transition-all duration-500 hover:scale-105 overflow-hidden group">
                <div className="h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                  <Smartphone className="h-16 w-16 text-blue-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">E-commerce Platform</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Nền tảng thương mại điện tử với AI recommendation và blockchain payment
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-600/30 text-blue-200 px-2 py-1 rounded text-xs">React</span>
                    <span className="bg-purple-600/30 text-purple-200 px-2 py-1 rounded text-xs">Node.js</span>
                    <span className="bg-green-600/30 text-green-200 px-2 py-1 rounded text-xs">MongoDB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-yellow-400 text-sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Hoàn thành
                    </div>
                    <Link href="/projects/ecommerce-platform" className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                      Chi tiết <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Dự án 2 - Smart City IoT */}
              <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 rounded-xl border border-green-500/30 hover:border-green-400/60 transition-all duration-500 hover:scale-105 overflow-hidden group">
                <div className="h-48 bg-gradient-to-br from-green-600/20 to-teal-600/20 flex items-center justify-center">
                  <Network className="h-16 w-16 text-green-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">Smart City IoT</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Hệ thống IoT quản lý thông minh cho thành phố với 10,000+ sensors
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-green-600/30 text-green-200 px-2 py-1 rounded text-xs">IoT</span>
                    <span className="bg-blue-600/30 text-blue-200 px-2 py-1 rounded text-xs">AWS</span>
                    <span className="bg-orange-600/30 text-orange-200 px-2 py-1 rounded text-xs">Python</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-green-400 text-sm">
                      <Activity className="h-4 w-4 mr-1" />
                      Đang triển khai
                    </div>
                    <Link href="/projects/smart-city-iot" className="text-green-400 hover:text-green-300 text-sm flex items-center">
                      Chi tiết <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Dự án 3 - AI Healthcare */}
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 hover:scale-105 overflow-hidden group">
                <div className="h-48 bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                  <Brain className="h-16 w-16 text-purple-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">AI Healthcare System</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Hệ thống AI chẩn đoán y tế với độ chính xác 95% và telemedicine
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-purple-600/30 text-purple-200 px-2 py-1 rounded text-xs">TensorFlow</span>
                    <span className="bg-pink-600/30 text-pink-200 px-2 py-1 rounded text-xs">FastAPI</span>
                    <span className="bg-blue-600/30 text-blue-200 px-2 py-1 rounded text-xs">PostgreSQL</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-purple-400 text-sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Phát triển
                    </div>
                    <Link href="/projects/ai-healthcare" className="text-purple-400 hover:text-purple-300 text-sm flex items-center">
                      Chi tiết <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Dự án 4 - Blockchain Finance */}
              <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 rounded-xl border border-yellow-500/30 hover:border-yellow-400/60 transition-all duration-500 hover:scale-105 overflow-hidden group">
                <div className="h-48 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 flex items-center justify-center">
                  <Database className="h-16 w-16 text-yellow-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">DeFi Trading Platform</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Nền tảng giao dịch DeFi với smart contracts và yield farming
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-yellow-600/30 text-yellow-200 px-2 py-1 rounded text-xs">Solidity</span>
                    <span className="bg-orange-600/30 text-orange-200 px-2 py-1 rounded text-xs">Web3</span>
                    <span className="bg-blue-600/30 text-blue-200 px-2 py-1 rounded text-xs">Ethereum</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-yellow-400 text-sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Hoàn thành
                    </div>
                    <Link href="/projects/defi-platform" className="text-yellow-400 hover:text-yellow-300 text-sm flex items-center">
                      Chi tiết <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Dự án 5 - Cloud Migration */}
              <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-xl border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-500 hover:scale-105 overflow-hidden group">
                <div className="h-48 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 flex items-center justify-center">
                  <Cloud className="h-16 w-16 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">Enterprise Cloud Migration</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Migration 500+ servers sang AWS với zero downtime và cost optimization
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-cyan-600/30 text-cyan-200 px-2 py-1 rounded text-xs">AWS</span>
                    <span className="bg-blue-600/30 text-blue-200 px-2 py-1 rounded text-xs">Kubernetes</span>
                    <span className="bg-green-600/30 text-green-200 px-2 py-1 rounded text-xs">Terraform</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-cyan-400 text-sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Hoàn thành
                    </div>
                    <Link href="/projects/cloud-migration" className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center">
                      Chi tiết <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Dự án 6 - Cybersecurity SOC */}
              <div className="bg-gradient-to-br from-red-900/40 to-pink-900/40 rounded-xl border border-red-500/30 hover:border-red-400/60 transition-all duration-500 hover:scale-105 overflow-hidden group">
                <div className="h-48 bg-gradient-to-br from-red-600/20 to-pink-600/20 flex items-center justify-center">
                  <Shield className="h-16 w-16 text-red-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">Security Operations Center</h3>
                  <p className="text-white/80 text-sm mb-4">
                    SOC 24/7 với AI threat detection và incident response automation
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-red-600/30 text-red-200 px-2 py-1 rounded text-xs">SIEM</span>
                    <span className="bg-pink-600/30 text-pink-200 px-2 py-1 rounded text-xs">AI/ML</span>
                    <span className="bg-orange-600/30 text-orange-200 px-2 py-1 rounded text-xs">SOAR</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-red-400 text-sm">
                      <Activity className="h-4 w-4 mr-1" />
                      Vận hành
                    </div>
                    <Link href="/projects/security-soc" className="text-red-400 hover:text-red-300 text-sm flex items-center">
                      Chi tiết <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/projects" className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg text-white font-medium hover:from-orange-700 hover:to-red-700 transition-all inline-flex items-center">
                Xem Tất Cả Dự Án
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-12 sm:py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Khám Phá Thêm
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto text-lg">
                Tìm hiểu sâu hơn về các dịch vụ và giải pháp của ApecGlobal
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/about">
                <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 p-6 rounded-xl border border-blue-500/30 hover:border-blue-400/60 transition-all duration-500 hover:scale-105 cursor-pointer h-full group">
                  <div className="text-center">
                    <div className="relative mb-4">
                      <Building2 className="h-12 w-12 mx-auto text-blue-400 group-hover:text-blue-300 transition-colors" />
                      <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-white">Giới Thiệu</h3>
                    <p className="text-white/80 text-center text-sm mb-4">
                      Tìm hiểu về lịch sử, tầm nhìn và sứ mệnh của ApecGlobal
                    </p>
                    <div className="flex items-center justify-center text-blue-400 text-sm">
                      Khám phá <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/projects">
                <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-6 rounded-xl border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 hover:scale-105 cursor-pointer h-full group">
                  <div className="text-center">
                    <div className="relative mb-4">
                      <Zap className="h-12 w-12 mx-auto text-purple-400 group-hover:text-purple-300 transition-colors" />
                      <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-white">Dự Án</h3>
                    <p className="text-white/80 text-center text-sm mb-4">
                      Khám phá các dự án công nghệ tiên tiến đang triển khai
                    </p>
                    <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs mb-3">
                      {dbProjects.length}+ Dự án
                    </div>
                    <div className="flex items-center justify-center text-purple-400 text-sm">
                      Xem chi tiết <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/services">
                <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 p-6 rounded-xl border border-green-500/30 hover:border-green-400/60 transition-all duration-500 hover:scale-105 cursor-pointer h-full group">
                  <div className="text-center">
                    <div className="relative mb-4">
                      <Wrench className="h-12 w-12 mx-auto text-green-400 group-hover:text-green-300 transition-colors" />
                      <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-white">Dịch Vụ</h3>
                    <p className="text-white/80 text-center text-sm mb-4">
                      Giải pháp công nghệ toàn diện cho doanh nghiệp
                    </p>
                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs mb-3">
                      6+ Dịch vụ
                    </div>
                    <div className="flex items-center justify-center text-green-400 text-sm">
                      Tìm hiểu <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/careers">
                <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 p-6 rounded-xl border border-orange-500/30 hover:border-orange-400/60 transition-all duration-500 hover:scale-105 cursor-pointer h-full group">
                  <div className="text-center">
                    <div className="relative mb-4">
                      <UserCheck className="h-12 w-12 mx-auto text-orange-400 group-hover:text-orange-300 transition-colors" />
                      <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-white">Tuyển Dụng</h3>
                    <p className="text-white/80 text-center text-sm mb-4">
                      Cơ hội nghề nghiệp tại ApecGlobal
                    </p>
                    <div className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs mb-3">
                      Hot Jobs
                    </div>
                    <div className="flex items-center justify-center text-orange-400 text-sm">
                      Ứng tuyển <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Tuyển dụng */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Cơ Hội Nghề Nghiệp
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto text-lg">
                Gia nhập đội ngũ ApecGlobal - Nơi tài năng được phát triển và sáng tạo được khuyến khích
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-white">Tại sao chọn ApecGlobal?</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Heart className="h-6 w-6 text-pink-400 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium mb-1">Môi trường làm việc tuyệt vời</h4>
                      <p className="text-white/70 text-sm">Văn hóa doanh nghiệp tích cực, đồng nghiệp thân thiện và hỗ trợ lẫn nhau</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <TrendingUp className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium mb-1">Cơ hội phát triển</h4>
                      <p className="text-white/70 text-sm">Đào tạo liên tục, thăng tiến rõ ràng và tham gia các dự án công nghệ tiên tiến</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <DollarSign className="h-6 w-6 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium mb-1">Lương thưởng hấp dẫn</h4>
                      <p className="text-white/70 text-sm">Mức lương cạnh tranh, thưởng hiệu suất và các phúc lợi đầy đủ</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Coffee className="h-6 w-6 text-orange-400 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium mb-1">Work-life balance</h4>
                      <p className="text-white/70 text-sm">Flexible working, remote work và các hoạt động team building thú vị</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-8 rounded-2xl border border-purple-500/20">
                <h3 className="text-xl font-semibold mb-6 text-white text-center">Vị trí đang tuyển</h3>
                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-purple-400/40 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-medium">Senior Full-stack Developer</h4>
                      <span className="bg-green-600/30 text-green-200 px-2 py-1 rounded text-xs">Hot</span>
                    </div>
                    <div className="flex items-center text-white/70 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      Hà Nội, TP.HCM
                      <Clock className="h-4 w-4 ml-4 mr-1" />
                      Full-time
                    </div>
                    <p className="text-white/60 text-xs mb-3">React, Node.js, MongoDB, 3+ years experience</p>
                    <Link href="/careers/senior-fullstack-developer" className="text-purple-400 text-sm hover:text-purple-300 flex items-center">
                      Xem chi tiết <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-blue-400/40 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-medium">DevOps Engineer</h4>
                      <span className="bg-blue-600/30 text-blue-200 px-2 py-1 rounded text-xs">Urgent</span>
                    </div>
                    <div className="flex items-center text-white/70 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      Remote/Hybrid
                      <Clock className="h-4 w-4 ml-4 mr-1" />
                      Full-time
                    </div>
                    <p className="text-white/60 text-xs mb-3">AWS, Kubernetes, Docker, CI/CD, 2+ years</p>
                    <Link href="/careers/devops-engineer" className="text-blue-400 text-sm hover:text-blue-300 flex items-center">
                      Xem chi tiết <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-green-400/40 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-medium">AI/ML Engineer</h4>
                      <span className="bg-yellow-600/30 text-yellow-200 px-2 py-1 rounded text-xs">New</span>
                    </div>
                    <div className="flex items-center text-white/70 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      Hà Nội
                      <Clock className="h-4 w-4 ml-4 mr-1" />
                      Full-time
                    </div>
                    <p className="text-white/60 text-xs mb-3">Python, TensorFlow, PyTorch, 2+ years</p>
                    <Link href="/careers/ai-ml-engineer" className="text-green-400 text-sm hover:text-green-300 flex items-center">
                      Xem chi tiết <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <Link href="/careers" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all inline-flex items-center">
                    Xem Tất Cả Vị Trí
                    <UserCheck className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Company culture stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
                <Users className="h-8 w-8 mx-auto text-purple-400 mb-3" />
                <div className="text-2xl font-bold text-white mb-1">500+</div>
                <div className="text-white/70 text-sm">Nhân viên</div>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
                <GraduationCap className="h-8 w-8 mx-auto text-blue-400 mb-3" />
                <div className="text-2xl font-bold text-white mb-1">95%</div>
                <div className="text-white/70 text-sm">Hài lòng công việc</div>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
                <TrendingUp className="h-8 w-8 mx-auto text-green-400 mb-3" />
                <div className="text-2xl font-bold text-white mb-1">40%</div>
                <div className="text-white/70 text-sm">Tăng trưởng hàng năm</div>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
                <Award className="h-8 w-8 mx-auto text-yellow-400 mb-3" />
                <div className="text-2xl font-bold text-white mb-1">Top 10</div>
                <div className="text-white/70 text-sm">Nơi làm việc tốt nhất</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black"></div>
          <div className="container mx-auto relative z-10 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Sẵn Sàng Cho Tương Lai?
                </span>
              </h2>
              <p className="text-xl sm:text-2xl text-white/90 mb-8 leading-relaxed">
                Hãy cùng ApecGlobal tạo ra những giải pháp công nghệ đột phá, định hình tương lai số cho doanh nghiệp của bạn.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                <Link href="/contact" className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white text-lg rounded-full border-0 hover:scale-110 transform transition-all duration-300 shadow-2xl">
                  Bắt Đầu Ngay
                  <Rocket className="ml-3 h-6 w-6 inline" />
                </Link>
                
                <Link href="/about" className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 text-lg rounded-full hover:scale-110 transform transition-all duration-300 shadow-2xl">
                  Tìm Hiểu Thêm
                  <ArrowRight className="ml-3 h-6 w-6 inline" />
                </Link>
              </div>
              
              {/* Achievement numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-2">5+</div>
                  <div className="text-white/80 text-sm">Công ty thành viên</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">100+</div>
                  <div className="text-white/80 text-sm">Dự án thành công</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-green-400 mb-2">1000+</div>
                  <div className="text-white/80 text-sm">Khách hàng tin tưởng</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-2">24/7</div>
                  <div className="text-white/80 text-sm">Hỗ trợ khách hàng</div>
                </div>
              </div>
              
              {/* Tech stack icons */}
              <div className="flex justify-center items-center space-x-8 opacity-60">
                <div className="text-purple-400">
                  <Brain className="h-8 w-8" />
                </div>
                <div className="text-blue-400">
                  <Network className="h-8 w-8" />
                </div>
                <div className="text-green-400">
                  <Cloud className="h-8 w-8" />
                </div>
                <div className="text-yellow-400">
                  <Cpu className="h-8 w-8" />
                </div>
                <div className="text-red-400">
                  <Shield className="h-8 w-8" />
                </div>
                <div className="text-indigo-400">
                  <Atom className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>
        </section>

      <Footer />
    </div>
  )
}