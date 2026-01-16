"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import PageHeroCarousel from "@/components/page-hero-carousel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Brain, Shield, Heart, Clock, Cpu, ExternalLink, Users, Calendar, TrendingUp, Mail, Phone, MapPin, Globe, Sparkles, Facebook, Twitter, Linkedin, Youtube, ArrowUpRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Company } from "@/lib/schema"
import { useApiCache } from "@/hooks/use-api-cache"

// Hàm để lấy icon dựa trên tên công ty
const getCompanyIcon = (name: string) => {
  switch (name) {
    case "ApecTech":
      return Brain
    case "GuardCam":
      return Shield
    case "EmoCommerce":
      return Heart
    case "TimeLoop":
      return Clock
    case "ApecNeuroOS":
      return Cpu
    default:
      return Brain
  }
}

// Hàm để lấy màu gradient dựa trên tên công ty
const getCompanyColor = (name: string) => {
  switch (name) {
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

// Hàm để lấy chuyên môn dựa trên tên công ty
const getCompanySpecialties = (name: string) => {
  switch (name) {
    case "ApecTech":
      return ["Machine Learning", "Natural Language Processing", "Computer Vision", "Educational Technology"]
    case "GuardCam":
      return ["Computer Vision", "IoT Security", "Real-time Monitoring", "Facial Recognition"]
    case "EmoCommerce":
      return ["Emotion AI", "E-commerce", "Customer Analytics", "Personalization"]
    case "TimeLoop":
      return ["Behavioral Analytics", "Time Optimization", "Data Visualization", "Productivity Tools"]
    case "ApecNeuroOS":
      return ["Operating Systems", "Enterprise Software", "AI Integration", "Automation"]
    default:
      return []
  }
}

// Hàm để lấy mô tả ngắn dựa trên tên công ty
const getCompanyShortDescription = (name: string) => {
  switch (name) {
    case "ApecTech":
      return "AI và học tập số"
    case "GuardCam":
      return "Bảo mật công nghệ"
    case "EmoCommerce":
      return "Thương mại điện tử cảm xúc"
    case "TimeLoop":
      return "Phân tích hành vi và thời gian"
    case "ApecNeuroOS":
      return "Hệ điều hành doanh nghiệp tương lai"
    default:
      return "Công nghệ tiên tiến"
  }
}

export default function CompaniesPage() {
  // Lấy dữ liệu từ API companies
  const { data: apiResponse, loading, error } = useApiCache<any>(
    'companies-list',
    async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '/api'
      const response = await fetch(`${baseUrl}/companies`)
      if (!response.ok) {
        throw new Error('Failed to fetch companies')
      }
      console.log('🌐 Fetched companies API response:', response)
      return response.json()
    },
    5 * 60 * 1000 // Cache 5 phút
  )

  // Extract companies array từ API response
  const apiCompanies = apiResponse?.success ? apiResponse.data : []
  
  // Chuyển đổi dữ liệu từ API sang định dạng hiển thị  
  const companies = apiCompanies
    .filter((company: any) => company.slug !== 'apecglobal')
    .map((company: any) => {
      return {
        id: company.id,
        name: company.name,
        slug: company.slug,
        icon: getCompanyIcon(company.name),
        logo_url: company.logo_url,
        description: company.short_description || getCompanyShortDescription(company.name),
        fullDescription: company.description,
        color: getCompanyColor(company.name),
        href: `/companies/${company.slug}`,
        founded: company.established_date ? new Date(company.established_date).getFullYear().toString() : new Date().getFullYear().toString(),
        employees: `${company.employee_count || 0}+`,
        projects: `${company.projects_count || 0}+`,
        specialties: getCompanySpecialties(company.name),
        industry: company.industry || "Technology",
        website: company.website_url,
        address: company.address,
        phone: company.phone,
        email: company.email,
        is_featured: company.is_featured || false,
        
        // Thêm thông tin mới
        mission: company.mission,
        vision: company.vision,
        values: company.values || [],
        achievements: company.achievements || [],
        facebook_url: company.facebook_url,
        twitter_url: company.twitter_url,
        linkedin_url: company.linkedin_url,
        youtube_url: company.youtube_url,
        
        // Media
        image_url: company.image_url,
        gallery: company.gallery || [],
      }
    })

  // Hero slides for Companies page
  const heroSlides = [
    {
      title: "CÔNG TY THÀNH VIÊN",
      subtitle: "Khám phá hệ sinh thái công nghệ đa dạng của ApecGlobal với 5+ công ty thành viên, mỗi công ty chuyên sâu về một lĩnh vực công nghệ cụ thể",
      gradient: "from-purple-400 via-white to-blue-400",
      backgroundImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Khám Phá Ngay",
        href: "#companies-grid",
        gradient: "from-purple-600 to-blue-600",
        hoverGradient: "from-purple-700 to-blue-700"
      },
      secondaryButton: {
        text: "Liên Hệ Hợp Tác",
        href: "/contact",
        borderColor: "border-purple-500/50",
        hoverBg: "bg-purple-500/20",
        hoverBorder: "border-purple-400"
      }
    },
    {
      title: "APECTECH - AI & GIÁO DỤC",
      subtitle: "Công ty tiên phong trong lĩnh vực trí tuệ nhân tạo và công nghệ giáo dục, phát triển các giải pháp học tập thông minh",
      gradient: "from-blue-400 via-white to-cyan-400",
      backgroundImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Tìm Hiểu ApecTech",
        href: "/companies/apectech",
        gradient: "from-blue-600 to-cyan-600",
        hoverGradient: "from-blue-700 to-cyan-700"
      },
      secondaryButton: {
        text: "Xem Dịch Vụ AI",
        href: "/services",
        borderColor: "border-blue-500/50",
        hoverBg: "bg-blue-500/20",
        hoverBorder: "border-blue-400"
      }
    },
    {
      title: "GUARDCAM - BẢO MẬT THÔNG MINH",
      subtitle: "Chuyên gia về giải pháp bảo mật và giám sát thông minh với công nghệ computer vision và IoT tiên tiến",
      gradient: "from-green-400 via-white to-emerald-400",
      backgroundImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Khám Phá GuardCam",
        href: "/companies/guardcam",
        gradient: "from-green-600 to-emerald-600",
        hoverGradient: "from-green-700 to-emerald-700"
      },
      secondaryButton: {
        text: "Giải Pháp Bảo Mật",
        href: "/services",
        borderColor: "border-green-500/50",
        hoverBg: "bg-green-500/20",
        hoverBorder: "border-green-400"
      }
    },
    {
      title: "EMOCOMMERCE - THƯƠNG MẠI CẢM XÚC",
      subtitle: "Nền tảng thương mại điện tử thông minh với công nghệ phân tích cảm xúc và cá nhân hóa trải nghiệm khách hàng",
      gradient: "from-pink-400 via-white to-rose-400",
      backgroundImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1920&h=1080&q=80",
      heroImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&h=800&q=80",
      primaryButton: {
        text: "Tìm Hiểu EmoCommerce",
        href: "/companies/emocommerce",
        gradient: "from-pink-600 to-rose-600",
        hoverGradient: "from-pink-700 to-rose-700"
      },
      secondaryButton: {
        text: "Dự Án E-commerce",
        href: "/projects",
        borderColor: "border-pink-500/50",
        hoverBg: "bg-pink-500/20",
        hoverBorder: "border-pink-400"
      }
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/60 to-blue-50/60 text-slate-900">
      <Header />

      {/* Hero Carousel Section */}
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_55%)]" />
        <div className="hero-carousel-container relative z-10">
          <PageHeroCarousel slides={heroSlides} />
        </div>
      </section>

      {/* Companies Grid */}
      <section id="companies-grid" className="relative section-standard">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.1),_transparent_55%)]" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-white via-white/80 to-transparent" />
        </div>

        <div className="container-standard relative z-10">
          <div className="flex flex-col items-center gap-6 text-center mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
              <Sparkles className="h-4 w-4 text-rose-400" />
              Hệ Sinh Thái Công Nghệ
            </div>
            <div className="flex flex-col gap-4 max-w-4xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Khám Phá Những <span className="text-rose-400">Doanh Nghiệp tiên phong</span> trong hệ sinh thái ApecGlobal
              </h2>
              <p className="text-base md:text-lg text-white/70">
                Mỗi công ty là một mảnh ghép chiến lược trong hành trình chuyển đổi số, dẫn đầu về công nghệ lõi, trải nghiệm người dùng và vận hành thông minh.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm text-slate-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-slate-200 px-4 py-2 shadow-sm">
                <Calendar className="h-4 w-4 text-rose-400" /> Thành lập trung bình năm 2018
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-slate-200 px-4 py-2 shadow-sm">
                <Users className="h-4 w-4 text-sky-400" /> {companies.length} doanh nghiệp thành viên
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-slate-200 px-4 py-2 shadow-sm">
                <TrendingUp className="h-4 w-4 text-emerald-400" /> Hơn 120 dự án triển khai
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-400"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-rose-400 text-lg mb-4">
                Không thể tải dữ liệu companies: {error}
              </div>
              <Button 
                onClick={() => window.location.reload()} 
                className="btn-primary"
              >
                Thử lại
              </Button>
            </div>
          ) : companies.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-white/60 text-lg">
                Không có dữ liệu companies từ API
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 xl:grid-cols-3 gap-10">
              {companies.map((company, index) => {
                const IconComponent = company.icon
                const palettes = [
                  {
                    gradient: 'from-sky-500 via-indigo-500 to-purple-500',
                    accentText: 'text-indigo-600',
                    chipBg: 'bg-indigo-50',
                    chipText: 'text-indigo-700',
                    iconBg: 'bg-indigo-500/10',
                    iconText: 'text-indigo-600',
                    buttonGradient: 'from-indigo-500 via-sky-500 to-blue-600'
                  },
                  {
                    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
                    accentText: 'text-emerald-600',
                    chipBg: 'bg-emerald-50',
                    chipText: 'text-emerald-700',
                    iconBg: 'bg-emerald-500/10',
                    iconText: 'text-emerald-600',
                    buttonGradient: 'from-emerald-500 via-teal-500 to-cyan-500'
                  },
                  {
                    gradient: 'from-fuchsia-500 via-purple-500 to-violet-500',
                    accentText: 'text-purple-600',
                    chipBg: 'bg-purple-50',
                    chipText: 'text-purple-700',
                    iconBg: 'bg-purple-500/10',
                    iconText: 'text-purple-600',
                    buttonGradient: 'from-purple-500 via-fuchsia-500 to-rose-500'
                  },
                  {
                    gradient: 'from-amber-500 via-orange-500 to-rose-500',
                    accentText: 'text-orange-600',
                    chipBg: 'bg-orange-50',
                    chipText: 'text-orange-700',
                    iconBg: 'bg-orange-500/10',
                    iconText: 'text-orange-600',
                    buttonGradient: 'from-orange-500 via-amber-500 to-rose-500'
                  },
                  {
                    gradient: 'from-cyan-500 via-sky-500 to-blue-500',
                    accentText: 'text-sky-600',
                    chipBg: 'bg-sky-50',
                    chipText: 'text-sky-700',
                    iconBg: 'bg-sky-500/10',
                    iconText: 'text-sky-600',
                    buttonGradient: 'from-sky-500 via-cyan-500 to-indigo-500'
                  }
                ]
                const palette = palettes[index % palettes.length]
                const stats = [
                  { icon: Calendar, label: "Thành lập", value: company.founded },
                  { icon: Users, label: "Nhân sự", value: company.employees },
                  { icon: TrendingUp, label: "Dự án", value: company.projects },
                  { icon: Globe, label: "Lĩnh vực", value: company.industry }
                ]

                return (
                  <div key={company.name} className="group">
                    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_28px_60px_-32px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-2 hover:border-transparent hover:shadow-[0_36px_80px_-32px_rgba(15,23,42,0.35)]">
                      <div className={`relative overflow-hidden bg-gradient-to-r ${palette.gradient} p-6 text-white`}>
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-14 w-14 items-center justify-center rounded-2xl backdrop-blur ring-4 ring-white/25 ${
                              company.logo_url ? 'bg-white' : 'bg-white/15'
                            }`}
                          >
                            {company.logo_url ? (
                              <Image
                                src={company.logo_url}
                                alt={`${company.name} logo`}
                                width={56}
                                height={56}
                                className="h-full w-full rounded-2xl object-contain p-2"
                              />
                            ) : (
                              <IconComponent className="h-6 w-6 text-white" />
                            )}
                          </div>

                          <div className="flex-1 space-y-3">
                            <Badge className="inline-flex items-center rounded-full border border-white/40 bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/85">
                              {company.industry || "Công Nghệ"}
                            </Badge>
                            <h3 className="text-xl font-semibold leading-tight text-white">
                              {company.name}
                            </h3>
                            <p className="text-sm leading-relaxed text-white/85">
                              {company.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col gap-6 p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {stats.map((stat) => (
                            <div
                              key={stat.label}
                              className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white/80 px-2.5 py-2 text-left transition-all duration-200 hover:border-gray-200 hover:bg-white/90"
                            >
                              <div className={`flex h-8 w-8 items-center justify-center rounded-md ${palette.iconBg}`}>
                                <stat.icon className={`h-4 w-4 ${palette.iconText}`} />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-gray-500">
                                  {stat.label}
                                </p>
                                <p className="text-xs font-semibold text-gray-900 leading-tight">
                                  {stat.value}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {company.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {company.specialties.slice(0, 4).map((specialty, idx) => (
                              <span
                                key={idx}
                                className={`inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-medium ${palette.chipBg} ${palette.chipText}`}
                              >
                                {specialty}
                              </span>
                            ))}
                            {company.specialties.length > 4 && (
                              <span className={`inline-flex items-center rounded-full border border-dashed border-gray-300 px-3 py-1 text-xs font-medium ${palette.chipText}`}>
                                +{company.specialties.length - 4}
                              </span>
                            )}
                          </div>
                        )}

                        {(company.address || company.website) && (
                          <div className="space-y-3 text-sm text-gray-600">
                            {company.address && (
                              <div className="flex items-start gap-2">
                                <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                                <span className="leading-snug">{company.address}</span>
                              </div>
                            )}
                            {company.website && (
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-gray-400" />
                                <span className="truncate text-gray-600">
                                  {company.website.replace(/^https?:\/\//, '')}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="mt-auto pt-2">
                          <Link href={company.href} className="block">
                            <Button className={`w-full justify-center gap-2 rounded-2xl bg-gradient-to-r ${palette.buttonGradient} px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl`}>
                              <span>Tìm Hiểu Chi Tiết</span>
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-standard bg-gradient-to-br from-gray-50/50 to-red-50/30">
        <div className="container-standard">
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
              
              <div className="relative card-feature p-12 bg-white rounded-2xl text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Users className="h-10 w-10 text-red-600" />
                </div>
                
                <h2 className="heading-h2 text-red-600 mb-6">
                  Quan Tâm Đến Việc Hợp Tác?
                </h2>
                
                <p className="text-body-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                  Chúng tôi luôn tìm kiếm những đối tác và nhân tài để cùng phát triển hệ sinh thái công nghệ ApecGlobal.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link href="/contact">
                    <Button className="btn-primary text-lg px-8 py-4">
                      Liên Hệ Hợp Tác
                      <Mail className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  
                  <Link href="/careers">
                    <Button variant="outline" className="btn-outline text-lg px-8 py-4">
                      Cơ Hội Nghề Nghiệp
                      <TrendingUp className="ml-2 w-5 h-5" />
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
