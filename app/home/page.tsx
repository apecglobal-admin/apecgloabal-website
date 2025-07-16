import React from "react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import HeroCarousel from "@/components/hero-carousel"
import MemberCompanies from "@/components/member-companies"
import HomeStats from "@/components/home-stats"
import { 
  Star, Quote, ArrowRight, Rocket, Shield, Brain, Network, Cloud, Cpu, Atom, 
  Zap, Target, Building2, History, Crown, Users, Code, Database, 
  Smartphone, Server, Briefcase, UserCheck, MapPin,
  Award, CheckCircle, ExternalLink, Phone, Clock, DollarSign,
  TrendingUp, BarChart3, Activity, Settings,
  Wrench, Headphones, GraduationCap, Coffee, Heart
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
    <div className="min-h-screen bg-white text-black">
      <Header />

      {/* Hero Carousel Section */}
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-white to-gray-50/30"></div>
        <div className="hero-carousel-container relative z-10">
          <HeroCarousel />
        </div>
      </section>

      {/* Stats Section */}
      <HomeStats />

      {/* Giới thiệu công ty */}
      <section className="section-standard bg-gradient-to-br from-gray-50/50 to-red-50/30">
        <div className="container-standard">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                <Building2 className="w-4 h-4 mr-2" />
                Về Chúng Tôi
              </div>
              
              <h2 className="heading-h2 leading-tight">
                Dẫn đầu trong <br />
                <span className="text-red-600 relative">
                  Công nghệ AI
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-red-200 rounded-full"></div>
                </span>
              </h2>
              
              <p className="text-body-lg text-gray-600 leading-relaxed">
                ApecGlobal là tập đoàn công nghệ hàng đầu Việt Nam, được thành lập năm 2020 với sứ mệnh 
                kết nối và thống nhất hệ sinh thái công nghệ. Chúng tôi tập trung vào việc phát triển 
                các <span className="text-red-600 font-semibold">giải pháp công nghệ tiên tiến</span>, từ AI, Blockchain đến IoT và Cloud Computing.
              </p>
              
              <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Đội ngũ chuyên nghiệp</h4>
                  <p className="text-gray-600 text-sm">
                    Hơn <span className="font-semibold text-red-600">500 chuyên gia công nghệ</span> và 5 công ty thành viên, 
                    phục vụ hơn 1000 khách hàng trên toàn quốc.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-row gap-4 pt-4 flex-wrap">
                <Link href="/about" className="flex items-center btn-primary group min-w-[140px]">
                  Tìm Hiểu Thêm
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/contact" className="flex items-center btn-outline group min-w-[140px]">
                  Liên Hệ Ngay
                  <Phone className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl transform rotate-3"></div>
              <div className="relative card-elevated p-8 bg-white rounded-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Thành tựu nổi bật</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center group hover:scale-105 transition-transform">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <History className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="heading-h3 text-red-600 mb-1">2020</div>
                    <div className="text-muted text-body-sm">Năm thành lập</div>
                  </div>
                  <div className="text-center group hover:scale-105 transition-transform">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Building2 className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="heading-h3 text-blue-600 mb-1">5+</div>
                    <div className="text-muted text-body-sm">Công ty thành viên</div>
                  </div>
                  <div className="text-center group hover:scale-105 transition-transform">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="heading-h3 text-green-600 mb-1">500+</div>
                    <div className="text-muted text-body-sm">Chuyên gia</div>
                  </div>
                  <div className="text-center group hover:scale-105 transition-transform">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Heart className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="heading-h3 text-purple-600 mb-1">1000+</div>
                    <div className="text-muted text-body-sm">Khách hàng</div>
                  </div>
                </div>
                <div className="mt-8 card-standard p-4">
                  <h4 className="text-primary font-semibold mb-2 flex items-center">
                    <Award className="icon-standard mr-2" />
                    Thành tựu nổi bật
                  </h4>
                  <ul className="text-muted text-body-sm space-y-1">
                    <li>• <span className="text-primary font-medium">Top 10 công ty công nghệ hàng đầu Việt Nam</span></li>
                    <li>• <span className="text-primary font-medium">Giải thưởng Sao Khuê 2023</span></li>
                    <li>• Chứng nhận ISO 27001:2013</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Technology Showcase */}
        <section className="section-standard">
          <div className="container-standard">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                <Cpu className="w-4 h-4 mr-2" />
                Công Nghệ Của Chúng Tôi
              </div>
              <h2 className="heading-h2 mb-4">
                Giải pháp <span className="text-red-600">Công nghệ Tiên tiến</span>
              </h2>
              <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
                Chúng tôi áp dụng những công nghệ mới nhất để tạo ra các giải pháp đột phá, 
                giúp doanh nghiệp chuyển đổi số thành công.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* AI & Machine Learning */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
                <div className="relative card-feature p-8 bg-white rounded-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Brain className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="heading-h4 mb-4">AI & Machine Learning</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Trí tuệ nhân tạo và học máy để tối ưu hóa quy trình và ra quyết định thông minh
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">Deep Learning</span>
                      <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">NLP</span>
                      <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">Computer Vision</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blockchain */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform"></div>
                <div className="relative card-feature p-8 bg-white rounded-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Network className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="heading-h4 mb-4">Blockchain</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Công nghệ blockchain bảo mật cao cho các giao dịch và hợp đồng thông minh
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">Smart Contracts</span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">DeFi</span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">Web3</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cloud Computing */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
                <div className="relative card-feature p-8 bg-white rounded-2xl">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <Cloud className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="heading-h4 mb-4">Cloud Computing</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        Hạ tầng đám mây linh hoạt và có thể mở rộng cho mọi quy mô doanh nghiệp
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">AWS</span>
                        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">Kubernetes</span>
                        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">Docker</span>
                      </div>
                    </div>
                </div>
              </div>

              {/* IoT */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform"></div>
                <div className="relative card-feature p-8 bg-white rounded-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Cpu className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="heading-h4 mb-4">Internet of Things</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Kết nối thông minh các thiết bị và cảm biến cho hệ sinh thái IoT toàn diện
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">Sensors</span>
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">Edge Computing</span>
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">5G</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cybersecurity */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
                <div className="relative card-feature p-8 bg-white rounded-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Shield className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="heading-h4 mb-4">Bảo Mật Số</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Hệ thống bảo mật đa lớp bảo vệ dữ liệu và giao dịch với độ tin cậy cao nhất
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">Zero Trust</span>
                      <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">Encryption</span>
                      <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">SOC</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantum Computing */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform"></div>
                <div className="relative card-feature p-8 bg-white rounded-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Atom className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h3 className="heading-h4 mb-4">Quantum Computing</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Nghiên cứu và phát triển công nghệ điện toán lượng tử cho tương lai
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">Qubits</span>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">Algorithms</span>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">Research</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dịch vụ chính */}
        <section className="section-gray">
          <div className="container-standard">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
                <Settings className="w-4 h-4 mr-2" />
                Dịch Vụ Của Chúng Tôi
              </div>
              <h2 className="heading-h2 mb-4">
                Giải pháp <span className="text-red-600">Toàn diện</span>
              </h2>
              <p className="text-body-lg text-gray-600 max-w-3xl mx-auto">
                Từ ý tưởng đến sản phẩm hoàn thiện, chúng tôi đồng hành cùng bạn trong mọi giai đoạn 
                phát triển công nghệ với đội ngũ chuyên gia giàu kinh nghiệm.
              </p>
            </div>
            
            <div className="grid-standard">
              {/* Phát triển phần mềm */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
                <div className="relative card-feature p-8 bg-white rounded-2xl">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Code className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="heading-h4 mb-4">Phát Triển Phần Mềm</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Thiết kế và phát triển ứng dụng web, mobile, desktop với công nghệ hiện đại
                    </p>
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          Web Apps
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Mobile Apps
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          Desktop Apps
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                          API Services
                        </div>
                      </div>
                    </div>
                    <Link href="/services/software-development" className="btn-outline group-hover:btn-primary transition-all inline-flex items-center justify-center min-w-[120px]">
                      Xem chi tiết <ExternalLink className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Tư vấn công nghệ */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform"></div>
                <div className="relative card-feature p-8 bg-white rounded-2xl">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Briefcase className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="heading-h4 mb-4">Tư Vấn Công Nghệ</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Tư vấn chiến lược công nghệ, chuyển đổi số và tối ưu hóa quy trình
                    </p>
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          Digital Transform
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Tech Strategy
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          Process Optimize
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                          IT Infrastructure
                        </div>
                      </div>
                    </div>
                    <Link href="/services/consulting" className="btn-outline group-hover:btn-primary transition-all inline-flex items-center justify-center min-w-[120px]">
                      Xem chi tiết <ExternalLink className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Cloud & DevOps */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
                <div className="relative card-feature p-8 bg-white rounded-2xl">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Server className="w-10 h-10 text-purple-600" />
                    </div>
                    <h3 className="heading-h4 mb-4">Cloud & DevOps</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Triển khai và quản lý hạ tầng cloud, CI/CD và monitoring
                    </p>
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          AWS/Azure/GCP
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Docker/K8s
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          CI/CD Pipeline
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                          Monitoring
                        </div>
                      </div>
                    </div>
                    <Link href="/services/cloud-devops" className="btn-outline group-hover:btn-primary transition-all inline-flex items-center justify-center min-w-[120px]">
                      Xem chi tiết <ExternalLink className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* AI & Data Analytics */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform"></div>
                <div className="relative card-feature p-8 bg-white rounded-2xl">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-10 h-10 text-orange-600" />
                    </div>
                    <h3 className="heading-h4 mb-4">AI & Data Analytics</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Phân tích dữ liệu, machine learning và trí tuệ nhân tạo
                    </p>
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          ML Models
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Data Viz
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          Predictive
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                          NLP
                        </div>
                      </div>
                    </div>
                    <Link href="/services/ai-analytics" className="btn-outline group-hover:btn-primary transition-all inline-flex items-center justify-center min-w-[120px]">
                      Xem chi tiết <ExternalLink className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bảo mật & Audit */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
                <div className="relative card-feature p-8 bg-white rounded-2xl">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Shield className="w-10 h-10 text-red-600" />
                    </div>
                    <h3 className="heading-h4 mb-4">Bảo Mật & Audit</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Đánh giá bảo mật, penetration testing và compliance
                    </p>
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          Security Assess
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Pen Testing
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          Compliance
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                          Training
                        </div>
                      </div>
                    </div>
                    <Link href="/services/security-audit" className="btn-outline group-hover:btn-primary transition-all inline-flex items-center justify-center min-w-[120px]">
                      Xem chi tiết <ExternalLink className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Member Companies */}
        <MemberCompanies />

        {/* Company Overview */}
        <section className="section-standard bg-gradient-to-br from-blue-50/30 to-purple-50/30">
          <div className="container-standard">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                <Crown className="w-4 h-4 mr-2" />
                Giá Trị Cốt Lõi
              </div>
              <h2 className="heading-h2 mb-4">
                Tại sao chọn <span className="text-red-600">ApecGlobal</span>?
              </h2>
              <p className="text-body-lg text-gray-600 max-w-3xl mx-auto">
                Chúng tôi không chỉ cung cấp công nghệ, mà còn là đối tác đáng tin cậy 
                trong hành trình chuyển đổi số của doanh nghiệp bạn.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group">
                <div className="card-feature p-8 text-center group-hover:scale-105 transition-transform">
                  <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Target className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="heading-h4 mb-4">Tầm Nhìn</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Trở thành tập đoàn công nghệ hàng đầu, định hình tương lai số của Việt Nam và khu vực.
                  </p>
                </div>
              </div>
              
              <div className="group">
                <div className="card-feature p-8 text-center group-hover:scale-105 transition-transform">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Building2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="heading-h4 mb-4">Sứ Mệnh</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Kết nối và thống nhất hệ sinh thái công nghệ, tạo ra các giải pháp đột phá cho doanh nghiệp.
                  </p>
                </div>
              </div>
              
              <div className="group">
                <div className="card-feature p-8 text-center group-hover:scale-105 transition-transform">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <History className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="heading-h4 mb-4">Lịch Sử</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Thành lập 2020, phát triển từ startup công nghệ thành tập đoàn đa ngành với 5 công ty thành viên.
                  </p>
                </div>
              </div>
              
              <div className="group">
                <div className="card-feature p-8 text-center group-hover:scale-105 transition-transform">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Crown className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="heading-h4 mb-4">Lãnh Đạo</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Đội ngũ lãnh đạo giàu kinh nghiệm với tầm nhìn chiến lược và khả năng thực thi xuất sắc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section-gray">
          <div className="container-standard">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium mb-4">
                <Star className="w-4 h-4 mr-2" />
                Khách Hàng Nói Gì
              </div>
              <h2 className="heading-h2 mb-4">
                Đánh giá từ <span className="text-red-600">Khách hàng</span>
              </h2>
              <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
                Hàng trăm doanh nghiệp đã tin tưởng và đồng hành cùng chúng tôi 
                trong hành trình chuyển đổi số thành công.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="group">
                <div className="card-feature p-8 group-hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Quote className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 italic leading-relaxed">
                    "ApecGlobal đã giúp chúng tôi chuyển đổi số hoàn toàn. Giải pháp AI của họ đã tăng hiệu suất doanh nghiệp lên 300%."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      N
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Nguyễn Văn A</p>
                      <p className="text-gray-500 text-sm">CEO, TechCorp Vietnam</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="group">
                <div className="card-feature p-8 group-hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Quote className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 italic leading-relaxed">
                    "Hệ thống blockchain của ApecGlobal đã mang lại sự bảo mật tuyệt đối cho các giao dịch của chúng tôi. Rất ấn tượng!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      T
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Trần Thị B</p>
                      <p className="text-gray-500 text-sm">CTO, Innovation Hub</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="group">
                <div className="card-feature p-8 group-hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Quote className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 italic leading-relaxed">
                    "Đội ngũ ApecGlobal chuyên nghiệp, nhiệt tình và có tầm nhìn xa. Chúng tôi rất hài lòng về chất lượng dịch vụ."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      L
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Lê Văn C</p>
                      <p className="text-gray-500 text-sm">Director, Smart Solutions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dự án nổi bật */}
        <section className="section-standard bg-gradient-to-br from-green-50/30 to-blue-50/30">
          <div className="container-standard">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
                <Rocket className="w-4 h-4 mr-2" />
                Dự Án Tiêu Biểu
              </div>
              <h2 className="heading-h2 mb-4">
                Dự án <span className="text-red-600">Nổi bật</span>
              </h2>
              <p className="text-body-lg text-gray-600 max-w-3xl mx-auto">
                Những dự án tiêu biểu thể hiện năng lực và kinh nghiệm của ApecGlobal 
                trong việc tạo ra các giải pháp công nghệ đột phá.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Dự án 1 - E-commerce Platform */}
              <div className="group">
                <div className="card-feature overflow-hidden group-hover:scale-105 transition-transform">
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Smartphone className="w-10 h-10 text-blue-600" />
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="heading-h4 mb-3 text-blue-600">E-commerce Platform</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Nền tảng thương mại điện tử với AI recommendation và blockchain payment
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">React</span>
                      <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">Node.js</span>
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">MongoDB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Hoàn thành
                      </div>
                      <Link href="/projects/ecommerce-platform" className="btn-ghost text-sm group-hover:btn-primary transition-all">
                        Chi tiết <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dự án 2 - Smart City IoT */}
              <div className="group">
                <div className="card-feature overflow-hidden group-hover:scale-105 transition-transform">
                  <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Network className="w-10 h-10 text-green-600" />
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="heading-h4 mb-3 text-green-600">Smart City IoT</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Hệ thống IoT quản lý thông minh cho thành phố với 10,000+ sensors
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">IoT</span>
                      <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">AWS</span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">Python</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-blue-600 text-sm font-medium">
                        <Activity className="w-4 h-4 mr-2" />
                        Đang triển khai
                      </div>
                      <Link href="/projects/smart-city-iot" className="btn-ghost text-sm group-hover:btn-primary transition-all">
                        Chi tiết <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dự án 3 - AI Healthcare */}
              <div className="group">
                <div className="card-feature overflow-hidden group-hover:scale-105 transition-transform">
                  <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Brain className="w-10 h-10 text-purple-600" />
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="heading-h4 mb-3 text-purple-600">AI Healthcare System</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Hệ thống AI chẩn đoán y tế với độ chính xác 95% và telemedicine
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">TensorFlow</span>
                      <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">FastAPI</span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">PostgreSQL</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-orange-600 text-sm font-medium">
                        <Settings className="w-4 h-4 mr-2" />
                        Phát triển
                      </div>
                      <Link href="/projects/ai-healthcare" className="btn-ghost text-sm group-hover:btn-primary transition-all">
                        Chi tiết <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dự án 4 - Blockchain Finance */}
              <div className="bg-white rounded-xl border border-gray-200 hover:border-red-300 transition-all duration-500 hover:scale-105 overflow-hidden group shadow-lg hover:shadow-xl">
                <div className="h-48 bg-white flex items-center justify-center shadow-inner">
                  <Database className="h-16 w-16 text-black group-hover:text-red-700 group-hover:scale-110 transition-all" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-red-700">DeFi Trading Platform</h3>
                  <p className="text-black/80 text-sm mb-4">
                    Nền tảng <span className="text-black font-semibold">giao dịch DeFi</span> với smart contracts và yield farming
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-gray-100 text-black px-2 py-1 rounded text-xs font-medium">Solidity</span>
                    <span className="bg-gray-100 text-black px-2 py-1 rounded text-xs font-medium">Web3</span>
                    <span className="bg-gray-100 text-black px-2 py-1 rounded text-xs font-medium">Ethereum</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-green-600 text-sm font-medium">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Hoàn thành
                    </div>
                    <Link href="/projects/defi-platform" className="text-red-700 hover:text-red-600 text-sm flex items-center font-medium">
                      Chi tiết <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Dự án 5 - Cloud Migration */}
              <div className="bg-white rounded-xl border border-gray-200 hover:border-red-300 transition-all duration-500 hover:scale-105 overflow-hidden group shadow-lg hover:shadow-xl">
                <div className="h-48 bg-white flex items-center justify-center shadow-inner">
                  <Cloud className="h-16 w-16 text-black group-hover:text-red-700 group-hover:scale-110 transition-all" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-red-700">Enterprise Cloud Migration</h3>
                  <p className="text-black/80 text-sm mb-4">
                    Migration <span className="text-black font-semibold">500+ servers sang AWS</span> với zero downtime và cost optimization
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-gray-100 text-black px-2 py-1 rounded text-xs font-medium">AWS</span>
                    <span className="bg-gray-100 text-black px-2 py-1 rounded text-xs font-medium">Kubernetes</span>
                    <span className="bg-gray-100 text-black px-2 py-1 rounded text-xs font-medium">Terraform</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-green-600 text-sm font-medium">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Hoàn thành
                    </div>
                    <Link href="/projects/cloud-migration" className="text-red-700 hover:text-red-600 text-sm flex items-center font-medium">
                      Chi tiết <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Dự án 6 - Cybersecurity SOC */}
              <div className="bg-white rounded-xl border border-gray-200 hover:border-red-300 transition-all duration-500 hover:scale-105 overflow-hidden group shadow-lg hover:shadow-xl">
                <div className="h-48 bg-white flex items-center justify-center shadow-inner">
                  <Shield className="h-16 w-16 text-red-700 group-hover:text-red-600 group-hover:scale-110 transition-all" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-red-700">Security Operations Center</h3>
                  <p className="text-black/80 text-sm mb-4">
                    <span className="text-black font-semibold">SOC 24/7</span> với AI threat detection và incident response automation
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-gray-100 text-black px-2 py-1 rounded text-xs font-medium">SIEM</span>
                    <span className="bg-gray-100 text-black px-2 py-1 rounded text-xs font-medium">AI/ML</span>
                    <span className="bg-gray-100 text-black px-2 py-1 rounded text-xs font-medium">SOAR</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-blue-600 text-sm font-medium">
                      <Activity className="h-4 w-4 mr-1" />
                      Vận hành
                    </div>
                    <Link href="/projects/security-soc" className="text-red-700 hover:text-red-600 text-sm flex items-center font-medium">
                      Chi tiết <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/projects" className="px-8 py-3 bg-red-700 rounded-lg text-white font-medium hover:bg-red-800 transition-all inline-flex items-center shadow-lg hover:shadow-xl min-w-[200px] justify-center">
                Xem Tất Cả Dự Án
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-12 sm:py-16 px-4 bg-white shadow-sm">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-red-700">
                Khám Phá <span className="text-red-700">Thêm</span>
              </h2>
              <p className="text-black/70 max-w-2xl mx-auto text-lg">
                Tìm hiểu sâu hơn về các <span className="text-black font-semibold">dịch vụ và giải pháp</span> của ApecGlobal
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/about">
                <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-red-300 transition-all duration-500 hover:scale-105 cursor-pointer h-full group shadow-lg hover:shadow-xl">
                  <div className="text-center">
                    <div className="relative mb-4">
                      <Building2 className="h-12 w-12 mx-auto text-black group-hover:text-red-700 transition-colors" />
                      <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-red-700">Giới Thiệu</h3>
                    <p className="text-black/80 text-center text-sm mb-4">
                      Tìm hiểu về <span className="text-black font-semibold">lịch sử, tầm nhìn và sứ mệnh</span> của ApecGlobal
                    </p>
                    <div className="flex items-center justify-center text-red-700 text-sm font-medium">
                      Khám phá <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/projects">
                <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-red-300 transition-all duration-500 hover:scale-105 cursor-pointer h-full group shadow-lg hover:shadow-xl">
                  <div className="text-center">
                    <div className="relative mb-4">
                      <Zap className="h-12 w-12 mx-auto text-black group-hover:text-red-700 transition-colors" />
                      <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-red-700">Dự Án</h3>
                    <p className="text-black/80 text-center text-sm mb-4">
                      Khám phá các <span className="text-black font-semibold">dự án công nghệ tiên tiến</span> đang triển khai
                    </p>
                    <div className="bg-red-700 text-white px-3 py-1 rounded-full text-xs mb-3 font-medium">
                      {dbProjects.length}+ Dự án
                    </div>
                    <div className="flex items-center justify-center text-red-700 text-sm font-medium">
                      Xem chi tiết <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/services">
                <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-red-300 transition-all duration-500 hover:scale-105 cursor-pointer h-full group shadow-lg hover:shadow-xl">
                  <div className="text-center">
                    <div className="relative mb-4">
                      <Wrench className="h-12 w-12 mx-auto text-black group-hover:text-red-700 transition-colors" />
                      <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-red-700">Dịch Vụ</h3>
                    <p className="text-black/80 text-center text-sm mb-4">
                      <span className="text-black font-semibold">Giải pháp công nghệ toàn diện</span> cho doanh nghiệp
                    </p>
                    <div className="bg-red-700 text-white px-3 py-1 rounded-full text-xs mb-3 font-medium">
                      6+ Dịch vụ
                    </div>
                    <div className="flex items-center justify-center text-red-700 text-sm font-medium">
                      Tìm hiểu <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/careers">
                <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-red-300 transition-all duration-500 hover:scale-105 cursor-pointer h-full group shadow-lg hover:shadow-xl">
                  <div className="text-center">
                    <div className="relative mb-4">
                      <UserCheck className="h-12 w-12 mx-auto text-black group-hover:text-red-700 transition-colors" />
                      <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-red-700">Tuyển Dụng</h3>
                    <p className="text-black/80 text-center text-sm mb-4">
                      <span className="text-black font-semibold">Cơ hội nghề nghiệp</span> tại ApecGlobal
                    </p>
                    <div className="bg-red-700 text-white px-3 py-1 rounded-full text-xs mb-3 font-medium">
                      Hot Jobs
                    </div>
                    <div className="flex items-center justify-center text-red-700 text-sm font-medium">
                      Ứng tuyển <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Tuyển dụng */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-red-700">
                Cơ Hội <span className="text-red-700">Nghề Nghiệp</span>
              </h2>
              <p className="text-black/70 max-w-2xl mx-auto text-lg">
                Gia nhập đội ngũ ApecGlobal - Nơi <span className="text-black font-semibold">tài năng được phát triển</span> và sáng tạo được khuyến khích
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-black">Tại sao chọn <span className="text-red-700">ApecGlobal</span>?</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Heart className="h-6 w-6 text-red-700 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-black font-medium mb-1">Môi trường làm việc tuyệt vời</h4>
                      <p className="text-black/70 text-sm">Văn hóa doanh nghiệp tích cực, đồng nghiệp thân thiện và hỗ trợ lẫn nhau</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <TrendingUp className="h-6 w-6 text-red-700 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-black font-medium mb-1">Cơ hội phát triển</h4>
                      <p className="text-black/70 text-sm">Đào tạo liên tục, thăng tiến rõ ràng và tham gia các dự án công nghệ tiên tiến</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <DollarSign className="h-6 w-6 text-red-700 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-black font-medium mb-1">Lương thưởng hấp dẫn</h4>
                      <p className="text-black/70 text-sm">Mức lương cạnh tranh, thưởng hiệu suất và các phúc lợi đầy đủ</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Coffee className="h-6 w-6 text-red-700 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-black font-medium mb-1">Work-life balance</h4>
                      <p className="text-black/70 text-sm">Flexible working, remote work và các hoạt động team building thú vị</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
                <h3 className="text-xl font-semibold mb-6 text-black text-center">Vị trí đang <span className="text-red-700">tuyển</span></h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-red-300 transition-all shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-black font-medium">Senior Full-stack Developer</h4>
                      <span className="bg-gray-100 text-black px-2 py-1 rounded text-xs font-medium">Hot</span>
                    </div>
                    <div className="flex items-center text-black/70 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      Hà Nội, TP.HCM
                      <Clock className="h-4 w-4 ml-4 mr-1" />
                      Full-time
                    </div>
                    <p className="text-black/60 text-xs mb-3">React, Node.js, MongoDB, 3+ years experience</p>
                    <Link href="/careers/senior-fullstack-developer" className="text-red-700 text-sm hover:text-red-600 flex items-center font-medium">
                      Xem chi tiết <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-red-300 transition-all shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-black font-medium">DevOps Engineer</h4>
                      <span className="bg-gray-100 text-black px-2 py-1 rounded text-xs font-medium">Urgent</span>
                    </div>
                    <div className="flex items-center text-black/70 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      Remote/Hybrid
                      <Clock className="h-4 w-4 ml-4 mr-1" />
                      Full-time
                    </div>
                    <p className="text-black/60 text-xs mb-3">AWS, Kubernetes, Docker, CI/CD, 2+ years</p>
                    <Link href="/careers/devops-engineer" className="text-red-700 text-sm hover:text-red-600 flex items-center font-medium">
                      Xem chi tiết <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-red-300 transition-all shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-black font-medium">AI/ML Engineer</h4>
                      <span className="bg-gray-100 text-black px-2 py-1 rounded text-xs font-medium">New</span>
                    </div>
                    <div className="flex items-center text-black/70 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      Hà Nội
                      <Clock className="h-4 w-4 ml-4 mr-1" />
                      Full-time
                    </div>
                    <p className="text-black/60 text-xs mb-3">Python, TensorFlow, PyTorch, 2+ years</p>
                    <Link href="/careers/ai-ml-engineer" className="text-red-700 text-sm hover:text-red-600 flex items-center font-medium">
                      Xem chi tiết <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <Link href="/careers" className="px-6 py-3 bg-red-700 rounded-lg text-white font-medium hover:bg-red-800 transition-all inline-flex items-center shadow-lg hover:shadow-xl min-w-[180px] justify-center">
                    Xem Tất Cả Vị Trí
                    <UserCheck className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Company culture stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white rounded-lg border border-gray-200 shadow-lg">
                <Users className="h-8 w-8 mx-auto text-red-700 mb-3" />
                <div className="text-2xl font-bold text-red-700 mb-1">500+</div>
                <div className="text-black/70 text-sm">Nhân viên</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg border border-gray-200 shadow-lg">
                <GraduationCap className="h-8 w-8 mx-auto text-red-700 mb-3" />
                <div className="text-2xl font-bold text-red-700 mb-1">95%</div>
                <div className="text-black/70 text-sm">Hài lòng công việc</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg border border-gray-200 shadow-lg">
                <TrendingUp className="h-8 w-8 mx-auto text-red-700 mb-3" />
                <div className="text-2xl font-bold text-red-700 mb-1">40%</div>
                <div className="text-black/70 text-sm">Tăng trưởng hàng năm</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg border border-gray-200 shadow-lg">
                <Award className="h-8 w-8 mx-auto text-red-700 mb-3" />
                <div className="text-2xl font-bold text-red-700 mb-1">Top 10</div>
                <div className="text-black/70 text-sm">Nơi làm việc tốt nhất</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 px-4 relative overflow-hidden bg-white shadow-lg">
          <div className="container mx-auto relative z-10 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-red-700">
                Sẵn Sàng Cho <span className="text-red-700">Tương Lai</span>?
              </h2>
              <p className="text-xl sm:text-2xl text-black/80 mb-8 leading-relaxed">
                Hãy cùng ApecGlobal tạo ra những <span className="text-black font-semibold">giải pháp công nghệ đột phá</span>, định hình tương lai số cho doanh nghiệp của bạn.
              </p>
              
              <div className="flex flex-row gap-6 justify-center items-center mb-12 flex-wrap">
                <Link href="/contact" className="px-8 py-4 bg-red-700 hover:bg-red-800 text-white text-lg rounded-full border-0 hover:scale-110 transform transition-all duration-300 shadow-2xl min-w-[180px] text-center">
                  Bắt Đầu Ngay
                  <Rocket className="ml-3 h-6 w-6 inline" />
                </Link>
                
                <Link href="/about" className="px-8 py-4 bg-white border-2 border-gray-300 text-black hover:bg-white hover:shadow-xl hover:border-red-300 text-lg rounded-full hover:scale-110 transform transition-all duration-300 shadow-2xl min-w-[180px] text-center">
                  Tìm Hiểu Thêm
                  <ArrowRight className="ml-3 h-6 w-6 inline" />
                </Link>
              </div>
              
              {/* Achievement numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-red-700 mb-2">5+</div>
                  <div className="text-black/70 text-sm">Công ty thành viên</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-red-700 mb-2">100+</div>
                  <div className="text-black/70 text-sm">Dự án thành công</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-red-700 mb-2">1000+</div>
                  <div className="text-black/70 text-sm">Khách hàng tin tưởng</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-red-700 mb-2">24/7</div>
                  <div className="text-black/70 text-sm">Hỗ trợ khách hàng</div>
                </div>
              </div>
              
              {/* Tech stack icons */}
              <div className="flex justify-center items-center space-x-8 opacity-60">
                <div className="text-black">
                  <Brain className="h-8 w-8" />
                </div>
                <div className="text-black">
                  <Network className="h-8 w-8" />
                </div>
                <div className="text-black">
                  <Cloud className="h-8 w-8" />
                </div>
                <div className="text-black">
                  <Cpu className="h-8 w-8" />
                </div>
                <div className="text-red-700">
                  <Shield className="h-8 w-8" />
                </div>
                <div className="text-black">
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