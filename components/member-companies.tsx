"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, ExternalLink, Brain, Shield, Heart, Clock, Cpu } from "lucide-react"
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

export default function MemberCompanies() {
  // Fallback companies data nếu API fails
  

  // Sử dụng API cache để lấy companies
  const { data: apiResponse, loading, error } = useApiCache<any>(
    'companies-member',
    async () => {
      const response = await fetch('/api/companies')
      if (!response.ok) {
        throw new Error('Failed to fetch companies')
      }
      return response.json()
    },
    5 * 60 * 1000 // Cache 5 phút
  )

  // Extract companies array from API response
  const apiCompanies = apiResponse?.success ? apiResponse.data : null
  const companies = Array.isArray(apiCompanies) ? apiCompanies : []

  if (loading) {
    return (
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="section-title font-bold mb-3 sm:mb-4 text-red-700">
              Công Ty Thành Viên
            </h2>
            <p className="text-black/70 text-base sm:text-lg max-w-2xl mx-auto">
              Khám phá hệ sinh thái công nghệ đa dạng của ApecGlobal
            </p>
          </div>
          
          {/* Loading skeleton */}
          <div className="responsive-grid-3 mb-6 sm:mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white border-gray-200 shadow-lg animate-pulse">
                <CardHeader className="text-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-gray-700 mb-3 sm:mb-4" />
                  <div className="h-6 bg-gray-700 rounded mx-auto w-3/4 mb-2" />
                  <div className="h-4 bg-gray-700 rounded mx-auto w-1/2" />
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="w-full h-10 bg-gray-700 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Không hiển thị error nếu có fallback data
  if (error && (!companies || companies.length === 0)) {
    return (
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="section-title font-bold mb-3 sm:mb-4 text-red-700">
              Công Ty Thành Viên
            </h2>
            <p className="text-red-600 mb-4">Không thể tải dữ liệu: {error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              Thử lại
            </Button>
          </div>
        </div>
      </section>
    )
  }

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

  return (
    <section className="py-12 sm:py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="section-title font-bold mb-3 sm:mb-4 text-red-700">
            Công Ty Thành Viên
          </h2>
          <p className="text-black/70 text-base sm:text-lg max-w-2xl mx-auto">
            Khám phá hệ sinh thái công nghệ đa dạng của ApecGlobal
          </p>
        </div>

        <div className="responsive-grid-3 mb-6 sm:mb-8">
          {memberCompanies.slice(0, 3).map((company) => {
            const IconComponent = company.icon
            return (
              <Link key={company.name} href={company.href}>
                <Card className="bg-white border-gray-200 hover:border-red-300 transition-all duration-300 hover:scale-105 cursor-pointer h-full shadow-lg hover:shadow-xl">
                  <CardHeader className="text-center p-4 sm:p-6">
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full flex items-center justify-center mb-3 sm:mb-4 overflow-hidden ${
                        company.logo_url 
                          ? 'bg-gradient-to-br from-gray-50 to-white shadow-lg border-2 border-purple-200/50' 
                          : `bg-gradient-to-r ${company.color}`
                      }`}
                    >
                      {company.logo_url ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={company.logo_url}
                            alt={`${company.name} logo`}
                            fill
                            className="object-contain p-2"
                            sizes="(max-width: 640px) 48px, 64px"
                          />
                        </div>
                      ) : (
                        <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      )}
                    </div>
                    <CardTitle className="text-red-700 text-base sm:text-lg">{company.name}</CardTitle>
                    <p className="text-black/70 text-sm">{company.description}</p>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <Button
                      variant="outline"
                      className="w-full bg-white border-2 border-red-300 text-red-700 hover:bg-red-50 hover:border-red-500 hover:text-red-800 text-sm"
                    >
                      Tìm Hiểu Thêm
                      <ExternalLink className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="text-center">
          <Link href="/companies">
            <Button className="w-full sm:w-auto bg-red-700 hover:bg-red-800 text-white border-0 px-6 sm:px-8 py-3 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl">
              Xem Tất Cả Công Ty
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}