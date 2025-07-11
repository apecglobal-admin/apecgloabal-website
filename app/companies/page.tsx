"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import PageHeroCarousel from "@/components/page-hero-carousel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Brain, Shield, Heart, Clock, Cpu, ExternalLink, Users, Calendar, TrendingUp, Mail, Phone, MapPin } from "lucide-react"
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
      return ["Technology", "Innovation", "Digital Transformation", "Software Development"]
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
      const response = await fetch('/api/companies')
      if (!response.ok) {
        throw new Error('Failed to fetch companies')
      }
      return response.json()
    },
    5 * 60 * 1000 // Cache 5 phút
  )

  // Extract companies array từ API response
  const apiCompanies = apiResponse?.success ? apiResponse.data : []
  
  // Chuyển đổi dữ liệu từ API sang định dạng hiển thị  
  const companies = apiCompanies.map((company: any) => {
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
      founded: company.created_at ? new Date(company.created_at).getFullYear().toString() : new Date().getFullYear().toString(),
      employees: `${company.employee_count || 0}+`,
      projects: "10+", // Giá trị mặc định vì chưa có dữ liệu thực tế
      specialties: getCompanySpecialties(company.name),
      industry: company.industry || "Technology",
      website: company.website,
      address: company.address,
      phone: company.phone,
      email: company.email,
      is_featured: company.is_featured || false
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <Header />

      {/* Hero Carousel Section */}
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20"></div>
        <div className="container mx-auto relative z-10">
          <PageHeroCarousel slides={heroSlides} />
        </div>
      </section>

      {/* Companies Grid */}
      <section id="companies-grid" className="py-16 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-400 text-lg mb-4">
                Không thể tải dữ liệu companies: {error}
              </div>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
              >
                Thử lại
              </Button>
            </div>
          ) : companies.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-white/80 text-lg">
                Không có dữ liệu companies từ API
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {companies.map((company, index) => {
              const IconComponent = company.icon
              return (
                <Card
                  key={company.name}
                  className="bg-black/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300"
                >
                  <div className="grid md:grid-cols-3 gap-8 p-8">
                    {/* Company Info */}
                    <div className="md:col-span-2 space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden ${
                          company.logo_url 
                            ? 'bg-gradient-to-br from-gray-50 to-white shadow-lg border-2 border-purple-200/50' 
                            : 'bg-white/10'
                        }`}>
                          {company.logo_url ? (
                            <Image
                              src={company.logo_url}
                              alt={`${company.name} logo`}
                              width={64}
                              height={64}
                              className="w-full h-full object-contain p-2"
                            />
                          ) : (
                            <div className={`w-full h-full rounded-full bg-gradient-to-r ${company.color} flex items-center justify-center`}>
                              <IconComponent className="h-8 w-8 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{company.name}</h3>
                          <p className="text-purple-300">{company.description}</p>
                        </div>
                      </div>

                      <p className="text-white/80 text-lg leading-relaxed">{company.fullDescription}</p>

                      <div className="flex flex-wrap gap-2">
                        {company.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="outline" className="border-purple-500/30 text-purple-300">
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      <Link href={company.href} className="inline-block mt-4">
                        <Button className={`bg-gradient-to-r ${company.color} hover:opacity-90 transition-opacity`}>
                          Tìm Hiểu Chi Tiết
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>

                    {/* Company Stats */}
                    <div className="space-y-4">
                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="h-4 w-4 text-purple-400" />
                          <span className="text-white/60 text-sm">Thành lập</span>
                        </div>
                        <span className="text-white font-semibold">{company.founded}</span>
                      </div>

                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="h-4 w-4 text-blue-400" />
                          <span className="text-white/60 text-sm">Nhân viên</span>
                        </div>
                        <span className="text-white font-semibold">{company.employees}</span>
                      </div>

                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-green-400" />
                          <span className="text-white/60 text-sm">Dự án</span>
                        </div>
                        <span className="text-white font-semibold">{company.projects}</span>
                      </div>

                      {/* Industry */}
                      <div className="bg-black/30 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-purple-400" />
                          <span className="text-white/60 text-sm">Ngành</span>
                        </div>
                        <span className="text-white font-semibold text-xs">{company.industry}</span>
                      </div>

                      {/* Contact Info */}
                      {company.website && (
                        <div className="bg-black/30 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <ExternalLink className="h-4 w-4 text-blue-400" />
                            <span className="text-white/60 text-sm">Website</span>
                          </div>
                          <a 
                            href={company.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm break-all"
                          >
                            {company.website}
                          </a>
                        </div>
                      )}

                      {company.email && (
                        <div className="bg-black/30 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Mail className="h-4 w-4 text-green-400" />
                            <span className="text-white/60 text-sm">Email</span>
                          </div>
                          <a 
                            href={`mailto:${company.email}`}
                            className="text-green-400 hover:text-green-300 text-sm break-all"
                          >
                            {company.email}
                          </a>
                        </div>
                      )}

                      {company.phone && (
                        <div className="bg-black/30 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Phone className="h-4 w-4 text-yellow-400" />
                            <span className="text-white/60 text-sm">Điện thoại</span>
                          </div>
                          <a 
                            href={`tel:${company.phone}`}
                            className="text-yellow-400 hover:text-yellow-300 text-sm"
                          >
                            {company.phone}
                          </a>
                        </div>
                      )}

                      {company.address && (
                        <div className="bg-black/30 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <MapPin className="h-4 w-4 text-red-400" />
                            <span className="text-white/60 text-sm">Địa chỉ</span>
                          </div>
                          <span className="text-white font-semibold text-xs">{company.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Card className="bg-black/50 border-purple-500/30 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Quan Tâm Đến Việc Hợp Tác?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/80">
                Chúng tôi luôn tìm kiếm những đối tác và nhân tài để cùng phát triển hệ sinh thái công nghệ ApecGlobal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Liên Hệ Hợp Tác
                  </Button>
                </Link>
                <Link href="/careers">
                  <Button variant="outline" className="border-purple-500/30 text-white hover:bg-purple-500/20">
                    Cơ Hội Nghề Nghiệp
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
