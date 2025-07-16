import Header from "@/components/header"
import Footer from "@/components/footer"
import PageHeroCarousel from "@/components/page-hero-carousel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Brain,
  Shield,
  Heart,
  Clock,
  Cpu,
  Target,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Lightbulb,
  Rocket,
  Globe,
  Code,
  Database,
  Cloud,
  Smartphone,
  Monitor,
  Headphones,
} from "lucide-react"
import { getAllServices, getAllCompanies } from "@/lib/db"
import { Service, Company } from "@/lib/schema"

// Hàm để lấy icon dựa trên tên dịch vụ
const getServiceIcon = (icon: string | null) => {
  switch (icon) {
    case "brain":
      return Brain
    case "shield":
      return Shield
    case "heart":
      return Heart
    case "clock":
      return Clock
    case "cpu":
      return Cpu
    case "code":
      return Code
    case "database":
      return Database
    case "cloud":
      return Cloud
    case "smartphone":
      return Smartphone
    case "monitor":
      return Monitor
    case "headphones":
      return Headphones
    default:
      return Brain
  }
}

// Hàm để lấy màu gradient dựa trên tên công ty
const getCompanyColor = (companyName: string) => {
  switch (companyName) {
    case "ApecTech":
      return "from-blue-500 to-cyan-500"
    case "GuardCam":
      return "from-green-500 to-emerald-500"
    case "EmoCommerce":
      return "from-pink-500 to-rose-500"
    case "TimeLoop":
      return "from-orange-500 to-amber-500"
    case "ApecNeuroOS":
      return "from-purple-500 to-violet-500"
    default:
      return "from-blue-500 to-cyan-500"
  }
}

