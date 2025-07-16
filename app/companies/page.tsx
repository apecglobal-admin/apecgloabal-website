"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import PageHeroCarousel from "@/components/page-hero-carousel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Brain, Shield, Heart, Clock, Cpu, ExternalLink, Users, Calendar, TrendingUp, Mail, Phone, MapPin, Globe } from "lucide-react"
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
    <div className="min-h-screen bg-white text-black">
      <Header />

      {/* Hero Carousel Section */}
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 overflow-hidden">
        <div className="hero-carousel-container relative z-10">
          <PageHeroCarousel slides={heroSlides} />
        </div>
      </section>

      {/* Companies Grid */}
      <section id="companies-grid" className="section-standard">
        <div className="container-standard">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Users className="w-4 h-4 mr-2" />
              Công Ty Thành Viên
            </div>
            <h2 className="heading-h2 mb-4">
              Hệ Sinh Thái <span className="text-red-600">Công Nghệ</span>
            </h2>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá các công ty thành viên trong hệ sinh thái ApecGlobal, mỗi công ty chuyên sâu 
              về một lĩnh vực công nghệ cụ thể
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-500 text-lg mb-4">
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
              <div className="text-gray-600 text-lg">
                Không có dữ liệu companies từ API
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {companies.map((company, index) => {
                const IconComponent = company.icon
                const colors = [
                  { bg: 'bg-red-100', text: 'text-red-600', gradient: 'from-red-100 to-red-200' },
                  { bg: 'bg-blue-100', text: 'text-blue-600', gradient: 'from-blue-100 to-blue-200' },
                  { bg: 'bg-green-100', text: 'text-green-600', gradient: 'from-green-100 to-green-200' },
                  { bg: 'bg-purple-100', text: 'text-purple-600', gradient: 'from-purple-100 to-purple-200' },
                  { bg: 'bg-orange-100', text: 'text-orange-600', gradient: 'from-orange-100 to-orange-200' }
                ]
                const color = colors[index % colors.length]
                
                return (
                  <div key={company.name} className="group relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${color.gradient} rounded-2xl transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} group-hover:${index % 2 === 0 ? 'rotate-2' : '-rotate-2'} transition-transform opacity-20`}></div>
                    
                    <div className="relative card-feature p-6 bg-white rounded-2xl h-full flex flex-col">
                      {/* Company Header */}
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden ${
                          company.logo_url 
                            ? 'bg-white border-2 border-gray-200 shadow-sm' 
                            : color.bg
                        }`}>
                          {company.logo_url ? (
                            <Image
                              src={company.logo_url}
                              alt={`${company.name} logo`}
                              width={48}
                              height={48}
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <IconComponent className={`w-6 h-6 ${color.text}`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-red-600">{company.name}</h3>
                          <p className="text-sm text-gray-600 truncate">{company.description}</p>
                        </div>
                      </div>

                      {/* Company Info */}
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">{company.founded}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">{company.employees}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">{company.projects}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600 text-xs">{company.industry}</span>
                          </div>
                        </div>

                        {/* Specialties */}
                        <div className="flex flex-wrap gap-1">
                          {company.specialties.slice(0, 3).map((specialty, idx) => (
                            <div key={idx} className="inline-flex items-center px-2 py-1 bg-white shadow-md text-gray-700 rounded-full text-xs">
                              {specialty}
                            </div>
                          ))}
                          {company.specialties.length > 3 && (
                            <div className="inline-flex items-center px-2 py-1 bg-white shadow-md text-gray-700 rounded-full text-xs">
                              +{company.specialties.length - 3}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <Link href={company.href} className="block">
                          <Button className="w-full btn-primary text-sm py-2">
                            Tìm Hiểu Chi Tiết
                            <ExternalLink className="ml-2 w-4 h-4" />
                          </Button>
                        </Link>
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
