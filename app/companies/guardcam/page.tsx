"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Shield,
  Users,
  TrendingUp,
  Award,
  Eye,
  Lock,
  Camera,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  CheckCircle,
  Star,
  Globe,
  Monitor,
} from "lucide-react"

export default function GuardCamPage() {
  const services = [
    {
      icon: Camera,
      title: "Smart Surveillance System",
      description: "Hệ thống giám sát thông minh với AI phát hiện bất thường và cảnh báo real-time",
      features: ["AI Object Detection", "Facial Recognition", "Motion Analytics", "Cloud Storage"],
    },
    {
      icon: Shield,
      title: "IoT Security Solutions",
      description: "Bảo mật toàn diện cho các thiết bị IoT và mạng kết nối thông minh",
      features: ["Device Authentication", "Network Monitoring", "Threat Detection", "Security Audit"],
    },
    {
      icon: Lock,
      title: "Access Control Systems",
      description: "Hệ thống kiểm soát ra vào thông minh với nhiều phương thức xác thực",
      features: ["Biometric Access", "Card Reader", "Mobile App Control", "Visitor Management"],
    },
    {
      icon: Monitor,
      title: "Cybersecurity Consulting",
      description: "Tư vấn và triển khai giải pháp an ninh mạng cho doanh nghiệp",
      features: ["Security Assessment", "Penetration Testing", "Compliance Audit", "Training Programs"],
    },
  ]

  const projects = [
    {
      title: "Smart City Surveillance",
      description: "Hệ thống giám sát thông minh cho 3 thành phố lớn",
      status: "Hoàn thành",
      impact: "Giảm 35% tội phạm đường phố",
    },
    {
      title: "Enterprise Security Platform",
      description: "Nền tảng bảo mật tổng thể cho 50+ doanh nghiệp",
      status: "Đang vận hành",
      impact: "Bảo vệ 100,000+ nhân viên",
    },
    {
      title: "IoT Security Framework",
      description: "Framework bảo mật cho thiết bị IoT",
      status: "Beta Testing",
      impact: "Bảo vệ 10,000+ thiết bị",
    },
  ]

  const team = [
    {
      name: "Trần Văn D",
      position: "Chief Security Officer",
      experience: "12+ năm Cybersecurity",
      education: "MS Information Security - CMU",
    },
    {
      name: "Nguyễn Thị E",
      position: "Head of AI Vision",
      experience: "8+ năm Computer Vision",
      education: "PhD Computer Vision - Stanford",
    },
    {
      name: "Lê Văn F",
      position: "IoT Security Lead",
      experience: "10+ năm IoT Development",
      education: "MS Electrical Engineering - MIT",
    },
  ]

  const achievements = [
    {
      icon: Award,
      title: "Cybersecurity Excellence 2024",
      description: "Giải thưởng xuất sắc về an ninh mạng",
    },
    {
      icon: Shield,
      title: "ISO 27001 Certified",
      description: "Chứng nhận tiêu chuẩn bảo mật quốc tế",
    },
    {
      icon: Star,
      title: "Top Security Vendor",
      description: "Top 5 nhà cung cấp bảo mật Việt Nam",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-green-900">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-transparent to-emerald-900/20 animate-pulse"></div>
          {/* Floating Security Icons */}
          {[Shield, Lock, Eye, Camera].map((Icon, i) => (
            <Icon
              key={i}
              className="absolute text-green-400/20 animate-float"
              size={60}
              style={{
                left: `${15 + i * 20}%`,
                top: `${20 + (i % 2) * 30}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${10 + i * 2}s`,
              }}
            />
          ))}
        </div>
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <Shield className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">GuardCam</h1>
                  <p className="text-green-300 text-xl">Smart Security & Surveillance</p>
                </div>
              </div>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Dẫn đầu trong việc phát triển các giải pháp bảo mật và giám sát thông minh, kết hợp AI và IoT để tạo ra
                hệ thống an ninh toàn diện và hiệu quả cho mọi quy mô doanh nghiệp.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg px-8 py-4 hover:scale-105 transform transition-all duration-300">
                  Khám Phá Giải Pháp
                  <Shield className="ml-2 h-5 w-5" />
                </Button>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="border-green-500/30 text-white hover:bg-green-500/20 text-lg px-8 py-4 hover:scale-105 transform transition-all duration-300"
                  >
                    Tư Vấn Bảo Mật
                  </Button>
                </Link>
              </div>
            </div>

            {/* Company Stats */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-black/50 border-green-500/30 text-center hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <Users className="h-8 w-8 mx-auto text-green-400 mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">35+</div>
                  <div className="text-white/60">Chuyên gia bảo mật</div>
                </CardContent>
              </Card>
              <Card className="bg-black/50 border-green-500/30 text-center hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <TrendingUp className="h-8 w-8 mx-auto text-emerald-400 mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">12+</div>
                  <div className="text-white/60">Dự án lớn</div>
                </CardContent>
              </Card>
              <Card className="bg-black/50 border-green-500/30 text-center hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <Award className="h-8 w-8 mx-auto text-yellow-400 mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">8+</div>
                  <div className="text-white/60">Chứng nhận</div>
                </CardContent>
              </Card>
              <Card className="bg-black/50 border-green-500/30 text-center hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <Globe className="h-8 w-8 mx-auto text-blue-400 mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">50K+</div>
                  <div className="text-white/60">Thiết bị bảo vệ</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Giải Pháp Bảo Mật
            </h2>
            <p className="text-white/60 text-lg">Hệ thống bảo mật toàn diện cho mọi nhu cầu</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <Card
                  key={index}
                  className="bg-black/50 border-green-500/30 hover:border-green-500/60 transition-all duration-300 hover:scale-105 group"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white group-hover:text-green-300 transition-colors">
                          {service.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/80 leading-relaxed">{service.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                          <span className="text-white/70 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Dự Án Tiêu Biểu
            </h2>
            <p className="text-white/60 text-lg">Những thành công đáng tự hào của GuardCam</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card
                key={index}
                className="bg-black/50 border-green-500/30 hover:border-green-500/60 transition-all duration-300 hover:scale-105"
              >
                <CardHeader>
                  <CardTitle className="text-white">{project.title}</CardTitle>
                  <Badge
                    className={
                      project.status === "Hoàn thành"
                        ? "bg-green-600"
                        : project.status === "Đang vận hành"
                          ? "bg-blue-600"
                          : "bg-orange-600"
                    }
                  >
                    {project.status}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white/80">{project.description}</p>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <p className="text-green-300 font-medium text-sm">{project.impact}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Đội Ngũ Chuyên Gia
            </h2>
            <p className="text-white/60 text-lg">Những chuyên gia hàng đầu về bảo mật và giám sát</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="bg-black/50 border-green-500/30 hover:border-green-500/60 transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="text-center">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-12 w-12 text-white" />
                  </div>
                  <CardTitle className="text-white">{member.name}</CardTitle>
                  <Badge className="bg-green-600">{member.position}</Badge>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <p className="text-white/80 text-sm">{member.experience}</p>
                  <p className="text-green-300 text-sm">{member.education}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Chứng Nhận & Giải Thưởng
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon
              return (
                <Card
                  key={index}
                  className="bg-black/50 border-green-500/30 hover:border-green-500/60 transition-all duration-300 hover:scale-105 text-center"
                >
                  <CardHeader>
                    <IconComponent className="h-16 w-16 mx-auto text-green-400 mb-4" />
                    <CardTitle className="text-white">{achievement.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80">{achievement.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-500/30 max-w-4xl mx-auto">
            <CardContent className="p-12">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Liên Hệ GuardCam</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-green-400" />
                      <span className="text-white">Tầng 12, Tòa nhà Keangnam, Hà Nội</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-green-400" />
                      <span className="text-white">+84 24 3123 4568</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-green-400" />
                      <span className="text-white">security@guardcam.com</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-6">Tư Vấn Bảo Mật</h3>
                  <p className="text-white/80 mb-6">Để GuardCam bảo vệ tài sản và thông tin quan trọng của bạn</p>
                  <div className="space-y-4">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:scale-105 transform transition-all duration-300">
                      Đánh Giá Bảo Mật Miễn Phí
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="w-full border-green-500/30 text-white hover:bg-green-500/20">
                      Xem Demo Hệ Thống
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
