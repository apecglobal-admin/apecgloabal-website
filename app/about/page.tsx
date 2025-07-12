import Header from "@/components/header"
import Footer from "@/components/footer"
import PageHeroCarousel from "@/components/page-hero-carousel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Building2, History, Crown, Users, Award, Globe, Lightbulb, TrendingUp, Shield } from "lucide-react"
import { getAllCompanies } from "@/lib/db"
import { Company } from "@/lib/schema"

export default async function AboutPage() {
  // Lấy dữ liệu công ty từ database
  const dbCompanies = await getAllCompanies()
  
  // Tính tổng số nhân viên từ tất cả các công ty
  const totalEmployees = dbCompanies.reduce((sum, company) => sum + (company.employee_count || 0), 0)
  
  // Lấy năm thành lập của công ty đầu tiên (giả sử là công ty mẹ)
  const foundingYear = dbCompanies.length > 0 && dbCompanies[0].established_date 
    ? new Date(dbCompanies[0].established_date).getFullYear() 
    : 2020
  
  // Dữ liệu ban lãnh đạo - có thể cập nhật từ database trong tương lai
  const leadership = [
    {
      name: "Nguyễn Văn A",
      position: "CEO & Founder",
      experience: "15+ năm kinh nghiệm",
      specialty: "Chiến lược công nghệ",
    },
    {
      name: "Trần Thị B",
      position: "CTO",
      experience: "12+ năm kinh nghiệm",
      specialty: "AI & Machine Learning",
    },
    {
      name: "Lê Văn C",
      position: "COO",
      experience: "10+ năm kinh nghiệm",
      specialty: "Vận hành & Phát triển",
    },
  ]

  const values = [
    {
      icon: Lightbulb,
      title: "Đổi Mới",
      description: "Luôn tiên phong trong việc áp dụng công nghệ mới và tư duy sáng tạo",
    },
    {
      icon: Users,
      title: "Hợp Tác",
      description: "Xây dựng văn hóa làm việc nhóm và hợp tác chặt chẽ giữa các bộ phận",
    },
    {
      icon: TrendingUp,
      title: "Phát Triển",
      description: "Cam kết phát triển bền vững và tạo ra giá trị lâu dài",
    },
    {
      icon: Shield,
      title: "Tin Cậy",
      description: "Xây dựng lòng tin thông qua chất lượng sản phẩm và dịch vụ",
    },
  ]

  const milestones = [
    {
      year: "2020",
      event: "Thành lập ApecGlobal Group",
      description: "Khởi đầu với tầm nhìn thống nhất hệ sinh thái công nghệ",
    },
    { year: "2021", event: "Ra mắt ApecTech", description: "Công ty đầu tiên chuyên về AI và học tập số" },
    { year: "2022", event: "Mở rộng với GuardCam", description: "Phát triển giải pháp bảo mật công nghệ tiên tiến" },
    {
      year: "2023",
      event: "Thành lập EmoCommerce & TimeLoop",
      description: "Đa dạng hóa portfolio với thương mại điện tử và phân tích dữ liệu",
    },
    { year: "2024", event: "Khởi động ApecNeuroOS", description: "Phát triển hệ điều hành doanh nghiệp thế hệ mới" },
  ]

  // Hero slides for About page
  const heroSlides = [
    {
      title: "VỀ APECGLOBAL GROUP",
      subtitle: "Tập đoàn công nghệ tiên phong, cam kết tạo ra những giải pháp đột phá để định hình tương lai số của Việt Nam và khu vực",
      gradient: "from-purple-400 via-white to-blue-400",
      backgroundImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Tìm Hiểu Thêm",
        href: "#vision",
        gradient: "from-purple-600 to-blue-600",
        hoverGradient: "from-purple-700 to-blue-700"
      },
      secondaryButton: {
        text: "Liên Hệ Với Chúng Tôi",
        href: "/contact",
        borderColor: "border-purple-500/50",
        hoverBg: "bg-purple-500/20",
        hoverBorder: "border-purple-400"
      }
    },
    {
      title: "LỊCH SỬ PHÁT TRIỂN",
      subtitle: "Từ năm 2020, chúng tôi đã phát triển từ một startup công nghệ thành tập đoàn đa ngành với 5+ công ty thành viên",
      gradient: "from-blue-400 via-white to-cyan-400",
      backgroundImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Xem Hành Trình",
        href: "#timeline",
        gradient: "from-blue-600 to-cyan-600",
        hoverGradient: "from-blue-700 to-cyan-700"
      },
      secondaryButton: {
        text: "Các Công Ty Thành Viên",
        href: "/companies",
        borderColor: "border-blue-500/50",
        hoverBg: "bg-blue-500/20",
        hoverBorder: "border-blue-400"
      }
    },
    {
      title: "ĐỘI NGŨ LÃNH ĐẠO",
      subtitle: "Đội ngũ lãnh đạo giàu kinh nghiệm với tầm nhìn chiến lược và khả năng thực thi xuất sắc trong lĩnh vực công nghệ",
      gradient: "from-green-400 via-white to-emerald-400",
      backgroundImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Gặp Gỡ Đội Ngũ",
        href: "#leadership",
        gradient: "from-green-600 to-emerald-600",
        hoverGradient: "from-green-700 to-emerald-700"
      },
      secondaryButton: {
        text: "Tham Gia Với Chúng Tôi",
        href: "/careers",
        borderColor: "border-green-500/50",
        hoverBg: "bg-green-500/20",
        hoverBorder: "border-green-400"
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

      {/* Vision, Mission, Values */}
      <section id="vision" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
              <CardHeader className="text-center">
                <Target className="h-12 w-12 mx-auto text-purple-400 mb-4" />
                <CardTitle className="text-white">Tầm Nhìn</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 text-center">
                  Trở thành tập đoàn công nghệ hàng đầu Đông Nam Á, định hình tương lai số và tạo ra những đột phá công
                  nghệ có tác động toàn cầu.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
              <CardHeader className="text-center">
                <Building2 className="h-12 w-12 mx-auto text-blue-400 mb-4" />
                <CardTitle className="text-white">Sứ Mệnh</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 text-center">
                  Kết nối và thống nhất hệ sinh thái công nghệ, phát triển các giải pháp AI tiên tiến để nâng cao chất
                  lượng cuộc sống và hiệu quả kinh doanh.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
              <CardHeader className="text-center">
                <History className="h-12 w-12 mx-auto text-green-400 mb-4" />
                <CardTitle className="text-white">Lịch Sử</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 text-center">
                  Từ năm {foundingYear}, chúng tôi đã phát triển từ một startup công nghệ thành tập đoàn đa ngành với {dbCompanies.length} công ty
                  thành viên và hơn {totalEmployees} nhân viên.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
              <CardHeader className="text-center">
                <Crown className="h-12 w-12 mx-auto text-yellow-400 mb-4" />
                <CardTitle className="text-white">Giá Trị</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 text-center">
                  Đổi mới, hợp tác, phát triển bền vững và xây dựng lòng tin là những giá trị cốt lõi định hướng mọi
                  hoạt động của chúng tôi.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Giá Trị Cốt Lõi
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <Card
                  key={index}
                  className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105"
                >
                  <CardHeader className="text-center">
                    <IconComponent className="h-12 w-12 mx-auto text-purple-400 mb-4" />
                    <CardTitle className="text-white">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80 text-center text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section id="leadership" className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Đội Ngũ Lãnh Đạo
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {leadership.map((leader, index) => (
              <Card
                key={index}
                className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300"
              >
                <CardHeader className="text-center">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <CardTitle className="text-white">{leader.name}</CardTitle>
                  <Badge className="bg-purple-600">{leader.position}</Badge>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <p className="text-white/80">{leader.experience}</p>
                  <p className="text-white/60 text-sm">{leader.specialty}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Hành Trình Phát Triển
          </h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{milestone.year}</span>
                  </div>
                </div>
                <Card className="flex-1 bg-black/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">{milestone.event}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80">{milestone.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="bg-black/50 border-purple-500/30 text-center">
              <CardContent className="p-6">
                <Building2 className="h-8 w-8 mx-auto text-purple-400 mb-4" />
                <div className="text-3xl font-bold text-white mb-2">5+</div>
                <div className="text-white/60">Công ty thành viên</div>
              </CardContent>
            </Card>
            <Card className="bg-black/50 border-purple-500/30 text-center">
              <CardContent className="p-6">
                <Users className="h-8 w-8 mx-auto text-blue-400 mb-4" />
                <div className="text-3xl font-bold text-white mb-2">200+</div>
                <div className="text-white/60">Nhân viên</div>
              </CardContent>
            </Card>
            <Card className="bg-black/50 border-purple-500/30 text-center">
              <CardContent className="p-6">
                <Award className="h-8 w-8 mx-auto text-green-400 mb-4" />
                <div className="text-3xl font-bold text-white mb-2">50+</div>
                <div className="text-white/60">Dự án hoàn thành</div>
              </CardContent>
            </Card>
            <Card className="bg-black/50 border-purple-500/30 text-center">
              <CardContent className="p-6">
                <Globe className="h-8 w-8 mx-auto text-yellow-400 mb-4" />
                <div className="text-3xl font-bold text-white mb-2">3+</div>
                <div className="text-white/60">Quốc gia</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
