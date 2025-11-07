import React from "react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import HeroCarousel from "@/components/hero-carousel"
import MemberCompanies from "@/components/member-companies"
import HomeProjects from "@/components/home-projects"
import type { LucideIcon } from "lucide-react"
import {
  Star, Quote, ArrowRight, Rocket, Shield, Brain, Network, Cloud, Cpu, Atom,
  Zap, Target, Building2, History, Crown, Users, Code, Database,
  Smartphone, Server, Briefcase, UserCheck, MapPin,
  Award, CheckCircle, ExternalLink, Phone, Clock, DollarSign,
  TrendingUp, BarChart3, Activity, Settings,
  Wrench, Headphones, GraduationCap, Coffee, Heart, MessageSquare, User,
  Globe
} from "lucide-react"
import { getAllProjects, getAllServices } from "@/lib/db"

// Helper function to get icon component from icon name
const getServiceIcon = (iconName: string | null) => {
  const iconMap: Record<string, LucideIcon> = {
    code: Code,
    database: Database,
    smartphone: Smartphone,
    server: Server,
    briefcase: Briefcase,
    shield: Shield,
    brain: Brain,
    cloud: Cloud,
    cpu: Cpu,
    barchart3: BarChart3,
    settings: Settings,
    wrench: Wrench,
    headphones: Headphones
  }
  return iconMap[iconName?.toLowerCase() || ''] || Code
}

// Helper function to get color classes based on index
const getServiceColorClasses = (index: number) => {
  const colors = [
    { border: 'border-blue-100 hover:border-blue-300', bg: 'bg-blue-50', iconBg: 'bg-blue-100', text: 'text-blue-700', tag: 'bg-blue-100 text-blue-700', hover: 'hover:from-blue-50/50' },
    { border: 'border-green-100 hover:border-green-300', bg: 'bg-green-50', iconBg: 'bg-green-100', text: 'text-green-700', tag: 'bg-green-100 text-green-700', hover: 'hover:from-green-50/50' },
    { border: 'border-purple-100 hover:border-purple-300', bg: 'bg-purple-50', iconBg: 'bg-purple-100', text: 'text-purple-700', tag: 'bg-purple-100 text-purple-700', hover: 'hover:from-purple-50/50' },
    { border: 'border-orange-100 hover:border-orange-300', bg: 'bg-orange-50', iconBg: 'bg-orange-100', text: 'text-orange-700', tag: 'bg-orange-100 text-orange-700', hover: 'hover:from-orange-50/50' },
    { border: 'border-red-100 hover:border-red-300', bg: 'bg-red-50', iconBg: 'bg-red-100', text: 'text-red-700', tag: 'bg-red-100 text-red-700', hover: 'hover:from-red-50/50' },
    { border: 'border-indigo-100 hover:border-indigo-300', bg: 'bg-indigo-50', iconBg: 'bg-indigo-100', text: 'text-indigo-700', tag: 'bg-indigo-100 text-indigo-700', hover: 'hover:from-indigo-50/50' }
  ]
  return colors[index % colors.length]
}

const sectionHeadingClass = "text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900"
const sectionDescriptionClass = "text-body-lg text-gray-600 max-w-3xl mx-auto"
const badgeClass = "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
const cardGridClass = "grid gap-4 sm:gap-6 lg:gap-8"
const gradientRingClass = "absolute inset-0 rounded-3xl bg-gradient-to-br from-red-100/60 via-white to-purple-100/60 blur-0"
const metricValueClass = "text-2xl font-semibold text-gray-900"

// Use dynamic content from database, fallback to defaults
const infoHighlights = homeContent.infoHighlights.length > 0 ? homeContent.infoHighlights.map(item => ({
  ...item,
  icon: getServiceIcon(item.icon)
})) : [
  {
    icon: Building2,
    title: "Quy mô & Vốn hóa",
    description: (
      <>
        Vốn hoạt động <span className="font-semibold text-red-600">2.868 tỷ đồng</span>,<br className="hidden xl:block" />
        thuộc hệ sinh thái <span className="font-semibold text-red-600">IMP Holding Hoa Kỳ</span>.
      </>
    ),
    accent: "red"
  },
  {
    icon: Building2,
    title: "Lĩnh vực trọng điểm",
    description: "Tài chính, công nghệ, thương mại, kinh tế cộng đồng và kinh tế tuần hoàn.",
    accent: "blue"
  },
  {
    icon: MapPin,
    title: "Trụ sở & Liên hệ",
    description: "04 Lê Tuấn Mậu, Q6, TP. HCM · Hotline: 1900 3165 · info@apecglobal.vn",
    accent: "green"
  },
  {
    icon: Globe,
    title: "Hệ sinh thái thương hiệu",
    description: "Apec BCI, Life Care, Ecoop, Queency, Nam Thiên Long Security, Kangaroo I-On…",
    accent: "purple"
  }
]

