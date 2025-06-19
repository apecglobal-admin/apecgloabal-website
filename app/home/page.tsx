"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Building2,
  Target,
  History,
  Crown,
  Brain,
  Shield,
  Heart,
  Clock,
  Cpu,
  ExternalLink,
  ArrowRight,
  Users,
  Globe,
  Zap,
} from "lucide-react"

export default function HomePage() {
  const memberCompanies = [
    {
      name: "ApecTech",
      icon: Brain,
      description: "AI và học tập số",
      color: "from-blue-500 to-cyan-500",
      href: "/companies/apectech",
    },
    {
      name: "GuardCam",
      icon: Shield,
      description: "Bảo mật công nghệ",
      color: "from-green-500 to-emerald-500",
      href: "/companies/guardcam",
    },
    {
      name: "EmoCommerce",
      icon: Heart,
      description: "Thương mại điện tử cảm xúc",
      color: "from-pink-500 to-rose-500",
      href: "/companies/emocommerce",
    },
    {
      name: "TimeLoop",
      icon: Clock,
      description: "Phân tích hành vi và thời gian",
      color: "from-orange-500 to-amber-500",
      href: "/companies/timeloop",
    },
    {
      name: "ApecNeuroOS",
      icon: Cpu,
      description: "Hệ điều hành doanh nghiệp tương lai",
      color: "from-purple-500 to-violet-500",
      href: "/companies/apecneuroos",
    },
  ]

  const stats = [
    { label: "Công ty thành viên", value: "5+", icon: Building2 },
    { label: "Nhân viên", value: "200+", icon: Users },
    { label: "Dự án hoàn thành", value: "50+", icon: Zap },
    { label: "Quốc gia", value: "3+", icon: Globe },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 lg:pt-24 pb-12 sm:pb-16 lg:pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-fade-in-up max-w-5xl mx-auto">
            <h1 className="hero-title font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 via-white to-blue-400 bg-clip-text text-transparent animate-glow">
              ApecGlobal Group
            </h1>
            <p className="hero-subtitle text-white/80 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              Thống nhất hệ sinh thái công nghệ, tạo ra tương lai số cho Việt Nam và khu vực
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Link href="/about">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 hover:scale-105 transform transition-all duration-300">
                  Khám Phá Ngay
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link href="/internal">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20 hover:border-purple-400 hover:text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 hover:scale-105 transform transition-all duration-300"
                >
                  Cổng Nội Bộ
                  <ExternalLink className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 lg:py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card
                  key={index}
                  className="bg-black/50 border-purple-500/30 text-center hover:scale-105 transition-all duration-300 p-4 sm:p-6"
                >
                  <CardContent className="p-3 sm:p-6">
                    <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-purple-400 mb-3 sm:mb-4" />
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">{stat.value}</div>
                    <div className="text-white/60 text-xs sm:text-sm">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
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
            <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center p-4 sm:p-6">
                <Target className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-purple-400 mb-3 sm:mb-4" />
                <CardTitle className="text-white text-base sm:text-lg">Tầm Nhìn</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-white/80 text-center text-sm leading-relaxed">
                  Trở thành tập đoàn công nghệ hàng đầu, định hình tương lai số của Việt Nam và khu vực.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center p-4 sm:p-6">
                <Building2 className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-blue-400 mb-3 sm:mb-4" />
                <CardTitle className="text-white text-base sm:text-lg">Sứ Mệnh</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-white/80 text-center text-sm leading-relaxed">
                  Kết nối và thống nhất hệ sinh thái công nghệ, tạo ra các giải pháp đột phá cho doanh nghiệp.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center p-4 sm:p-6">
                <History className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-green-400 mb-3 sm:mb-4" />
                <CardTitle className="text-white text-base sm:text-lg">Lịch Sử</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-white/80 text-center text-sm leading-relaxed">
                  Thành lập 2020, phát triển từ startup công nghệ thành tập đoàn đa ngành với 5 công ty thành viên.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center p-4 sm:p-6">
                <Crown className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-yellow-400 mb-3 sm:mb-4" />
                <CardTitle className="text-white text-base sm:text-lg">Lãnh Đạo</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-white/80 text-center text-sm leading-relaxed">
                  Đội ngũ lãnh đạo giàu kinh nghiệm với tầm nhìn chiến lược và khả năng thực thi xuất sắc.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Member Companies Preview */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="section-title font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Công Ty Thành Viên
            </h2>
            <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto">
              Khám phá hệ sinh thái công nghệ đa dạng của ApecGlobal
            </p>
          </div>

          <div className="responsive-grid-3 mb-6 sm:mb-8">
            {memberCompanies.slice(0, 3).map((company) => {
              const IconComponent = company.icon
              return (
                <Link key={company.name} href={company.href}>
                  <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                    <CardHeader className="text-center p-4 sm:p-6">
                      <div
                        className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-gradient-to-r ${company.color} flex items-center justify-center mb-3 sm:mb-4`}
                      >
                        <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <CardTitle className="text-white text-base sm:text-lg">{company.name}</CardTitle>
                      <p className="text-white/60 text-sm">{company.description}</p>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                      <Button
                        variant="outline"
                        className="w-full bg-transparent border-2 border-purple-500/50 text-white hover:bg-purple-500/20 hover:border-purple-400 hover:text-white text-sm"
                      >
                        Tìm Hiểu Thêm
                        <ExternalLink className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          <div className="text-center">
            <Link href="/companies">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 px-6 sm:px-8 py-3 hover:scale-105 transform transition-all duration-300">
                Xem Tất Cả Công Ty
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
                    15+ Dự án đang triển khai
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
                  <p className="text-white/80 text-center text-sm">Kết nối với chúng tôi để khám phá cơ hội hợp tác</p>
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
