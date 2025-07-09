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
}

interface SplashPageProps {
  onEnterSite: () => void
}

export default function SplashPage({ onEnterSite }: SplashPageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [companyLogosLoaded, setCompanyLogosLoaded] = useState(false)
  const [logoPositions, setLogoPositions] = useState<Array<{
    left: number;
    top: number;
  }>>([])
  const [isTeleporting, setIsTeleporting] = useState(false)
  
  // Fallback companies data nếu API fails
  
  // Sử dụng API cache để lấy companies
  const { data: apiResponse, loading, error } = useApiCache<any>(
    'companies',
    async () => {
      const response = await fetch('/api/companies')
      if (!response.ok) {
        throw new Error('Failed to fetch companies')
      }
      const data = await response.json()
      return data
    },
    5 * 60 * 1000 // Cache 5 phút
  )

  // Extract companies array from API response
  const apiCompanies = apiResponse?.success ? apiResponse.data : null

  // Sử dụng fallback data nếu API không có data
  const companies = Array.isArray(apiCompanies) ? apiCompanies : []

  const checkAllAssetsLoaded = useCallback(() => {
    if (logoLoaded && companyLogosLoaded && !loading) {
      // Delay the main animation until all assets are loaded
      setTimeout(() => setIsLoaded(true), 100)
    }
  }, [logoLoaded, companyLogosLoaded, loading])

  // Generate random positions when component mounts
  useEffect(() => {
    const generatePositions = () => {
      return Array.from({ length: 5 }, () => ({
        left: Math.random() * 85 + 5,         // 5% to 90%
        top: Math.random() * 75 + 10,         // 10% to 85%
      }))
    }
    
    // Set initial positions
    setLogoPositions(generatePositions())
    
    // Continuous position changes - logos will teleport to random positions
    const interval = setInterval(() => {
      // Fade out
      setIsTeleporting(true)
      
      // Change positions and fade in
      setTimeout(() => {
        setLogoPositions(generatePositions())
        setIsTeleporting(false)
      }, 200) // 200ms fade out duration
    }, 1500 + Math.random() * 1000) // Random between 1.5-2.5 seconds (faster)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Preload main logo for faster display
    const img = new window.Image()
    img.src = '/main-logo.png'
    img.onload = () => {
      setLogoLoaded(true)
      checkAllAssetsLoaded()
    }
    img.onerror = () => {
      // Even if logo fails to load, show the page
      setLogoLoaded(true)
      checkAllAssetsLoaded()
    }
    
    // Không cần fetchCompanies nữa vì dùng useApiCache
  }, [])

  const preloadCompanyLogos = useCallback(async (companyList: Company[]) => {
    if (!companyList || companyList.length === 0) {
      setCompanyLogosLoaded(true)
      return
    }

    const logoPromises = companyList
      .filter(company => company.logo_url) // Chỉ preload những logo có URL
      .map(company => {
        return new Promise<void>((resolve) => {
          const img = new window.Image()
          img.src = company.logo_url!
          img.onload = () => resolve()
          img.onerror = () => resolve() // Resolve ngay cả khi lỗi
        })
      })
    
    // Chờ tất cả logo tải xong (hoặc timeout sau 5 giây)
    try {
      await Promise.race([
        Promise.all(logoPromises),
        new Promise(resolve => setTimeout(resolve, 5000)) // 5 giây timeout
      ])
    } catch (error) {
      console.log('Some logos failed to load, but continuing...')
    }
    
    setCompanyLogosLoaded(true)
  }, [])

  // Preload company logos when companies data is available
  useEffect(() => {
    if (companies && companies.length > 0) {
      preloadCompanyLogos(companies)
    }
  }, [companies, preloadCompanyLogos])

  // Check if all assets are loaded whenever dependencies change
  useEffect(() => {
    checkAllAssetsLoaded()
  }, [checkAllAssetsLoaded])

  // Show loading screen until everything is ready
  if (!isLoaded) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800/90 to-slate-900 overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0">
          {/* Multiple gradient layers for depth - reduced purple intensity */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-600/8 via-transparent to-transparent animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* Animated geometric shapes */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-bounce" style={{ animationDuration: '6s' }}></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-xl animate-bounce" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-xl animate-bounce" style={{ animationDuration: '10s', animationDelay: '4s' }}></div>
        </div>

        {/* Loading Screen */}
        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-6 border border-white/20 shadow-2xl">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-2 border-white/60 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-white/80 text-lg font-medium">Đang tải trang...</div>
              <div className="text-white/60 text-sm">
                {loading ? 'Đang tải dữ liệu công ty...' : 
                 !logoLoaded ? 'Đang tải logo chính...' : 
                 !companyLogosLoaded ? 'Đang tải logo công ty...' : 
                 'Chuẩn bị hiển thị...'}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800/90 to-slate-900 overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Multiple gradient layers for depth - reduced purple intensity */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-600/8 via-transparent to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Animated geometric shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-bounce" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-xl animate-bounce" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-xl animate-bounce" style={{ animationDuration: '10s', animationDelay: '4s' }}></div>

        {/* Floating Company Logos */}
        {companies && companies.length > 0 && companies.map((company, index) => {
          const position = logoPositions[index]
          if (!position) return null
          console.log("Com", company)
          return (
            <div
              key={company.id}
              className={`absolute hover:opacity-60 transition-all duration-300 hover:scale-110 cursor-pointer ${
                isTeleporting ? 'opacity-0' : 'opacity-25'
              }`}
              style={{
                left: `${position.left}%`,
                top: `${position.top}%`,
              }}
            >
<div className="relative w-20 h-20 md:w-24 md:h-24 filter drop-shadow-2xl">
                {company.logo_url ? (
                  <Image
                    src={company.logo_url}
                    alt={`${company.name} logo`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 80px, 96px"
                  />
                ) : (
                  <div className="w-full h-full bg-white/15 rounded-xl backdrop-blur-md border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center">
                    <div className="text-white/80 text-xs font-medium text-center px-2">
                      {company.name.split(' ').map(word => word[0]).join('').toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div
          className={`text-center transition-all duration-3000 ease-out animate-fade-in-up ${isLoaded ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-16 scale-95"}`}
        >
          {/* Logo Section */}
          <div className="mb-12">
            <div className="mb-8 flex justify-center">
              <div className="relative group">
                {/* Simple glow effect */}
                <div className="absolute -inset-4 bg-white/10 blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>
                
                {/* Logo container - minimal styling */}
                <div className="relative w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 transition-all duration-500 hover:scale-105">
                  {/* Clean backdrop without border */}
                  <div className="absolute inset-0 bg-slate-800/40 backdrop-blur-sm shadow-2xl"></div>
                  
                  {!logoLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white/30 border-t-white/80 rounded-full animate-spin"></div>
                    </div>
                  )}
                  <Image
                    src="/main-logo.png"
                    alt="APEC Global Logo"
                    fill
                    className={`object-contain transition-opacity duration-500 relative z-10 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
                    style={{ 
                      filter: 'drop-shadow(0 4px 20px rgba(255,255,255,0.5)) drop-shadow(0 0 50px rgba(255,255,255,0.3)) contrast(1.2) brightness(1.2)',
                    }}
                    sizes="(max-width: 768px) 144px, (max-width: 1024px) 192px, 224px"
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
                <span className="bg-gradient-to-r from-purple-400 via-white to-blue-400 bg-clip-text text-transparent animate-glow animate-gradient">
                  TẬP ĐOÀN KINH TẾ
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent animate-gradient">
                  APEC GLOBAL
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
          <div className="mb-16">
            <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-4 font-light leading-relaxed">
              Thống nhất hệ sinh thái công nghệ tương lai
            </p>
            <p className="text-sm md:text-base text-white/60 font-light italic">
              Kết nối • Đổi mới • Phát triển bền vững
            </p>
          </div>

          {/* Enhanced Enter Button */}
          <div className="relative group animate-bounce-in">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-300 animate-pulse-glow"></div>
            <Button
              onClick={onEnterSite}
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
        

        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          25% { 
            transform: translateY(-20px) rotate(5deg); 
          }
          50% { 
            transform: translateY(-10px) rotate(-5deg); 
          }
          75% { 
            transform: translateY(-30px) rotate(3deg); 
          }
        }
      `}</style>
    </div>
  )
}