export default async function ServicesPage() {
  // Lấy dữ liệu dịch vụ từ database
  const dbServices = await getAllServices()
  const dbCompanies = await getAllCompanies()
  
  // Tạo map để tra cứu tên công ty dựa trên company_id
  const companyMap = new Map<number, string>()
  dbCompanies.forEach((company: Company) => {
    companyMap.set(company.id, company.name)
  })
  
  // Chuyển đổi dữ liệu từ database sang định dạng hiển thị cho dịch vụ chính
  const mainServices = dbServices
    .filter((service: Service) => service.is_featured)
    .map((service: Service) => {
      const companyName = companyMap.get(service.company_id) || "Unknown"
      return {
        id: service.id,
        slug: service.slug || service.id.toString(),
        icon: getServiceIcon(service.icon),
        title: service.title,
        description: service.description,
        features: service.features || ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
        color: getCompanyColor(companyName),
        company: companyName,
        price: service.price_range || "Liên hệ báo giá",
      }
    })

  // Chuyển đổi dữ liệu từ database sang định dạng hiển thị cho dịch vụ bổ sung
  const additionalServices = dbServices
    .filter((service: Service) => !service.is_featured)
    .map((service: Service) => {
      return {
        id: service.id,
        slug: service.slug || service.id.toString(),
        icon: getServiceIcon(service.icon),
        title: service.title,
        description: service.description,
      }
    })

  const processSteps = [
    {
      step: "01",
      title: "Tư Vấn & Phân Tích",
      description: "Tìm hiểu nhu cầu và phân tích yêu cầu chi tiết",
      icon: Target,
    },
    {
      step: "02",
      title: "Thiết Kế & Lên Kế Hoạch",
      description: "Thiết kế giải pháp và lập kế hoạch triển khai",
      icon: Lightbulb,
    },
    {
      step: "03",
      title: "Phát Triển & Kiểm Thử",
      description: "Phát triển sản phẩm và kiểm thử chất lượng",
      icon: Rocket,
    },
    {
      step: "04",
      title: "Triển Khai & Hỗ Trợ",
      description: "Triển khai hệ thống và hỗ trợ vận hành",
      icon: CheckCircle,
    },
  ]

  // Hero slides for Services page
  const heroSlides = [
    {
      title: "DỊCH VỤ CÔNG NGHỆ AI",
      subtitle: "Khám phá bộ sưu tập dịch vụ công nghệ trí tuệ nhân tạo tiên tiến của ApecGlobal Group, được thiết kế để thúc đẩy sự đổi mới và tăng trưởng cho doanh nghiệp của bạn",
      gradient: "from-purple-400 via-cyan-400 to-blue-400",
      backgroundImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Tư Vấn Miễn Phí",
        href: "/contact",
        gradient: "from-purple-600 to-cyan-600",
        hoverGradient: "from-purple-700 to-cyan-700"
      },
      secondaryButton: {
        text: "Xem Dịch Vụ",
        href: "#main-services",
        borderColor: "border-purple-500/50",
        hoverBg: "bg-purple-500/20",
        hoverBorder: "border-purple-400"
      }
    },
    {
      title: "PHÁT TRIỂN PHẦN MỀM",
      subtitle: "Thiết kế và phát triển ứng dụng web, mobile, desktop với công nghệ hiện đại và quy trình chuyên nghiệp",
      gradient: "from-blue-400 via-white to-cyan-400",
      backgroundImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Khám Phá Ngay",
        href: "#main-services",
        gradient: "from-blue-600 to-cyan-600",
        hoverGradient: "from-blue-700 to-cyan-700"
      },
      secondaryButton: {
        text: "Xem Portfolio",
        href: "/projects",
        borderColor: "border-blue-500/50",
        hoverBg: "bg-blue-500/20",
        hoverBorder: "border-blue-400"
      }
    },
    {
      title: "TƯ VẤN CÔNG NGHỆ",
      subtitle: "Tư vấn chiến lược công nghệ, chuyển đổi số và tối ưu hóa quy trình kinh doanh với đội ngũ chuyên gia hàng đầu",
      gradient: "from-green-400 via-white to-emerald-400",
      backgroundImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Đặt Lịch Tư Vấn",
        href: "/contact",
        gradient: "from-green-600 to-emerald-600",
        hoverGradient: "from-green-700 to-emerald-700"
      },
      secondaryButton: {
        text: "Quy Trình Làm Việc",
        href: "#process",
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

      {/* Main Services - AI Style */}
      <section id="main-services" className="section-standard bg-gradient-to-br from-gray-50/50 to-red-50/30">
        <div className="container-standard">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-6">
              <Brain className="w-4 h-4 mr-2" />
              Dịch Vụ Chính
            </div>
            <h2 className="heading-h2 mb-4">
              Giải Pháp Công Nghệ <span className="text-red-600">AI Tiên Tiến</span>
            </h2>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              Các giải pháp công nghệ AI cốt lõi được phát triển bởi đội ngũ chuyên gia hàng đầu, 
              tích hợp trí tuệ nhân tạo và tự động hóa để tối ưu hóa quy trình kinh doanh của bạn.
            </p>
          </div>

          <div className="space-y-12">
            {mainServices.map((service, index) => {
              const IconComponent = service.icon
              const colors = [
                { bg: 'bg-red-100', text: 'text-red-600', gradient: 'from-red-100 to-red-200' },
                { bg: 'bg-blue-100', text: 'text-blue-600', gradient: 'from-blue-100 to-blue-200' },
                { bg: 'bg-green-100', text: 'text-green-600', gradient: 'from-green-100 to-green-200' },
                { bg: 'bg-purple-100', text: 'text-purple-600', gradient: 'from-purple-100 to-purple-200' },
                { bg: 'bg-orange-100', text: 'text-orange-600', gradient: 'from-orange-100 to-orange-200' }
              ]
              const color = colors[index % colors.length]
              
              return (
                <div key={index} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${color.gradient} rounded-2xl transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} group-hover:${index % 2 === 0 ? 'rotate-2' : '-rotate-2'} transition-transform opacity-20`}></div>
                  
                  <div className="relative card-feature p-8 bg-white rounded-2xl">
                    <div className="grid lg:grid-cols-3 gap-8">
                      {/* Service Info */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-start space-x-6">
                          <div className={`w-20 h-20 ${color.bg} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                            <IconComponent className={`h-10 w-10 ${color.text}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <h3 className="heading-h3 text-red-600 group-hover:text-red-700 transition-colors duration-300">
                                {service.title}
                              </h3>
                              <div className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                                {service.company}
                              </div>
                            </div>
                            <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-3 group/feature">
                              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover/feature:bg-green-200 transition-colors duration-300">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </div>
                              <span className="text-gray-700 group-hover/feature:text-red-600 transition-colors duration-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pricing & CTA */}
                      <div className="space-y-6">
                        <div className="relative">
                          <div className={`absolute inset-0 bg-gradient-to-br ${color.gradient} rounded-xl opacity-20`}></div>
                          <div className="relative card-standard p-6 text-center">
                            <div className="heading-h3 text-red-600 mb-2">{service.price}</div>
                            <p className="text-gray-500 text-body-sm">Giá khởi điểm dự án</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <Link href={`/services/${service.slug}`} className="block">
                            <Button className="w-full btn-primary">
                              <span className="mr-2">Tìm Hiểu Chi Tiết</span>
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/services/demo/${service.slug}`} className="block">
                            <Button variant="outline" className="w-full btn-outline">
                              Yêu Cầu Demo
                            </Button>
                          </Link>
                        </div>

                        <div className="flex items-center justify-center space-x-1 bg-white py-2 px-3 rounded-lg shadow-md">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                          <span className="text-gray-600 text-sm ml-2">4.9/5 (50+ reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Additional Services - AI Style */}
      <section className="section-standard">
        <div className="container-standard">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Code className="w-4 h-4 mr-2" />
              Dịch Vụ Bổ Sung
            </div>
            <h2 className="heading-h2 mb-4">
              Dịch Vụ <span className="text-red-600">Hỗ Trợ</span> Khác
            </h2>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              Các dịch vụ hỗ trợ và mở rộng để hoàn thiện giải pháp công nghệ AI, 
              giúp doanh nghiệp của bạn tối ưu hóa hiệu suất và tăng tính cạnh tranh.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => {
              const IconComponent = service.icon
              const colors = [
                { bg: 'bg-red-100', text: 'text-red-600', gradient: 'from-red-100 to-red-200' },
                { bg: 'bg-blue-100', text: 'text-blue-600', gradient: 'from-blue-100 to-blue-200' },
                { bg: 'bg-green-100', text: 'text-green-600', gradient: 'from-green-100 to-green-200' },
                { bg: 'bg-purple-100', text: 'text-purple-600', gradient: 'from-purple-100 to-purple-200' },
                { bg: 'bg-orange-100', text: 'text-orange-600', gradient: 'from-orange-100 to-orange-200' },
                { bg: 'bg-pink-100', text: 'text-pink-600', gradient: 'from-pink-100 to-pink-200' }
              ]
              const color = colors[index % colors.length]
              
              return (
                <div key={index} className="group relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${color.gradient} rounded-2xl transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} group-hover:${index % 2 === 0 ? 'rotate-2' : '-rotate-2'} transition-transform`}></div>
                  
                  <div className="relative card-feature p-8 bg-white rounded-2xl text-center">
                    <div className={`w-20 h-20 ${color.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500`}>
                      <IconComponent className={`h-10 w-10 ${color.text}`} />
                    </div>
                    
                    <h3 className="heading-h4 text-red-600 mb-4 group-hover:text-red-700 transition-colors duration-300">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                    
                    <Link href={`/services/${service.slug || service.id}`}>
                      <Button variant="outline" className="btn-outline">
                        <span className="mr-2">Tìm Hiểu Thêm</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process Steps - AI Style */}
      <section className="section-standard bg-gradient-to-br from-gray-50/50 to-red-50/30">
        <div className="container-standard">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
              <Target className="w-4 h-4 mr-2" />
              Quy Trình Làm Việc
            </div>
            <h2 className="heading-h2 mb-4">
              Quy Trình <span className="text-red-600">Chuyên Nghiệp</span>
            </h2>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              Quy trình làm việc chuyên nghiệp và hiệu quả để đảm bảo dự án thành công, 
              từ khâu tư vấn đến triển khai và hỗ trợ sau bán hàng
            </p>
          </div>

          <div className="relative">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-red-200 via-blue-200 to-green-200 transform -translate-y-1/2 z-0"></div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6 relative z-10">
              {processSteps.map((step, index) => {
                const IconComponent = step.icon
                const colors = [
                  { bg: 'bg-red-100', text: 'text-red-600', gradient: 'from-red-100 to-red-200' },
                  { bg: 'bg-blue-100', text: 'text-blue-600', gradient: 'from-blue-100 to-blue-200' },
                  { bg: 'bg-green-100', text: 'text-green-600', gradient: 'from-green-100 to-green-200' },
                  { bg: 'bg-purple-100', text: 'text-purple-600', gradient: 'from-purple-100 to-purple-200' }
                ]
                const color = colors[index % colors.length]
                
                return (
                  <div key={index} className="relative group">
                    <div className="text-center">
                      <div className="relative mb-8 inline-block">
                        {/* Main circle */}
                        <div className="relative w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500">
                          <div className={`w-20 h-20 ${color.bg} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                            <IconComponent className={`h-10 w-10 ${color.text}`} />
                          </div>
                        </div>
                        
                        {/* Step number */}
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white">
                          {step.step}
                        </div>
                      </div>
                      
                      <h3 className="heading-h4 text-red-600 mb-4 group-hover:text-red-700 transition-colors duration-300">
                        {step.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Action button */}
          <div className="mt-16 text-center">
            <Link href="/contact">
              <Button className="btn-primary px-8 py-3 text-lg">
                Bắt Đầu Dự Án Ngay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section - AI Style */}
      <section className="section-standard">
        <div className="container-standard">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Thống Kê Dịch Vụ
            </div>
            <h2 className="heading-h2 mb-4">
              Thành Tựu <span className="text-red-600">Đáng Tự Hào</span>
            </h2>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              Những con số ấn tượng minh chứng cho chất lượng dịch vụ và sự tin tưởng của khách hàng
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
              <div className="relative card-feature p-8 bg-white rounded-2xl text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <TrendingUp className="w-8 h-8 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-red-600 mb-2">150+</div>
                <div className="text-gray-600">Dự án AI hoàn thành</div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform"></div>
              <div className="relative card-feature p-8 bg-white rounded-2xl text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-red-600 mb-2">80+</div>
                <div className="text-gray-600">Khách hàng hài lòng</div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
              <div className="relative card-feature p-8 bg-white rounded-2xl text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-red-600 mb-2">15+</div>
                <div className="text-gray-600">Giải thưởng công nghệ</div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform"></div>
              <div className="relative card-feature p-8 bg-white rounded-2xl text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Globe className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-red-600 mb-2">5+</div>
                <div className="text-gray-600">Quốc gia triển khai</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - AI Style */}
      <section className="section-standard bg-gradient-to-br from-gray-50/50 to-red-50/30">
        <div className="container-standard">
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
              
              <div className="relative card-feature p-12 bg-white rounded-2xl text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Rocket className="h-10 w-10 text-red-600" />
                </div>
                
                <h2 className="heading-h2 text-red-600 mb-6">
                  Sẵn Sàng Bắt Đầu Dự Án AI Của Bạn?
                </h2>
                
                <p className="text-body-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                  Hãy để <span className="text-red-600 font-semibold">ApecGlobal Group</span> đồng hành cùng bạn trong hành trình 
                  chuyển đổi số và phát triển công nghệ trí tuệ nhân tạo tiên tiến.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link href="/contact">
                    <Button className="btn-primary text-lg px-8 py-4">
                      Bắt Đầu Ngay
                      <Rocket className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  
                  <Link href="/contact">
                    <Button variant="outline" className="btn-outline text-lg px-8 py-4">
                      Tư Vấn Miễn Phí
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
