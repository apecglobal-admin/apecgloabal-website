import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Brain,
  Users,
  TrendingUp,
  Award,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  CheckCircle,
  Star,
  Rocket,
  Code,
  Database,
  Cpu,
  Globe,
} from "lucide-react"

export default function ApecTechPage() {
  const services = [
    {
      icon: Brain,
      title: "AI-Powered Learning Platform",
      description: "Nền tảng học tập thông minh với khả năng cá nhân hóa trải nghiệm cho từng học viên",
      features: ["Adaptive Learning", "Progress Tracking", "Smart Recommendations", "Multi-language Support"],
    },
    {
      icon: Code,
      title: "Natural Language Processing",
      description: "Xử lý ngôn ngữ tự nhiên cho chatbot, phân tích văn bản và dịch thuật tự động",
      features: ["Text Analysis", "Sentiment Analysis", "Language Translation", "Chatbot Development"],
    },
    {
      icon: Database,
      title: "Computer Vision Solutions",
      description: "Giải pháp thị giác máy tính cho nhận dạng hình ảnh và video analytics",
      features: ["Image Recognition", "Object Detection", "Facial Recognition", "Video Analytics"],
    },
    {
      icon: Cpu,
      title: "Machine Learning Consulting",
      description: "Tư vấn và triển khai các mô hình machine learning cho doanh nghiệp",
      features: ["Model Development", "Data Pipeline", "MLOps", "Performance Optimization"],
    },
  ]

  const projects = [
    {
      title: "EduSmart Platform",
      description: "Nền tảng giáo dục thông minh cho 50,000+ học sinh",
      status: "Hoàn thành",
      impact: "Tăng 40% hiệu quả học tập",
    },
    {
      title: "AI Teaching Assistant",
      description: "Trợ lý giảng dạy AI cho các trường đại học",
      status: "Đang triển khai",
      impact: "Hỗ trợ 100+ giảng viên",
    },
    {
      title: "Language Learning AI",
      description: "Ứng dụng học ngoại ngữ với AI tutor",
      status: "Beta Testing",
      impact: "10,000+ người dùng thử nghiệm",
    },
  ]

  const team = [
    {
      name: "Dr. Nguyễn Văn A",
      position: "Chief Technology Officer",
      experience: "15+ năm AI Research",
      education: "PhD Computer Science - Stanford",
    },
    {
      name: "Trần Thị B",
      position: "Head of Machine Learning",
      experience: "10+ năm ML Engineering",
      education: "MS AI - MIT",
    },
    {
      name: "Lê Văn C",
      position: "Lead Data Scientist",
      experience: "8+ năm Data Science",
      education: "MS Statistics - UC Berkeley",
    },
  ]

  const achievements = [
    {
      icon: Award,
      title: "AI Innovation Award 2024",
      description: "Giải thưởng đổi mới AI xuất sắc nhất Việt Nam",
    },
    {
      icon: Star,
      title: "Top 10 EdTech Startup",
      description: "Được vinh danh trong top 10 startup giáo dục",
    },
    {
      icon: Globe,
      title: "International Recognition",
      description: "Được công nhận tại hội nghị AI quốc tế",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-cyan-900/20 animate-pulse"></div>
          {/* Floating AI Icons */}
          {[Brain, Code, Database, Cpu].map((Icon, i) => (
            <Icon
              key={i}
              className="absolute text-blue-400/20 animate-float"
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
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Brain className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">ApecTech</h1>
                  <p className="text-blue-300 text-xl">AI & Educational Technology</p>
                </div>
              </div>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Tiên phong trong việc phát triển các giải pháp AI tiên tiến và nền tảng học tập số thông minh, tạo ra
                những trải nghiệm giáo dục cá nhân hóa và hiệu quả cho hàng triệu người học.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg px-8 py-4 hover:scale-105 transform transition-all duration-300">
                  Khám Phá Sản Phẩm
                  <Rocket className="ml-2 h-5 w-5" />
                </Button>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="border-blue-500/30 text-white hover:bg-blue-500/20 text-lg px-8 py-4 hover:scale-105 transform transition-all duration-300"
                  >
                    Liên Hệ Hợp Tác
                  </Button>
                </Link>
              </div>
            </div>

            {/* Company Stats */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-black/50 border-blue-500/30 text-center hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <Users className="h-8 w-8 mx-auto text-blue-400 mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">45+</div>
                  <div className="text-white/60">Chuyên gia AI</div>
                </CardContent>
              </Card>
              <Card className="bg-black/50 border-blue-500/30 text-center hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <TrendingUp className="h-8 w-8 mx-auto text-cyan-400 mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">15+</div>
                  <div className="text-white/60">Dự án hoàn thành</div>
                </CardContent>
              </Card>
              <Card className="bg-black/50 border-blue-500/30 text-center hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <Award className="h-8 w-8 mx-auto text-green-400 mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">5+</div>
                  <div className="text-white/60">Giải thưởng</div>
                </CardContent>
              </Card>
              <Card className="bg-black/50 border-blue-500/30 text-center hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <Globe className="h-8 w-8 mx-auto text-purple-400 mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">100K+</div>
                  <div className="text-white/60">Người học</div>
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
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Dịch Vụ & Giải Pháp
            </h2>
            <p className="text-white/60 text-lg">Các sản phẩm AI tiên tiến được phát triển bởi ApecTech</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <Card
                  key={index}
                  className="bg-black/50 border-blue-500/30 hover:border-blue-500/60 transition-all duration-300 hover:scale-105 group"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white group-hover:text-blue-300 transition-colors">
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
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Dự Án Nổi Bật
            </h2>
            <p className="text-white/60 text-lg">Những thành tựu đáng tự hào của ApecTech</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card
                key={index}
                className="bg-black/50 border-blue-500/30 hover:border-blue-500/60 transition-all duration-300 hover:scale-105"
              >
                <CardHeader>
                  <CardTitle className="text-white">{project.title}</CardTitle>
                  <Badge
                    className={
                      project.status === "Hoàn thành"
                        ? "bg-green-600"
                        : project.status === "Đang triển khai"
                          ? "bg-orange-600"
                          : "bg-blue-600"
                    }
                  >
                    {project.status}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white/80">{project.description}</p>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                    <p className="text-blue-300 font-medium text-sm">{project.impact}</p>
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
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Đội Ngũ Lãnh Đạo
            </h2>
            <p className="text-white/60 text-lg">Những chuyên gia hàng đầu trong lĩnh vực AI</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="bg-black/50 border-blue-500/30 hover:border-blue-500/60 transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="text-center">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <CardTitle className="text-white">{member.name}</CardTitle>
                  <Badge className="bg-blue-600">{member.position}</Badge>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <p className="text-white/80 text-sm">{member.experience}</p>
                  <p className="text-blue-300 text-sm">{member.education}</p>
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
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Thành Tựu & Giải Thưởng
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon
              return (
                <Card
                  key={index}
                  className="bg-black/50 border-blue-500/30 hover:border-blue-500/60 transition-all duration-300 hover:scale-105 text-center"
                >
                  <CardHeader>
                    <IconComponent className="h-16 w-16 mx-auto text-blue-400 mb-4" />
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
          <Card className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border-blue-500/30 max-w-4xl mx-auto">
            <CardContent className="p-12">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Liên Hệ ApecTech</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-blue-400" />
                      <span className="text-white">Tầng 10, Tòa nhà Keangnam, Hà Nội</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-blue-400" />
                      <span className="text-white">+84 24 3123 4567</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-blue-400" />
                      <span className="text-white">contact@apectech.com</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-6">Bắt Đầu Dự Án AI</h3>
                  <p className="text-white/80 mb-6">
                    Hãy để ApecTech đồng hành cùng bạn trong hành trình chuyển đổi số với AI
                  </p>
                  <div className="space-y-4">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 hover:scale-105 transform transition-all duration-300">
                      Tư Vấn Miễn Phí
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="w-full border-blue-500/30 text-white hover:bg-blue-500/20">
                      Xem Demo Sản Phẩm
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
