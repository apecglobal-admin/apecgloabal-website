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
    <div className="min-h-screen bg-white text-black">
      <Header />

      {/* Hero Carousel Section */}
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 overflow-hidden">
        <div className="hero-carousel-container relative z-10">
          <PageHeroCarousel slides={heroSlides} />
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section id="vision" className="section-standard bg-gradient-to-br from-gray-50/50 to-red-50/30">
        <div className="container-standard">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-6">
              <Target className="w-4 h-4 mr-2" />
              Tầm Nhìn - Sứ Mệnh - Giá Trị
            </div>
            <h2 className="heading-h2 mb-4">
              Định Hướng <span className="text-red-600">Chiến Lược</span> 
            </h2>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              Những giá trị cốt lõi và định hướng chiến lược dẫn dắt ApecGlobal Group 
              hướng tới tương lai công nghệ tiên tiến
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
              <div className="relative card-feature p-8 bg-white rounded-2xl text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="heading-h4 text-red-600 mb-4">Tầm Nhìn</h3>
                <p className="text-gray-600 leading-relaxed">
                  Trở thành tập đoàn công nghệ hàng đầu Đông Nam Á, định hình tương lai số và tạo ra những đột phá công
                  nghệ có tác động toàn cầu.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform"></div>
              <div className="relative card-feature p-8 bg-white rounded-2xl text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="heading-h4 text-red-600 mb-4">Sứ Mệnh</h3>
                <p className="text-gray-600 leading-relaxed">
                  Kết nối và thống nhất hệ sinh thái công nghệ, phát triển các giải pháp AI tiên tiến để nâng cao chất
                  lượng cuộc sống và hiệu quả kinh doanh.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
              <div className="relative card-feature p-8 bg-white rounded-2xl text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <History className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="heading-h4 text-red-600 mb-4">Lịch Sử</h3>
                <p className="text-gray-600 leading-relaxed">
                  Từ năm {foundingYear}, chúng tôi đã phát triển từ một startup công nghệ thành tập đoàn đa ngành với {dbCompanies.length} công ty
                  thành viên và hơn {totalEmployees} nhân viên.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform"></div>
              <div className="relative card-feature p-8 bg-white rounded-2xl text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Crown className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="heading-h4 text-red-600 mb-4">Giá Trị</h3>
                <p className="text-gray-600 leading-relaxed">
                  Đổi mới, hợp tác, phát triển bền vững và xây dựng lòng tin là những giá trị cốt lõi định hướng mọi
                  hoạt động của chúng tôi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-standard">
        <div className="container-standard">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Crown className="w-4 h-4 mr-2" />
              Giá Trị Cốt Lõi
            </div>
            <h2 className="heading-h2 mb-4">
              Văn Hóa <span className="text-red-600">Doanh Nghiệp</span>
            </h2>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              Những giá trị cốt lõi tạo nên văn hóa doanh nghiệp độc đáo và 
              định hướng phát triển bền vững của ApecGlobal Group
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              const colors = [
                { bg: 'bg-red-100', text: 'text-red-600', gradient: 'from-red-100 to-red-200' },
                { bg: 'bg-blue-100', text: 'text-blue-600', gradient: 'from-blue-100 to-blue-200' },
                { bg: 'bg-green-100', text: 'text-green-600', gradient: 'from-green-100 to-green-200' },
                { bg: 'bg-purple-100', text: 'text-purple-600', gradient: 'from-purple-100 to-purple-200' }
              ]
              const color = colors[index % colors.length]
              
              return (
                <div key={index} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${color.gradient} rounded-2xl transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} group-hover:${index % 2 === 0 ? 'rotate-2' : '-rotate-2'} transition-transform`}></div>
                  <div className="relative card-feature p-8 bg-white rounded-2xl text-center">
                    <div className={`w-16 h-16 ${color.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                      <IconComponent className={`w-8 h-8 ${color.text}`} />
                    </div>
                    <h3 className="heading-h4 text-red-600 mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section id="leadership" className="section-standard bg-gradient-to-br from-gray-50/50 to-red-50/30">
        <div className="container-standard">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
              <Users className="w-4 h-4 mr-2" />
              Đội Ngũ Lãnh Đạo
            </div>
            <h2 className="heading-h2 mb-4">
              Những <span className="text-red-600">Nhà Lãnh Đạo</span> Tài Năng
            </h2>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              Đội ngũ lãnh đạo giàu kinh nghiệm với tầm nhìn chiến lược và khả năng thực thi xuất sắc 
              trong lĩnh vực công nghệ
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {leadership.map((leader, index) => {
              const colors = [
                { bg: 'bg-red-100', text: 'text-red-600', gradient: 'from-red-100 to-red-200' },
                { bg: 'bg-blue-100', text: 'text-blue-600', gradient: 'from-blue-100 to-blue-200' },
                { bg: 'bg-green-100', text: 'text-green-600', gradient: 'from-green-100 to-green-200' }
              ]
              const color = colors[index % colors.length]
              
              return (
                <div key={index} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${color.gradient} rounded-2xl transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} group-hover:${index % 2 === 0 ? 'rotate-2' : '-rotate-2'} transition-transform`}></div>
                  <div className="relative card-feature p-8 bg-white rounded-2xl text-center">
                    <div className={`w-20 h-20 ${color.bg} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                      <Users className={`w-10 h-10 ${color.text}`} />
                    </div>
                    <h3 className="heading-h4 text-red-600 mb-2">{leader.name}</h3>
                    <div className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-4">
                      {leader.position}
                    </div>
                    <p className="text-gray-600 mb-2">{leader.experience}</p>
                    <p className="text-gray-500 text-sm">{leader.specialty}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" className="section-standard">
        <div className="container-standard">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
              <History className="w-4 h-4 mr-2" />
              Hành Trình Phát Triển
            </div>
            <h2 className="heading-h2 mb-4">
              <span className="text-red-600">Cột Mốc</span> Quan Trọng
            </h2>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              Những dấu mốc quan trọng trong hành trình phát triển và khẳng định vị thế của ApecGlobal Group
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-200 via-blue-200 to-green-200"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => {
                const colors = [
                  { bg: 'bg-red-100', text: 'text-red-600', gradient: 'from-red-100 to-red-200' },
                  { bg: 'bg-blue-100', text: 'text-blue-600', gradient: 'from-blue-100 to-blue-200' },
                  { bg: 'bg-green-100', text: 'text-green-600', gradient: 'from-green-100 to-green-200' },
                  { bg: 'bg-purple-100', text: 'text-purple-600', gradient: 'from-purple-100 to-purple-200' },
                  { bg: 'bg-orange-100', text: 'text-orange-600', gradient: 'from-orange-100 to-orange-200' }
                ]
                const color = colors[index % colors.length]
                
                return (
                  <div key={index} className="flex items-start space-x-8">
                    <div className="flex-shrink-0 relative z-10">
                      <div className={`w-16 h-16 ${color.bg} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <span className={`${color.text} font-bold text-sm`}>{milestone.year}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 group">
                      <div className="relative">
                        <div className={`absolute inset-0 bg-gradient-to-br ${color.gradient} rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform opacity-20`}></div>
                        <div className="relative card-feature p-8 bg-white rounded-2xl">
                          <h3 className="heading-h4 text-red-600 mb-3">{milestone.event}</h3>
                          <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-standard bg-gradient-to-br from-gray-50/50 to-red-50/30">
        <div className="container-standard">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-6">
              <Award className="w-4 h-4 mr-2" />
              Thống Kê Nổi Bật
            </div>
            <h2 className="heading-h2 mb-4">
              Những Con Số <span className="text-red-600">Ấn Tượng</span>
            </h2>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              Minh chứng rõ nét cho sự phát triển mạnh mẽ và thành tựu đáng tự hào của ApecGlobal Group
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
              <div className="relative card-feature p-8 bg-white rounded-2xl text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Building2 className="w-8 h-8 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-red-600 mb-2">{dbCompanies.length}+</div>
                <div className="text-gray-600">Công ty thành viên</div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform"></div>
              <div className="relative card-feature p-8 bg-white rounded-2xl text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-red-600 mb-2">{totalEmployees}+</div>
                <div className="text-gray-600">Nhân viên</div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
              <div className="relative card-feature p-8 bg-white rounded-2xl text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-red-600 mb-2">50+</div>
                <div className="text-gray-600">Dự án hoàn thành</div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform"></div>
              <div className="relative card-feature p-8 bg-white rounded-2xl text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-red-600 mb-2">3+</div>
                <div className="text-gray-600">Quốc gia</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