const quickFacts = homeContent.quickFacts.length > 0 ? homeContent.quickFacts.map(item => ({
  ...item,
  icon: getServiceIcon(item.icon)
})) : [
  {
    icon: History,
    label: "2004 - 2024",
    description: "Hành trình mở rộng từ bảo vệ tới công nghệ",
    accent: "red"
  },
  {
    icon: Building2,
    label: "Đa ngành",
    description: "Tài chính, công nghệ, thương mại, cộng đồng",
    accent: "blue"
  },
  {
    icon: Users,
    label: "Cộng đồng mạnh",
    description: "Hỗ trợ doanh nghiệp, phát triển thẻ Apec",
    accent: "green"
  },
  {
    icon: Crown,
    label: "Đối tác chiến lược",
    description: "ASI, EDEN, ARIC, HappyLand, METTITECH, SST",
    accent: "purple"
  }
]

const valuePillars = homeContent.valuePillars.length > 0 ? homeContent.valuePillars.map(item => ({
  ...item,
  icon: getServiceIcon(item.icon)
})) : [
  {
    icon: Target,
    title: "Tầm Nhìn",
    description: "10 năm trở thành tập đoàn đầu tư đa quốc gia với hệ sinh thái khỏe mạnh.",
    accent: "red"
  },
  {
    icon: Building2,
    title: "Sứ Mệnh",
    description: "Đầu tư, tái thiết doanh nghiệp, nâng tầm thương hiệu và tri thức hiện đại.",
    accent: "blue"
  },
  {
    icon: History,
    title: "Giá Trị Cốt Lõi",
    description: "TÂM sáng, TÂM bảo, TÂM huyết, TÂM khởi, TÂM thục, TÂM đạo.",
    accent: "green"
  },
  {
    icon: Crown,
    title: "Định Hướng",
    description: "Chứng tỏ kiến tạo giá trị, tạo nền tảng bền vững cho cộng đồng.",
    accent: "purple"
  }
]

const careerBenefits = homeContent.careerBenefits.length > 0 ? homeContent.careerBenefits.map(item => ({
  ...item,
  icon: getServiceIcon(item.icon)
})) : [
  {
    icon: Heart,
    title: "Môi trường tuyệt vời",
    description: "Văn hóa tích cực, đồng nghiệp thân thiện, hỗ trợ nhiệt tình.",
    accent: "red"
  },
  {
    icon: TrendingUp,
    title: "Cơ hội phát triển",
    description: "Đào tạo liên tục, thăng tiến rõ ràng, dự án công nghệ tiên tiến.",
    accent: "blue"
  },
  {
    icon: DollarSign,
    title: "Lương thưởng hấp dẫn",
    description: "Lương cạnh tranh, thưởng hiệu suất, phúc lợi đầy đủ.",
    accent: "green"
  },
  {
    icon: Coffee,
    title: "Work-life balance",
    description: "Linh hoạt, remote, nhiều hoạt động kết nối đội nhóm.",
    accent: "purple"
  }
]

const ctaMetrics = homeContent.ctaMetrics.length > 0 ? homeContent.ctaMetrics : [
  { value: "5+", label: "Công ty thành viên" },
  { value: "100+", label: "Dự án thành công" },
  { value: "1000+", label: "Khách hàng tin tưởng" },
  { value: "24/7", label: "Hỗ trợ khách hàng" }
]

interface ShowcaseCardProps {
  icon: LucideIcon
  title: string
  description: string
  primaryColor: string
  tags: string[]
  status?: {
    label: string
    icon: LucideIcon
    color: string
  }
}

