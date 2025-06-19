"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  Calendar,
  ImageIcon,
  FileText,
} from "lucide-react"

export default function PublicPortal() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)

  const memberCompanies = [
    {
      name: "ApecTech",
      icon: Brain,
      description: "AI và học tập số",
      color: "from-blue-500 to-cyan-500",
      details: "Phát triển các giải pháp AI tiên tiến và nền tảng học tập số thông minh.",
    },
    {
      name: "GuardCam",
      icon: Shield,
      description: "Bảo mật công nghệ",
      color: "from-green-500 to-emerald-500",
      details: "Hệ thống bảo mật và giám sát thông minh dựa trên công nghệ tiên tiến.",
    },
    {
      name: "EmoCommerce",
      icon: Heart,
      description: "Thương mại điện tử cảm xúc",
      color: "from-pink-500 to-rose-500",
      details: "Nền tảng thương mại điện tử tích hợp AI phân tích cảm xúc khách hàng.",
    },
    {
      name: "TimeLoop",
      icon: Clock,
      description: "Phân tích hành vi và thời gian",
      color: "from-orange-500 to-amber-500",
      details: "Công cụ phân tích hành vi người dùng và tối ưu hóa thời gian.",
    },
    {
      name: "ApecNeuroOS",
      icon: Cpu,
      description: "Hệ điều hành doanh nghiệp tương lai",
      color: "from-purple-500 to-violet-500",
      details: "Hệ điều hành thông minh cho doanh nghiệp với khả năng tự học và tối ưu.",
    },
  ]

  const projects = [
    {
      title: "Nền tảng AI Giáo dục",
      company: "ApecTech",
      status: "Đang phát triển",
      progress: 75,
    },
    {
      title: "Hệ thống Bảo mật Thông minh",
      company: "GuardCam",
      status: "Beta Testing",
      progress: 90,
    },
    {
      title: "Phân tích Cảm xúc Khách hàng",
      company: "EmoCommerce",
      status: "Hoàn thành",
      progress: 100,
    },
  ]

  return (
    <div className="space-y-12">
      {/* About ApecGlobal Section */}
      <section id="about" className="space-y-8">
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Về ApecGlobal Group
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <Target className="h-12 w-12 mx-auto text-purple-400 mb-4" />
              <CardTitle className="text-white">Tầm Nhìn</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 text-center">
                Trở thành tập đoàn công nghệ hàng đầu, định hình tương lai số của Việt Nam và khu vực.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <Building2 className="h-12 w-12 mx-auto text-blue-400 mb-4" />
              <CardTitle className="text-white">Sứ Mệnh</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 text-center">
                Kết nối và thống nhất hệ sinh thái công nghệ, tạo ra các giải pháp đột phá cho doanh nghiệp.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <History className="h-12 w-12 mx-auto text-green-400 mb-4" />
              <CardTitle className="text-white">Lịch Sử</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 text-center">
                Thành lập 2020, phát triển từ startup công nghệ thành tập đoàn đa ngành với 5 công ty thành viên.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <Crown className="h-12 w-12 mx-auto text-yellow-400 mb-4" />
              <CardTitle className="text-white">Lãnh Đạo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 text-center">
                Đội ngũ lãnh đạo giàu kinh nghiệm với tầm nhìn chiến lược và khả năng thực thi xuất sắc.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Member Companies Section */}
      <section className="space-y-8">
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Công Ty Thành Viên
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memberCompanies.map((company) => {
            const IconComponent = company.icon
            return (
              <Card
                key={company.name}
                className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => setSelectedCompany(company.name)}
              >
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${company.color} flex items-center justify-center mb-4`}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-white">{company.name}</CardTitle>
                  <p className="text-white/60">{company.description}</p>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-purple-500/30 text-white hover:bg-purple-500/20">
                    Xem Chi Tiết
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Current Projects Section */}
      <section id="projects" className="space-y-8">
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Dự Án Hiện Tại
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300"
            >
              <CardHeader>
                <CardTitle className="text-white">{project.title}</CardTitle>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                    {project.company}
                  </Badge>
                  <Badge
                    variant={project.status === "Hoàn thành" ? "default" : "secondary"}
                    className={project.status === "Hoàn thành" ? "bg-green-600" : "bg-orange-600"}
                  >
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Tiến độ</span>
                    <span className="text-white">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* News & Media Section */}
      <section id="news" className="space-y-8">
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Tin Tức & Truyền Thông
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
            <CardHeader>
              <Calendar className="h-8 w-8 text-purple-400 mb-2" />
              <CardTitle className="text-white">Sự Kiện</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">Theo dõi các sự kiện và hội thảo công nghệ mới nhất của ApecGlobal.</p>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
            <CardHeader>
              <ImageIcon className="h-8 w-8 text-blue-400 mb-2" />
              <CardTitle className="text-white">Thư Viện</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">Khám phá bộ sưu tập hình ảnh, video và tài liệu công khai.</p>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
            <CardHeader>
              <FileText className="h-8 w-8 text-green-400 mb-2" />
              <CardTitle className="text-white">Báo Chí</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80">
                Đọc các bài viết và tin tức về ApecGlobal trên các phương tiện truyền thông.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="text-center space-y-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Liên Hệ & Đối Tác
        </h2>

        <div className="max-w-2xl mx-auto">
          <p className="text-white/80 text-lg mb-8">
            Hãy kết nối với chúng tôi để khám phá cơ hội hợp tác và phát triển cùng hệ sinh thái ApecGlobal.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Liên Hệ Ngay
            </Button>
            <Button variant="outline" className="border-purple-500/30 text-white hover:bg-purple-500/20">
              Trở Thành Đối Tác
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
