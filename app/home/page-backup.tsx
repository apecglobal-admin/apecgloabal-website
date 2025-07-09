import Header from "@/components/header"
import Footer from "@/components/footer"
import HeroCarousel from "@/components/hero-carousel"
import MemberCompanies from "@/components/member-companies"
import HomeStats from "@/components/home-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Target,
  History,
  Crown,
  Users,
  Globe,
  Zap,
  Building2,
  ArrowRight,
  Brain,
  Cpu,
  Network,
  Rocket,
  Star,
  Quote,
  TrendingUp,
  Shield,
  Lightbulb,
  Code,
  Database,
  Cloud,
  Bot,
  Atom,
} from "lucide-react"
import { getAllProjects } from "@/lib/db"
import { Project } from "@/lib/schema"

export default async function HomePage() {
  let dbProjects = []
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
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

      {/* Technology Showcase */}
      <section className="py-12 sm:py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="section-title font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-glow">
              Công Nghệ Tiên Tiến
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto text-lg">
              Chúng tôi áp dụng những công nghệ đột phá nhất để tạo ra các giải pháp vượt trội
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 hover:scale-105 group">
              <CardHeader className="text-center p-6">
                <div className="relative">
                  <Brain className="h-16 w-16 mx-auto text-purple-400 mb-4 group-hover:text-purple-300 transition-colors animate-pulse" />
                  <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <CardTitle className="text-white text-xl">AI & Machine Learning</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-white/80 text-center mb-4">
                  Trí tuệ nhân tạo và học máy để tối ưu hóa quy trình và ra quyết định thông minh
                </p>
                <div className="flex justify-center space-x-2">
                  <Badge className="bg-purple-600/50 text-purple-200 text-xs">Deep Learning</Badge>
                  <Badge className="bg-purple-600/50 text-purple-200 text-xs">NLP</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-blue-500/30 hover:border-blue-400/60 transition-all duration-500 hover:scale-105 group">
              <CardHeader className="text-center p-6">
                <div className="relative">
                  <Network className="h-16 w-16 mx-auto text-blue-400 mb-4 group-hover:text-blue-300 transition-colors animate-pulse" />
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <CardTitle className="text-white text-xl">Blockchain</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-white/80 text-center mb-4">
                  Công nghệ blockchain bảo mật cao cho các giao dịch và hợp đồng thông minh
                </p>
                <div className="flex justify-center space-x-2">
                  <Badge className="bg-blue-600/50 text-blue-200 text-xs">Smart Contracts</Badge>
                  <Badge className="bg-blue-600/50 text-blue-200 text-xs">DeFi</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/40 to-green-800/40 border-green-500/30 hover:border-green-400/60 transition-all duration-500 hover:scale-105 group">
              <CardHeader className="text-center p-6">
                <div className="relative">
                  <Cloud className="h-16 w-16 mx-auto text-green-400 mb-4 group-hover:text-green-300 transition-colors animate-pulse" />
                  <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <CardTitle className="text-white text-xl">Cloud Computing</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-white/80 text-center mb-4">
                  Hạ tầng đám mây linh hoạt và có thể mở rộng cho mọi quy mô doanh nghiệp
                </p>
                <div className="flex justify-center space-x-2">
                  <Badge className="bg-green-600/50 text-green-200 text-xs">AWS</Badge>
                  <Badge className="bg-green-600/50 text-green-200 text-xs">Kubernetes</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto">
          <h2 className="section-title font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Tổng Quan ApecGlobal
          </h2>
          <div className="responsive-grid">
            <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105 group">
              <CardHeader className="text-center p-4 sm:p-6">
                <Target className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-purple-400 mb-3 sm:mb-4 group-hover:animate-pulse" />
                <CardTitle className="text-white text-base sm:text-lg">Tầm Nhìn</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-white/80 text-center text-sm leading-relaxed">
                  Trở thành tập đoàn công nghệ hàng đầu, định hình tương lai số của Việt Nam và khu vực.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105 group">
              <CardHeader className="text-center p-4 sm:p-6">
                <Building2 className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-blue-400 mb-3 sm:mb-4 group-hover:animate-pulse" />
                <CardTitle className="text-white text-base sm:text-lg">Sứ Mệnh</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-white/80 text-center text-sm leading-relaxed">
                  Kết nối và thống nhất hệ sinh thái công nghệ, tạo ra các giải pháp đột phá cho doanh nghiệp.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Member Companies */}
      <MemberCompanies />

      {/* Quick Links */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto">
          <div className="responsive-grid-3">
            <Link href="/projects">
              <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                <CardHeader className="text-center p-4 sm:p-6">
                  <Zap className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-purple-400 mb-3 sm:mb-4" />
                  <CardTitle className="text-white text-base sm:text-lg">Dự Án Hiện Tại</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                  <p className="text-white/80 text-center text-sm">
                    Khám phá các dự án công nghệ tiên tiến đang được phát triển
                  </p>
                  <Badge className="w-full justify-center bg-purple-600 text-white text-xs sm:text-sm">
                    {dbProjects.length}+ Dự án đang triển khai
                  </Badge>
                </CardContent>
              </Card>
            </Link>

            <Link href="/news">
              <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                <CardHeader className="text-center p-4 sm:p-6">
                  <Globe className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-blue-400 mb-3 sm:mb-4" />
                  <CardTitle className="text-white text-base sm:text-lg">Tin Tức & Sự Kiện</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                  <p className="text-white/80 text-center text-sm">
                    Cập nhật tin tức mới nhất và các sự kiện quan trọng
                  </p>
                  <Badge className="w-full justify-center bg-blue-600 text-white text-xs sm:text-sm">
                    Cập nhật hàng ngày
                  </Badge>
                </CardContent>
              </Card>
            </Link>

            <Link href="/contact">
              <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                <CardHeader className="text-center p-4 sm:p-6">
                  <Users className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-green-400 mb-3 sm:mb-4" />
                  <CardTitle className="text-white text-base sm:text-lg">Liên Hệ & Hợp Tác</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                  <p className="text-white/80 text-center text-sm">
                    Kết nối với chúng tôi để khám phá cơ hội hợp tác
                  </p>
                  <Badge className="w-full justify-center bg-green-600 text-white text-xs sm:text-sm">
                    24/7 Hỗ trợ
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}