const sectionBadgeMap: Record<string, string> = {
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  purple: "bg-purple-100 text-purple-700",
  orange: "bg-orange-100 text-orange-700",
  indigo: "bg-indigo-100 text-indigo-700"
}

const pillarCardClass = "group rounded-2xl border border-gray-100 bg-white/70 backdrop-blur p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
const highlightCardClass = "flex items-start space-x-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
const factCardClass = "group rounded-2xl bg-white/80 backdrop-blur p-6 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300"

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let dbProjects = []
  let dbServices = []
  let homeContent = {
    infoHighlights: [],
    quickFacts: [],
    valuePillars: [],
    careerBenefits: [],
    ctaMetrics: [],
    introSection: {},
    techShowcaseSection: {},
    servicesSection: {},
    companyOverviewSection: {},
    ctaSection: {}
  }

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

  // Fetch services from database
  try {
    dbServices = await getAllServices()
    // Limit to 6 services for home page
    dbServices = dbServices.slice(0, 6)
  } catch (error) {
    console.error('Error fetching services:', error)
    dbServices = []
  }

  // Fetch home content from database
  try {
    const homeContentResponse = await fetch(`${baseUrl}/api/home-content`, {
      cache: 'no-store'
    })

    if (homeContentResponse.ok) {
      const homeContentResult = await homeContentResponse.json()
      if (homeContentResult.success) {
        homeContent = homeContentResult.data
      }
    }
  } catch (error) {
    console.error('Error fetching home content:', error)
    // Use default values if API fails
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

      {/* Projects Section */}
      <HomeProjects />

      {/* Giới thiệu công ty - REIMAGINED */}
      <section className="section-standard bg-white">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-100/20 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl -z-0"></div>

        <div className="container-standard relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className={`${badgeClass} bg-gradient-to-r from-red-100 to-red-50 text-red-700 w-fit shadow-sm`}>
                <Building2 className="w-4 h-4 mr-2" />
                {homeContent.introSection?.badge || "Về Chúng Tôi"}
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
                  {homeContent.introSection?.heading || "Kiến tạo hệ sinh thái Công nghệ - Thương mại - Cộng đồng"}
                </h2>

                <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-red-400 rounded-full"></div>
              </div>

              <p className="text-lg text-gray-600 leading-relaxed">
                {homeContent.introSection?.description || (
                  <>
                    <span className="font-semibold text-gray-900">Tập Đoàn Kinh Tế ApecGlobal</span> với slogan{" "}
                    <span className="text-red-600 font-semibold italic">"Kiến Tạo Giá Trị - Làm Chủ Tương Lai"</span>{" "}
                    hướng tới nền kinh tế tuần hoàn bền vững, kết nối doanh nghiệp và cộng đồng
                    thông qua chuyển đổi số, thương mại thông minh và chuỗi giá trị nhân văn.
                  </>
                )}
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {infoHighlights.map((item, index) => {
                  const accentColors = {
                    red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200', hover: 'hover:border-red-300' },
                    blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200', hover: 'hover:border-blue-300' },
                    green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200', hover: 'hover:border-green-300' },
                    purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200', hover: 'hover:border-purple-300' }
                  }
                  const colors = accentColors[item.accent as keyof typeof accentColors]
                  
                  return (
                    <div
                      key={item.title}
                      className={`group p-5 bg-white rounded-2xl border-2 ${colors.border} ${colors.hover} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${colors.bg} group-hover:scale-110 transition-transform duration-300`}>                      
                          <item.icon className={`w-6 h-6 ${colors.text}`} />
                        </div>
                        <div className="space-y-2 flex-1">
                          <h4 className="font-semibold text-gray-900 text-base">{item.title}</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex flex-row gap-3 sm:gap-4 pt-2">
                <Link href="/about" className="flex items-center btn-primary group flex-1 justify-center text-sm sm:text-base shadow-lg hover:shadow-xl">
                  <span className="hidden sm:inline">Tìm Hiểu Thêm</span>
                  <span className="sm:hidden">Tìm Hiểu</span>
                  <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/contact" className="flex items-center btn-outline group flex-1 justify-center text-sm sm:text-base shadow-md hover:shadow-lg">
                  <span className="hidden sm:inline">Liên Hệ Ngay</span>
                  <span className="sm:hidden">Liên Hệ</span>
                  <Phone className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-100/60 via-purple-100/40 to-blue-100/60 rounded-3xl blur-xl"></div>
                <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-600 to-red-500 p-6 text-center">
                    <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                      <Award className="w-6 h-6" />
                      Thông tin nhanh
                    </h3>
                  </div>
                  
                  <div className="p-8">
                    <div className={`${cardGridClass} grid-cols-2 gap-6`}>
                      {quickFacts.map((fact, index) => {
                        const accentColors = {
                          red: { bg: 'bg-red-100', text: 'text-red-600', ring: 'ring-red-200' },
                          blue: { bg: 'bg-blue-100', text: 'text-blue-600', ring: 'ring-blue-200' },
                          green: { bg: 'bg-green-100', text: 'text-green-600', ring: 'ring-green-200' },
                          purple: { bg: 'bg-purple-100', text: 'text-purple-600', ring: 'ring-purple-200' }
                        }
                        const colors = accentColors[fact.accent as keyof typeof accentColors]
                        
                        return (
                          <div
                            key={fact.label}
                            className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-white/90 p-4 text-left transition-all duration-300 hover:border-gray-300 hover:shadow-lg"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${colors.bg} group-hover:scale-105 transition-transform duration-300`}> 
                              <fact.icon className={`h-7 w-7 ${colors.text}`} />
                            </div>
                            <div className="space-y-1">
                              <div className={`text-base font-semibold ${colors.text}`}>{fact.label}</div>
                              <p className="text-sm text-gray-600 leading-relaxed">{fact.description}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-8 bg-gradient-to-br from-red-50 via-red-50/50 to-orange-50/50 rounded-2xl p-6 border-2 border-red-100 shadow-inner">
                      <h4 className="text-red-700 font-bold mb-4 flex items-center justify-center gap-2 text-lg">
                        <Star className="w-5 h-5 fill-red-600" />
                        Tuyên ngôn giá trị
                      </h4>
                      <ul className="text-gray-700 text-sm space-y-3">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <span className="text-red-600 font-semibold">"Kiến tạo giá trị, dựng xây tương lai bền vững."</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <span className="text-red-600 font-semibold">"Đồng hành cùng doanh nghiệp và cộng đồng phát triển."</span>
                        </li>
                        <li className="flex items-center justify-center gap-2 pt-2 border-t border-red-200">
                          <Globe className="w-4 h-4 text-red-600" />
                          <Link
                            href="https://www.apecglobal.vn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 hover:text-red-700 font-semibold hover:underline inline-flex items-center gap-1"
                          >
                            www.apecglobal.vn
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Showcase - IMPROVED */}
      <section className="section-standard bg-white">
          <div className="container-standard">
            <div className="text-center mb-16">
              <div className={`${badgeClass} bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 mx-auto w-fit shadow-sm mb-4`}>
                <Cpu className="w-4 h-4 mr-2" />
                {homeContent.techShowcaseSection?.badge || "Công Nghệ Của Chúng Tôi"}
              </div>
              <h2 className={sectionHeadingClass}>
                {homeContent.techShowcaseSection?.heading || (
                  <>
                    Giải pháp <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">đột phá cho chuyển đổi số</span>
                  </>
                )}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-red-400 rounded-full mx-auto mt-4 mb-6"></div>
              <p className={sectionDescriptionClass}>
                {homeContent.techShowcaseSection?.description || "Chúng tôi xây dựng hệ sinh thái giải pháp toàn diện từ chiến lược, thiết kế tới vận hành, giúp doanh nghiệp tăng tốc chuyển đổi số bền vững."}
              </p>
            </div>
            <div className={`${cardGridClass} grid-cols-2 lg:grid-cols-4`}>
              {/* AI & Machine Learning */}
              <div className="group">
                <div className="tech-card border-2 border-red-100 hover:border-red-300 rounded-2xl p-6 bg-white hover:bg-gradient-to-br hover:from-red-50/50 hover:to-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="tech-card-icon bg-red-50 group-hover:bg-red-100 transition-colors duration-300">
                    <Brain className="tech-card-icon-inner text-red-600" />
                  </div>
                  <h3 className="tech-card-title text-red-700 font-bold">AI & Machine Learning</h3>
                  <p className="tech-card-description text-gray-600">
                    Hệ thống đề xuất thông minh, tự động hóa quy trình, tối ưu vận hành.
                  </p>
                  <div className="tech-card-tags">
                    <span className="tech-card-tag bg-red-100 text-red-700 font-medium">Deep Learning</span>
                    <span className="tech-card-tag bg-red-100 text-red-700 font-medium">GenAI</span>
                  </div>
                </div>
              </div>

              {/* Blockchain */}
              <div className="group">
                <div className="tech-card border-2 border-blue-100 hover:border-blue-300 rounded-2xl p-6 bg-white hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="tech-card-icon bg-blue-50 group-hover:bg-blue-100 transition-colors duration-300">
                    <Network className="tech-card-icon-inner text-blue-600" />
                  </div>
                  <h3 className="tech-card-title text-blue-700 font-bold">Blockchain</h3>
                  <p className="tech-card-description text-gray-600">
                    Giải pháp blockchain cho giao dịch bảo mật và hợp đồng thông minh.
                  </p>
                  <div className="tech-card-tags">
                    <span className="tech-card-tag bg-blue-100 text-blue-700 font-medium">Smart Contract</span>
                    <span className="tech-card-tag bg-blue-100 text-blue-700 font-medium">Tokenization</span>
                  </div>
                </div>
              </div>

              {/* Cloud Computing */}
              <div className="group">
                <div className="tech-card border-2 border-green-100 hover:border-green-300 rounded-2xl p-6 bg-white hover:bg-gradient-to-br hover:from-green-50/50 hover:to-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="tech-card-icon bg-green-50 group-hover:bg-green-100 transition-colors duration-300">
                    <Cloud className="tech-card-icon-inner text-green-600" />
                  </div>
                  <h3 className="tech-card-title text-green-700 font-bold">Cloud & DevOps</h3>
                  <p className="tech-card-description text-gray-600">
                    Thiết kế hạ tầng hybrid cloud, bảo đảm an toàn và khả năng mở rộng linh hoạt.
                  </p>
                  <div className="tech-card-tags">
                    <span className="tech-card-tag bg-green-100 text-green-700 font-medium">AWS</span>
                    <span className="tech-card-tag bg-green-100 text-green-700 font-medium">Kubernetes</span>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="tech-card border-2 border-purple-100 hover:border-purple-300 rounded-2xl p-6 bg-white hover:bg-gradient-to-br hover:from-purple-50/50 hover:to-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="tech-card-icon bg-purple-50 group-hover:bg-purple-100 transition-colors duration-300">
                    <Database className="tech-card-icon-inner text-purple-600" />
                  </div>
                  <h3 className="tech-card-title text-purple-700 font-bold">Big Data & Analytics</h3>
                  <p className="tech-card-description text-gray-600">
                    Kiến trúc dữ liệu lớn, dashboard realtime và ra quyết định dựa trên dữ liệu.
                  </p>
                  <div className="tech-card-tags">
                    <span className="tech-card-tag bg-purple-100 text-purple-700 font-medium">Realtime</span>
                    <span className="tech-card-tag bg-purple-100 text-purple-700 font-medium">BI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dịch vụ chính - IMPROVED */}
        <section className="section-gray bg-gradient-to-br from-gray-50 to-gray-100/50">
          <div className="container-standard">
            <div className="text-center mb-16">
              <div className={`${badgeClass} bg-gradient-to-r from-green-100 to-green-50 text-green-700 mx-auto w-fit shadow-sm mb-4`}>
                <Settings className="w-4 h-4 mr-2" />
                {homeContent.servicesSection?.badge || "Dịch Vụ Của Chúng Tôi"}
              </div>
              <h2 className={sectionHeadingClass}>
                {homeContent.servicesSection?.heading || (
                  <>
                    Giải pháp <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">Toàn diện</span>
                  </>
                )}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-red-400 rounded-full mx-auto mt-4 mb-6"></div>
              <p className={sectionDescriptionClass}>
                {homeContent.servicesSection?.description || "Từ ý tưởng đến sản phẩm hoàn thiện, chúng tôi đồng hành cùng bạn trong mọi giai đoạn phát triển công nghệ với đội ngũ chuyên gia giàu kinh nghiệm."}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {dbServices.length > 0 ? (
                dbServices.map((service, index) => {
                  const IconComponent = getServiceIcon(service.icon)
                  const colors = getServiceColorClasses(index)
                  const features = service.features || []
                  
                  return (
                    <div key={service.id} className="group">
                      <Link href={`/services/${service.slug || service.id}`}>
                        <div className={`service-card border-2 ${colors.border} rounded-2xl p-6 bg-white hover:bg-gradient-to-br ${colors.hover} hover:to-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer`}>
                          <div className={`service-card-icon ${colors.bg} group-hover:${colors.iconBg} transition-colors duration-300`}>
                            <IconComponent className={`service-card-icon-inner ${colors.text.replace('text-', 'text-').replace('-700', '-600')}`} />
                          </div>
                          <h3 className={`service-card-title ${colors.text} font-bold`}>{service.title}</h3>
                          <p className="service-card-description text-gray-600">
                            {service.description}
                          </p>
                          {features.length > 0 && (
                            <div className="service-card-tags">
                              {features.slice(0, 2).map((feature, idx) => (
                                <span key={idx} className={`service-card-tag ${colors.tag} font-medium`}>
                                  {feature}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>
                  )
                })
              ) : (
                // Fallback content if no services in database
                <>
                  <div className="group">
                    <div className="service-card border-2 border-blue-100 hover:border-blue-300 rounded-2xl p-6 bg-white hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                      <div className="service-card-icon bg-blue-50 group-hover:bg-blue-100 transition-colors duration-300">
                        <Code className="service-card-icon-inner text-blue-600" />
                      </div>
                      <h3 className="service-card-title text-blue-700 font-bold">Phát Triển Phần Mềm</h3>
                      <p className="service-card-description text-gray-600">
                        Thiết kế ứng dụng web, mobile, desktop với công nghệ hiện đại
                      </p>
                      <div className="service-card-tags">
                        <span className="service-card-tag bg-blue-100 text-blue-700 font-medium">Web Apps</span>
                        <span className="service-card-tag bg-blue-100 text-blue-700 font-medium">Mobile Apps</span>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="service-card border-2 border-green-100 hover:border-green-300 rounded-2xl p-6 bg-white hover:bg-gradient-to-br hover:from-green-50/50 hover:to-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                      <div className="service-card-icon bg-green-50 group-hover:bg-green-100 transition-colors duration-300">
                        <Briefcase className="service-card-icon-inner text-green-600" />
                      </div>
                      <h3 className="service-card-title text-green-700 font-bold">Tư Vấn Công Nghệ</h3>
                      <p className="service-card-description text-gray-600">
                        Tư vấn chiến lược công nghệ, chuyển đổi số và tối ưu hóa quy trình
                      </p>
                      <div className="service-card-tags">
                        <span className="service-card-tag bg-green-100 text-green-700 font-medium">Digital Transform</span>
                        <span className="service-card-tag bg-green-100 text-green-700 font-medium">Tech Strategy</span>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="service-card border-2 border-purple-100 hover:border-purple-300 rounded-2xl p-6 bg-white hover:bg-gradient-to-br hover:from-purple-50/50 hover:to-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                      <div className="service-card-icon bg-purple-50 group-hover:bg-purple-100 transition-colors duration-300">
                        <Server className="service-card-icon-inner text-purple-600" />
                      </div>
                      <h3 className="service-card-title text-purple-700 font-bold">Cloud & DevOps</h3>
                      <p className="service-card-description text-gray-600">
                        Triển khai và quản lý hạ tầng cloud, CI/CD và monitoring
                      </p>
                      <div className="service-card-tags">
                        <span className="service-card-tag bg-purple-100 text-purple-700 font-medium">AWS/Azure</span>
                        <span className="service-card-tag bg-purple-100 text-purple-700 font-medium">CI/CD</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {dbServices.length > 0 && (
              <div className="text-center mt-12">
                <Link href="/services" className="inline-flex items-center btn-primary group shadow-lg hover:shadow-xl">
                  <span>Xem Tất Cả Dịch Vụ</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Member Companies */}
        <MemberCompanies />

        {/* Company Overview - IMPROVED */}
        <section className="section-standard bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl -z-0"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl -z-0"></div>

          <div className="container-standard relative z-10">
            <div className="text-center mb-16">
              <div className={`${badgeClass} bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 mx-auto w-fit shadow-sm mb-4`}>
                <Crown className="w-4 h-4 mr-2" />
                {homeContent.companyOverviewSection?.badge || "Giá Trị Cốt Lõi"}
              </div>
              <h2 className={sectionHeadingClass}>
                {homeContent.companyOverviewSection?.heading || (
                  <>
                    Tại sao chọn <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">ApecGlobal</span>?
                  </>
                )}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-red-400 rounded-full mx-auto mt-4 mb-6"></div>
              <p className={sectionDescriptionClass}>
                {homeContent.companyOverviewSection?.description || "Hệ sinh thái đồng bộ từ tài chính, công nghệ đến thương mại giúp doanh nghiệp phát triển bền vững."}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {valuePillars.map((pillar, index) => {
                const accentColors = {
                  red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', hover: 'hover:border-red-300', iconBg: 'bg-red-100' },
                  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', hover: 'hover:border-blue-300', iconBg: 'bg-blue-100' },
                  green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', hover: 'hover:border-green-300', iconBg: 'bg-green-100' },
                  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', hover: 'hover:border-purple-300', iconBg: 'bg-purple-100' }
                }
                const colors = accentColors[pillar.accent as keyof typeof accentColors]
                
                return (
                  <div key={pillar.title} className="group">
                    <div className={`value-card border-2 ${colors.border} ${colors.hover} rounded-2xl p-6 bg-white hover:bg-gradient-to-br hover:from-${pillar.accent}-50/50 hover:to-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}>
                      <div className={`value-card-icon ${colors.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                        <pillar.icon className={`value-card-icon-inner ${colors.text}`} />
                      </div>
                      <h3 className={`value-card-title ${colors.text} font-bold`}>{pillar.title}</h3>
                      <p className="value-card-description text-gray-600">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Call to Action Section - IMPROVED */}
        <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-red-600">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto relative z-10 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
                {homeContent.ctaSection?.heading || (
                  <>
                    Sẵn Sàng Cho <span className="text-yellow-300">Tương Lai</span>?
                  </>
                )}
              </h2>
              <p className="text-xl sm:text-2xl text-white/90 mb-8 leading-relaxed">
                {homeContent.ctaSection?.description || (
                  <>
                    Hãy cùng ApecGlobal tạo ra những <span className="font-semibold text-yellow-300">giải pháp công nghệ đột phá</span>, định hình tương lai số cho doanh nghiệp của bạn.
                  </>
                )}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link href="/contact" className="px-8 py-4 bg-white hover:bg-gray-50 text-red-600 text-lg font-bold rounded-full hover:scale-110 transform transition-all duration-300 shadow-2xl min-w-[200px] text-center inline-flex items-center justify-center gap-2">
                  {homeContent.ctaSection?.primaryButton || "Bắt Đầu Ngay"}
                  <Rocket className="h-6 w-6" />
                </Link>

                <Link href="/about" className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600 text-lg font-bold rounded-full hover:scale-110 transform transition-all duration-300 shadow-2xl min-w-[200px] text-center inline-flex items-center justify-center gap-2">
                  {homeContent.ctaSection?.secondaryButton || "Tìm Hiểu Thêm"}
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </div>
              
              {/* Achievement numbers */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {ctaMetrics.map((metric, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="text-4xl font-bold text-white mb-2">{metric.value}</div>
                    <div className="text-white/80 text-sm">{metric.label}</div>
                  </div>
                ))}
              </div>
              
              {/* Tech stack icons */}
              <div className="flex justify-center items-center space-x-8 opacity-80">
                <div className="text-white hover:scale-125 transition-transform duration-300">
                  <Brain className="h-8 w-8" />
                </div>
                <div className="text-white hover:scale-125 transition-transform duration-300">
                  <Network className="h-8 w-8" />
                </div>
                <div className="text-white hover:scale-125 transition-transform duration-300">
                  <Cloud className="h-8 w-8" />
                </div>
                <div className="text-white hover:scale-125 transition-transform duration-300">
                  <Cpu className="h-8 w-8" />
                </div>
                <div className="text-yellow-300 hover:scale-125 transition-transform duration-300">
                  <Shield className="h-8 w-8" />
                </div>
                <div className="text-white hover:scale-125 transition-transform duration-300">
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