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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <Header />

      {/* Hero Carousel Section */}
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20"></div>
        <div className="container mx-auto relative z-10">
          <PageHeroCarousel slides={heroSlides} />
        </div>
      </section>

      {/* Main Services - AI Style */}
      <section id="main-services" className="py-20 px-4 relative">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-purple-900/10 to-transparent"></div>
        
        <div className="container mx-auto relative">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center mr-4 shadow-lg shadow-purple-900/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                  <path d="M12 2a10 10 0 0 1 10 10h-10V2z"></path>
                  <path d="M12 12l0 10"></path>
                  <path d="M12 12l10 0"></path>
                </svg>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                Dịch Vụ Chính
              </h2>
            </div>
            <div className="hidden md:block h-[1px] w-1/3 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
          </div>
          
          <p className="text-white/70 text-lg max-w-2xl mb-16">
            Các giải pháp công nghệ AI cốt lõi được phát triển bởi đội ngũ chuyên gia hàng đầu, 
            tích hợp trí tuệ nhân tạo và tự động hóa để tối ưu hóa quy trình kinh doanh của bạn.
          </p>

          <div className="space-y-16">
            {mainServices.map((service, index) => {
              const IconComponent = service.icon
              return (
                <div key={index} className="relative group">
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-purple-500/30 rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-cyan-500/30 rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <Card
                    className="bg-black/50 border-purple-500/30 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden"
                  >
                    <div className="grid lg:grid-cols-3 gap-8 p-8">
                      {/* Service Info */}
                      <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-start space-x-6">
                          <div
                            className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${service.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-purple-900/20`}
                          >
                            <IconComponent className="h-10 w-10 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                                {service.title}
                              </h3>
                              <Badge className={`bg-gradient-to-r ${service.color} px-3 py-1 text-xs font-medium uppercase tracking-wider`}>
                                {service.company}
                              </Badge>
                            </div>
                            <p className="text-white/80 text-lg leading-relaxed mb-6">{service.description}</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-3 group/feature">
                              <div className="w-6 h-6 rounded-full bg-black/30 border border-green-500/30 flex items-center justify-center flex-shrink-0 group-hover/feature:bg-green-500/20 transition-colors duration-300">
                                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                              </div>
                              <span className="text-white/80 group-hover/feature:text-white transition-colors duration-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pricing & CTA */}
                      <div className="space-y-6">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 rounded-xl blur opacity-30"></div>
                          <div className="relative bg-black/60 rounded-xl p-6 text-center backdrop-blur-sm">
                            <div className="text-3xl font-bold text-white mb-2">{service.price}</div>
                            <p className="text-white/60 text-sm">Giá khởi điểm dự án</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <Link href={`/services/${service.slug}`} className="block">
                            <Button
                              className={`w-full bg-gradient-to-r ${service.color} hover:opacity-90 transition-all duration-300 shadow-lg shadow-purple-900/20`}
                            >
                              <span className="mr-2">Tìm Hiểu Chi Tiết</span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                              </svg>
                            </Button>
                          </Link>
                          <Link href={`/services/demo/${service.slug}`} className="block">
                            <Button
                              variant="outline"
                              className="w-full border-purple-500/30 text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-cyan-600/20 hover:border-cyan-500/50 transition-all duration-300"
                            >
                              Yêu Cầu Demo
                            </Button>
                          </Link>
                        </div>

                        <div className="flex items-center justify-center space-x-1 bg-black/30 py-2 px-3 rounded-lg">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                          <span className="text-white/60 text-sm ml-2">4.9/5 (50+ reviews)</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Additional Services - AI Style */}
      <section className="py-20 px-4 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-purple-900/5 to-black/0"></div>
        
        <div className="container mx-auto relative">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center mr-4 shadow-lg shadow-cyan-900/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                Dịch Vụ Bổ Sung
              </h2>
            </div>
            <div className="hidden md:block h-[1px] w-1/3 bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
          </div>
          
          <p className="text-white/70 text-lg max-w-2xl mb-16">
            Các dịch vụ hỗ trợ và mở rộng để hoàn thiện giải pháp công nghệ AI, 
            giúp doanh nghiệp của bạn tối ưu hóa hiệu suất và tăng tính cạnh tranh.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
            {additionalServices.map((service, index) => {
              const IconComponent = service.icon
              return (
                <Card
                  key={index}
                  className="bg-black/50 border-purple-500/30 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-cyan-900/20 backdrop-blur-sm overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  
                  <CardHeader className="text-center pt-8">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur opacity-40 group-hover:opacity-70 transition-opacity duration-300 animate-pulse"></div>
                      <div className="relative w-full h-full bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <IconComponent className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-cyan-300 transition-colors duration-300">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="text-center pb-8">
                    <p className="text-white/70 text-sm leading-relaxed mb-6">{service.description}</p>
                    <Link href={`/services/${service.slug || service.id}`}>
                      <Button variant="outline" className="border-purple-500/30 text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-cyan-600/20 hover:border-cyan-500/50 transition-all duration-300">
                        <span className="mr-2">Tìm Hiểu Thêm</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process Steps - AI Style */}
      <section className="py-24 px-4 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-cyan-900/5 to-black/0"></div>
        
        <div className="container mx-auto relative">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center mr-4 shadow-lg shadow-purple-900/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                Quy Trình Làm Việc
              </h2>
            </div>
            <div className="hidden md:block h-[1px] w-1/3 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
          </div>
          
          <p className="text-white/70 text-lg max-w-2xl mb-16">
            4 bước đơn giản để biến ý tưởng thành hiện thực với công nghệ AI tiên tiến, 
            được thiết kế để tối ưu hóa quy trình và đảm bảo kết quả xuất sắc.
          </p>

          <div className="relative">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600/50 via-cyan-600/50 to-purple-600/50 transform -translate-y-1/2 z-0"></div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6 relative z-10">
              {processSteps.map((step, index) => {
                const IconComponent = step.icon
                return (
                  <div key={index} className="relative group">
                    {/* Vertical connecting line for mobile/tablet */}
                    {index < processSteps.length - 1 && (
                      <div className="md:block lg:hidden absolute top-[90px] bottom-[-60px] left-1/2 w-0.5 bg-gradient-to-b from-cyan-600/70 to-purple-600/30 transform -translate-x-1/2"></div>
                    )}
                    
                    <div className="text-center">
                      <div className="relative mb-8 inline-block">
                        {/* Glowing effect */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/30 to-cyan-600/30 blur-xl animate-pulse"></div>
                        
                        {/* Main circle */}
                        <div className="relative w-24 h-24 mx-auto bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-full flex items-center justify-center group-hover:border-cyan-500/50 transition-colors duration-500">
                          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-purple-900/30">
                            <IconComponent className="h-10 w-10 text-white" />
                          </div>
                        </div>
                        
                        {/* Step number */}
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-900/30 border-2 border-black">
                          {step.step}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300">
                        {step.title}
                      </h3>
                      
                      <p className="text-white/70 text-sm leading-relaxed max-w-xs mx-auto">
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
            <div className="relative inline-block">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <Button className="relative bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 px-8 py-3 text-lg shadow-lg shadow-purple-900/30">
                Bắt Đầu Dự Án Ngay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - AI Style */}
      <section className="py-20 px-4 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-purple-900/5 to-black/0"></div>
        
        <div className="container mx-auto relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group">
              <Card className="bg-black/50 border-purple-500/30 hover:border-cyan-500/50 text-center transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-8 relative">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-purple-600/20 to-cyan-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <TrendingUp className="h-8 w-8 text-purple-400" />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:animate-pulse">150+</div>
                  <div className="text-white/60">Dự án AI hoàn thành</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="group">
              <Card className="bg-black/50 border-purple-500/30 hover:border-cyan-500/50 text-center transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-8 relative">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-purple-600/20 to-cyan-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <Users className="h-8 w-8 text-cyan-400" />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:animate-pulse">80+</div>
                  <div className="text-white/60">Khách hàng hài lòng</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="group">
              <Card className="bg-black/50 border-purple-500/30 hover:border-cyan-500/50 text-center transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-8 relative">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-purple-600/20 to-cyan-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <Award className="h-8 w-8 text-yellow-400" />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:animate-pulse">15+</div>
                  <div className="text-white/60">Giải thưởng công nghệ</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="group">
              <Card className="bg-black/50 border-purple-500/30 hover:border-cyan-500/50 text-center transition-all duration-500 hover:shadow-lg hover:shadow-purple-900/20 backdrop-blur-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-8 relative">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-purple-600/20 to-cyan-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <Globe className="h-8 w-8 text-green-400" />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:animate-pulse">5+</div>
                  <div className="text-white/60">Quốc gia triển khai</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - AI Style */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Background circuit pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50h100M50 0v100" stroke="white" strokeWidth="0.5" fill="none" />
                <circle cx="50" cy="50" r="3" fill="white" />
                <circle cx="0" cy="50" r="3" fill="white" />
                <circle cx="100" cy="50" r="3" fill="white" />
                <circle cx="50" cy="0" r="3" fill="white" />
                <circle cx="50" cy="100" r="3" fill="white" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-pattern)" />
          </svg>
        </div>
        
        {/* AI Nodes Animation */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400/40 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                boxShadow: '0 0 10px 2px rgba(45, 212, 191, 0.3)'
              }}
            ></div>
          ))}
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto relative">
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 border-t-2 border-l-2 border-purple-500/20 rounded-tl-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 border-b-2 border-r-2 border-cyan-500/20 rounded-br-3xl"></div>
            
            <Card className="bg-black/60 border-none shadow-2xl shadow-purple-900/20 backdrop-blur-md overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600"></div>
              
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center animate-pulse">
                  <Rocket className="h-10 w-10 text-white" />
                </div>
                
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-6">
                  Sẵn Sàng Bắt Đầu Dự Án AI Của Bạn?
                </h2>
                
                <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
                  Hãy để <span className="text-cyan-400 font-semibold">ApecGlobal Group</span> đồng hành cùng bạn trong hành trình 
                  chuyển đổi số và phát triển công nghệ trí tuệ nhân tạo tiên tiến.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                    <Button className="relative bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-lg px-8 py-4 transition-all duration-300 shadow-lg shadow-purple-900/30">
                      Bắt Đầu Ngay
                      <Rocket className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                  
                  <Link href="/contact">
                    <Button
                      variant="outline"
                      className="border-purple-500/30 text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-cyan-600/20 hover:border-cyan-500/50 text-lg px-8 py-4 transition-all duration-300"
                    >
                      Tư Vấn Miễn Phí
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 px-4 relative">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Quy Trình Làm Việc
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => {
              const IconComponent = step.icon
              return (
                <div key={index} className="relative">
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent z-0"></div>
                  )}
                  <Card className="bg-black/50 border-purple-500/30 hover:border-cyan-500/50 transition-all duration-300 relative z-10">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center mb-4">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-purple-400 mb-2">{step.step}</div>
                      <CardTitle className="text-white">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/80 text-center">{step.description}</p>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
