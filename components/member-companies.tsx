"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Brain, Shield, Heart, Clock, Cpu, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useApiCache } from "@/hooks/use-api-cache"

interface Company {
  id: number
  name: string
  slug: string
  description?: string
  short_description?: string
  logo_url?: string
  website?: string
  address?: string
  phone?: string
  email?: string
  employee_count?: number
  established_year?: number
  industry?: string
  is_featured?: boolean
  created_at?: string
  updated_at?: string
}

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

// Hàm để lấy mô tả ngắn dựa trên tên công ty (tóm gọn cho mobile)
const getCompanyShortDescription = (name: string) => {
  switch (name) {
    case "ApecTech":
      return "AI & Học tập"
    case "GuardCam":
      return "Bảo mật"
    case "EmoCommerce":
      return "E-commerce"
    case "TimeLoop":
      return "Phân tích"
    case "ApecNeuroOS":
      return "Hệ điều hành"
    default:
      return "Công nghệ"
  }
}

export default function MemberCompanies() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(6)
  const [gapPx, setGapPx] = useState(8) // khoảng cách giữa các item (px)

  // Viewport ref để đo width, đảm bảo slide đúng 1 item và hiển thị đúng itemsPerView
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const [itemWidth, setItemWidth] = useState(0)
  
  // Sử dụng API cache để lấy companies
  const { data: apiResponse, loading, error } = useApiCache<any>(
    'companies-member',
    async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '/api'
      const response = await fetch(`${baseUrl}/companies`)
      if (!response.ok) {
        throw new Error('Failed to fetch companies')
      }
      return response.json()
    },
    5 * 60 * 1000 // Cache 5 phút
  )

  // Extract companies array from API response
  const apiCompanies = apiResponse?.success ? apiResponse.data : null
  const companies = Array.isArray(apiCompanies)
    ? apiCompanies.filter((company: Company) => company.slug !== 'apecglobal')
    : []

  // Chuyển đổi dữ liệu API sang format hiển thị
  const memberCompanies = companies.map((company: Company) => {
    return {
      name: company.name,
      logo_url: company.logo_url,
      icon: getCompanyIcon(company.name), // Fallback icon nếu không có logo
      description: company.short_description || getCompanyShortDescription(company.name),
      color: getCompanyColor(company.name),
      href: `/companies/${company.slug}`,
    }
  })

  // Cập nhật itemsPerView và gap theo kích thước màn hình
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth
      if (width >= 1280) {
        setItemsPerView(6)
      } else if (width >= 1024) {
        setItemsPerView(5)
      } else if (width >= 992) {
        setItemsPerView(4)
      } else if (width >= 350) {
        setItemsPerView(3)
      } else {
        setItemsPerView(2)
      }
      // gap: mobile 8px (gap-2), >= sm (640px) 12px (gap-3)
      setGapPx(width >= 640 ? 12 : 8)
    }

    updateLayout()
    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [])

  // Đo itemWidth = (viewportWidth - tổng gap) / itemsPerView
  useEffect(() => {
    const measure = () => {
      if (!viewportRef.current) return
      const vw = viewportRef.current.clientWidth
      const totalGaps = Math.max(0, itemsPerView - 1) * gapPx
      setItemWidth((vw - totalGaps) / Math.max(1, itemsPerView))
    }

    const ro = new ResizeObserver(measure)
    if (viewportRef.current) ro.observe(viewportRef.current)
    measure()
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [itemsPerView, gapPx])

  // Đảm bảo currentSlide hợp lệ khi dữ liệu/viewport thay đổi
  useEffect(() => {
    const maxSlide = Math.max(0, memberCompanies.length - itemsPerView)
    if (currentSlide > maxSlide) setCurrentSlide(0)
  }, [itemsPerView, memberCompanies.length])

  const nextSlide = () => {
    if (memberCompanies.length > itemsPerView) {
      setCurrentSlide((prev) => {
        const maxSlide = memberCompanies.length - itemsPerView
        return prev >= maxSlide ? 0 : prev + 1 // trượt đúng 1 item
      })
    }
  }

  const prevSlide = () => {
    if (memberCompanies.length > itemsPerView) {
      setCurrentSlide((prev) => {
        const maxSlide = memberCompanies.length - itemsPerView
        return prev <= 0 ? maxSlide : prev - 1 // trượt đúng 1 item
      })
    }
  }

  // Auto slide effect - DISABLED
  useEffect(() => {
    return () => {}
  }, [memberCompanies.length])

  if (loading) {
    return (
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="section-title font-bold mb-3 sm:mb-4 text-gray-800">Công Ty Thành Viên</h2>
            <p className="text-black/70 text-base sm:text-lg max-w-2xl mx-auto">Khám phá hệ sinh thái công nghệ đa dạng của ApecGlobal</p>
          </div>

          <div className="relative mb-6">
            <div className="overflow-hidden" ref={viewportRef}>
              <div className="flex gap-2 sm:gap-3">
                {Array.from({ length: itemsPerView }).map((_, i) => (
                  <div key={i} className="flex-shrink-0" style={{ width: itemWidth ? `${itemWidth}px` : `calc(100% / ${itemsPerView})` }}>
                    <div className="bg-white animate-pulse rounded-xl px-0 py-6 sm:px-4 md:px-6 flex flex-col items-center shadow-sm">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-lg bg-gray-200 mb-2 sm:mb-3 md:mb-4" />
                      <div className="h-4 bg-gray-200 rounded mx-auto w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error && (!companies || companies.length === 0)) {
    return (
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="section-title font-bold mb-3 sm:mb-4 text-gray-800">Công Ty Thành Viên</h2>
            <p className="text-gray-600 mb-4">Không thể tải dữ liệu: {error}</p>
            <Button onClick={() => window.location.reload()} className="bg-gray-800 hover:bg-gray-900 text-white">Thử lại</Button>
          </div>
        </div>
      </section>
    )
  }

  const maxSlide = Math.max(0, memberCompanies.length - itemsPerView)

  return (
    <section className="py-12 sm:py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="section-title font-bold mb-3 sm:mb-4 text-gray-800">Công Ty Thành Viên</h2>
          <p className="text-black/70 text-base sm:text-lg max-w-2xl mx-auto">Khám phá hệ sinh thái công nghệ đa dạng của ApecGlobal</p>
        </div>

        {/* Carousel */}
        <div className="relative mb-6">
          {/* Viewport */}
          <div className="overflow-hidden" ref={viewportRef}>
            {/* Track: width fit-content; có gap giữa items */}
            <div
              className="flex gap-2 sm:gap-3 transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * (itemWidth + gapPx)}px)`,
                width: 'max-content'
              }}
            >
              {memberCompanies.map((company) => {
                const IconComponent = company.icon
                return (
                  <div key={company.name} className="flex-shrink-0" style={{ width: itemWidth ? `${itemWidth}px` : `calc(100% / ${itemsPerView})` }}>
                    <Link href={company.href}>
                      <div className="h-full bg-white hover:bg-gray-50/50 transition-all duration-300 cursor-pointer rounded-xl px-0 py-4 sm:py-5 md:py-6 sm:px-4 md:px-6 flex flex-col items-center shadow-sm hover:shadow-md">
                        <div className="text-center w-full">
                          <div className="mx-auto rounded-lg flex items-center justify-center mb-2 sm:mb-3 md:mb-4 bg-white border border-gray-200">
                            {company.logo_url ? (
                              <div className="relative w-16 h-16 sm:w-[100px] sm:h-[100px]">
                                <Image src={company.logo_url} alt={`${company.name} logo`} width={0} height={0} className="object-contain p-2 w-full h-full" sizes="100vw" />
                              </div>
                            ) : (
                              <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 text-gray-700" />
                            )}
                          </div>
                          <h3 className="text-gray-800 text-sm sm:text-base lg:text-lg font-semibold truncate">{company.name}</h3>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Controls */}
          {memberCompanies.length > itemsPerView && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg transition-all z-10"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg transition-all z-10"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </>
          )}

          {/* Dots */}
          {memberCompanies.length > itemsPerView && (
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: maxSlide + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-gray-800' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="text-center">
          <Link href="/companies">
            <Button className="w-full sm:w-auto bg-gray-800 hover:bg-gray-900 text-white border-0 px-6 sm:px-8 py-3 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl">
              Xem Tất Cả Công Ty
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}