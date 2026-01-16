"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import { useApiCache } from "@/hooks/use-api-cache"

interface Company {
  id: number
  name: string
  logo_url?: string
  slug: string
  is_parent_company?: boolean
}

interface SplashPageProps {
  onEnterSite: () => void
}

export default function SplashPage({ onEnterSite }: SplashPageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [logoLoaded, setLogoLoaded] = useState(false)

  // Sử dụng API cache để lấy companies
  const { data: apiResponse, loading, error } = useApiCache<any>(
    'companies',
    async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '/api'
      const response = await fetch(`${baseUrl}/companies`)
      if (!response.ok) {
        throw new Error('Failed to fetch companies')
      }
      return response.json()
    },
    2 * 60 * 1000 // Cache 2 phút
  )

  // Extract companies array from API response
  const apiCompanies = apiResponse?.success ? apiResponse.data : []

  // Sử dụng fallback data nếu API không có data
  const allCompanies = Array.isArray(apiCompanies) ? apiCompanies : []
  
  // Lấy company đầu tiên làm parent company, còn lại là client companies
  const parentCompany = allCompanies.length > 0 ? allCompanies[0] : null
  const clientCompanies = allCompanies.slice(1) // Tất cả company từ thứ 2 trở đi là client companies

  const checkAllAssetsLoaded = useCallback(() => {
    // Đơn giản hóa điều kiện - chỉ cần logo chính load xong và API không loading
    if (logoLoaded && !loading) {
      // Delay the main animation until all assets are loaded
      setTimeout(() => setIsLoaded(true), 100)
    }
  }, [logoLoaded, loading])



  useEffect(() => {
    // Preload main logo for faster display
    const img = new window.Image()
    // Sử dụng logo của parent company nếu có, nếu không thì dùng logo mặc định
    const logoSrc = parentCompany?.logo_url || '/main-logo.png'
    img.src = logoSrc
    img.onload = () => {
      setLogoLoaded(true)
      checkAllAssetsLoaded()
    }
    img.onerror = () => {
      // Even if logo fails to load, show the page
      setLogoLoaded(true)
      checkAllAssetsLoaded()
    }
    
    // Safety timeout - force load after 5 seconds maximum
    const safetyTimeout = setTimeout(() => {
      console.log('Safety timeout triggered - forcing page load')
      setIsLoaded(true)
    }, 5000)
    
    return () => clearTimeout(safetyTimeout)
  }, [parentCompany, checkAllAssetsLoaded])

  // Check if all assets are loaded whenever dependencies change
  useEffect(() => {
    checkAllAssetsLoaded()
  }, [checkAllAssetsLoaded])

  // Show loading screen until everything is ready - but allow early access
  if (!isLoaded) {
    return (
      <div className="relative min-h-screen bg-white overflow-hidden">
        {/* Loading Screen */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-gray-50 rounded-2xl px-8 py-6 border border-gray-200 shadow-lg">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              <div className="text-gray-800 text-lg font-medium">Đang tải trang...</div>
              <div className="text-gray-600 text-sm mb-4">
                {loading ? 'Đang tải dữ liệu công ty...' : 
                 !logoLoaded ? 'Đang tải logo chính...' : 
                 'Chuẩn bị hiển thị...'}
              </div>
              
              {/* Emergency navigation button during loading */}
              {/* <div className="flex gap-2">
                <button
                  onClick={() => {
                    console.log('🚨 Emergency navigation during loading')
                    window.location.href = '/home'
                  }}
                  className="bg-orange-500 text-white px-3 py-1 rounded text-xs"
                >
                  Skip Loading → Home
                </button>
                <button
                  onClick={() => {
                    console.log('🚨 Force show splash')
                    setIsLoaded(true)
                  }}
                  className="bg-green-500 text-white px-3 py-1 rounded text-xs"
                >
                  Force Show
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div
          className={`text-center transition-all duration-3000 ease-out animate-fade-in-up ${isLoaded ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-16 scale-95"}`}
        >
          {/* Logo Section */}
          <div className="mb-12">
            <div className="mb-8 flex justify-center">
              <div className="relative group">
                
                {/* Logo container - minimal styling - Larger on mobile for focus */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 transition-all duration-500 hover:scale-105">
                  
                  {!logoLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    </div>
                  )}
                  <Image
                    src={parentCompany?.logo_url || '/main-logo.png'}
                    alt={parentCompany?.name ? `${parentCompany.name} Logo` : "APEC Global Logo"}
                    fill
                    className={`object-contain transition-opacity duration-500 relative z-10 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
                    style={{ 
                    }}
                    sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 192px, 224px"
                    priority
                    onLoad={() => setLogoLoaded(true)}
                    onError={() => setLogoLoaded(true)}
                  />
                </div>
              </div>
            </div>
            
            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-300 to-purple-600 bg-clip-text text-transparent animate-glow animate-gradient">
                  TẬP ĐOÀN KINH TẾ
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent animate-gradient">
                  {parentCompany?.name?.toUpperCase() || 'APEC GLOBAL'}
                </span>
              </h1>
              
              {/* Decorative elements */}
              <div className="flex justify-center items-center space-x-4 mt-6">
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-purple-500 rounded-full"></div>
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Enhanced Tagline */}
          <div className="mb-12">
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-4 font-light leading-relaxed">
              Thống nhất hệ sinh thái công nghệ tương lai
            </p>
            <p className="text-sm md:text-base text-gray-700 font-light italic">
              Kết nối • Đổi mới • Phát triển bền vững
            </p>
          </div>

          {/* Client Companies Section */}
          {clientCompanies && clientCompanies.length > 0 && (
            <div className="mb-16">
              <div className="text-center mb-8">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                  Các Công Ty Thành Viên
                </h3>
                <div className="w-20 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
              </div>
              
              {/* Company Logos Grid */}
              <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 max-w-4xl mx-auto">
                {clientCompanies.map((company, index) => (
                  <div
                    key={company.id}
                    className="group relative transition-all duration-300 hover:scale-110"
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 p-2">
                      {company.logo_url ? (
                        <Image
                          src={company.logo_url}
                          alt={`${company.name} logo`}
                          fill
                          className="object-contain p-1"
                          sizes="(max-width: 768px) 64px, (max-width: 1024px) 80px, 96px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                          <div className="text-purple-600 text-xs md:text-sm font-bold text-center">
                            {company.name.split(' ').map((word: string) => word[0]).join('').toUpperCase()}
                          </div>
                        </div>
                      )}
                      
                      {/* Hover tooltip */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-20">
                        {company.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Decorative line */}
              <div className="flex justify-center items-center mt-8">
                <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-purple-300 to-transparent rounded-full"></div>
              </div>
            </div>
          )}

          {/* TEST BUTTON - Simple debug button */}
          {/* <div className="mb-4">
            <button
              onClick={() => {
                console.log('🧪 TEST BUTTON clicked')
                window.location.href = '/home'
              }}
              className="bg-red-500 text-white px-4 py-2 rounded text-sm mr-4"
            >
              TEST - Direct Navigate
            </button>
            <button
              onClick={() => {
                console.log('🧪 TEST onEnterSite called')
                if (onEnterSite) onEnterSite()
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
            >
              TEST - Call onEnterSite
            </button>
          </div> */}

          {/* Enhanced Enter Button */}
          <div className="relative group animate-bounce-in">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-300 animate-pulse-glow"></div>
            <Button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('🎯 Button "Vào Trang Chính" clicked in SplashPage')
                console.log('📋 onEnterSite function:', onEnterSite)
                console.log('🌐 Current location:', window.location.href)
                
                // Test multiple navigation methods
                if (onEnterSite) {
                  console.log('🚀 Calling onEnterSite...')
                  onEnterSite()
                  
                  // Fallback after delay
                  setTimeout(() => {
                    console.log('⏰ Fallback navigation after 2s...')
                    if (window.location.pathname === '/') {
                      console.log('🔄 Still on splash, forcing navigation...')
                      window.location.href = '/home'
                    }
                  }, 2000)
                } else {
                  console.error('❌ onEnterSite function is undefined! Using direct navigation.')
                  window.location.href = '/home'
                }
              }}
              className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 text-white px-10 py-5 text-lg md:text-xl font-semibold rounded-full transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/40 border border-white/20 backdrop-blur-sm hover-lift"
            >
              <span className="flex items-center">
                Vào Trang Chính
                <ChevronRight className="ml-3 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              backgroundColor: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
        
        {/* Shooting stars */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70 animate-shooting-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              animationDuration: `${8 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes shootingStar {
          0% { 
            transform: translateX(-100px) translateY(0px); 
            opacity: 0; 
          }
          10% { 
            opacity: 1; 
          }
          90% { 
            opacity: 1; 
          }
          100% { 
            transform: translateX(100vw) translateY(-100px); 
            opacity: 0; 
          }
        }
        
        .animate-shooting-star {
          animation: shootingStar linear infinite;
        }
      `}</style>
    </div>
  )
}
