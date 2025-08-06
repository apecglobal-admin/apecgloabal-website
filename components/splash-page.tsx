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
  const [companyLogosLoaded, setCompanyLogosLoaded] = useState(false)
  const [logoPositions, setLogoPositions] = useState<Array<{
    left: number;
    top: number;
  }>>([])
  const [isTeleporting, setIsTeleporting] = useState(false)
  
  // Fallback companies data nếu API fails
  
  // Tạo fetch function stable để tránh re-render vô hạn
  const fetchCompanies = useCallback(async () => {
    const response = await fetch('/api/companies')
    if (!response.ok) {
      throw new Error('Failed to fetch companies')
    }
    const data = await response.json()
    return data
  }, [])

  // Sử dụng API cache để lấy companies với khả năng refresh
  const { data: apiResponse, loading, error, refetch } = useApiCache<any>(
    'companies',
    fetchCompanies,
    2 * 60 * 1000 // Cache 2 phút (ngắn hơn để cập nhật nhanh hơn)
  )

  // Extract companies array from API response
  const apiCompanies = apiResponse?.success ? apiResponse.data : null

  // Sử dụng fallback data nếu API không có data
  const allCompanies = Array.isArray(apiCompanies) ? apiCompanies : []
  
  // Tách parent company và client companies
  const parentCompany = allCompanies.find(company => company.is_parent_company === true)
  const clientCompanies = allCompanies.filter(company => company.is_parent_company !== true)

  // Auto-refresh data every 5 minutes to catch new companies
  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 5 * 60 * 1000) // 5 phút

    return () => clearInterval(interval)
  }, [refetch])

  const checkAllAssetsLoaded = useCallback(() => {
    // Đơn giản hóa điều kiện - chỉ cần logo chính load xong và API không loading
    if (logoLoaded && !loading) {
      // Delay the main animation until all assets are loaded
      setTimeout(() => setIsLoaded(true), 100)
    }
  }, [logoLoaded, loading])

  // Generate random starting positions for logos - distributed evenly across screen
  const generateRandomStartingPositions = useCallback((count: number) => {
    const positions: Array<{ left: number; top: number }> = []
    
    if (count === 0) return positions
    
    // Chia màn hình thành lưới để phân bố đều
    const gridCols = Math.ceil(Math.sqrt(count * 1.5)) // Tăng số cột để rải rộng hơn
    const gridRows = Math.ceil(count / gridCols)
    
    // Tạo danh sách các ô lưới có sẵn
    const availableCells: Array<{ col: number; row: number }> = []
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        availableCells.push({ col, row })
      }
    }
    
    // Trộn ngẫu nhiên danh sách các ô
    for (let i = availableCells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[availableCells[i], availableCells[j]] = [availableCells[j], availableCells[i]]
    }
    
    // Tạo vị trí cho từng logo trong các ô đã trộn
    for (let i = 0; i < count; i++) {
      const cell = availableCells[i]
      
      // Tính toán vị trí cơ bản của ô
      const cellWidth = 80 / gridCols  // 80% để tránh viền
      const cellHeight = 80 / gridRows
      
      const baseCellLeft = 10 + cell.col * cellWidth  // 10% offset từ viền
      const baseCellTop = 10 + cell.row * cellHeight
      
      // Thêm random trong ô để không quá cứng nhắc
      const randomOffsetX = (Math.random() - 0.5) * cellWidth * 0.8  // Random trong 80% ô
      const randomOffsetY = (Math.random() - 0.5) * cellHeight * 0.8
      
      const position = {
        left: Math.max(5, Math.min(90, baseCellLeft + cellWidth/2 + randomOffsetX)),
        top: Math.max(5, Math.min(90, baseCellTop + cellHeight/2 + randomOffsetY))
      }
      
      positions.push(position)
    }
    
    return positions
  }, [])

  // Generate random starting positions when client companies data changes
  useEffect(() => {
    if (clientCompanies && clientCompanies.length > 0) {
      console.log(`Splash Page: Generating random starting positions for ${clientCompanies.length} client companies:`, clientCompanies.map(c => c.name))
      const positions = generateRandomStartingPositions(clientCompanies.length)
      setLogoPositions(positions)
      console.log(`Splash Page: Generated ${positions.length} random starting positions`)
    }
    
    setIsTeleporting(false)
  }, [clientCompanies, generateRandomStartingPositions])

  // Continuously update logo positions for dynamic movement
  useEffect(() => {
    if (!clientCompanies || clientCompanies.length === 0) return

    const updatePositions = () => {
      const newPositions = generateRandomStartingPositions(clientCompanies.length)
      setLogoPositions(newPositions)
    }

    // Update positions every 15-25 seconds with random interval
    const getRandomInterval = () => Math.random() * 10000 + 15000 // 15-25 seconds
    
    let timeoutId: NodeJS.Timeout
    const scheduleNextUpdate = () => {
      timeoutId = setTimeout(() => {
        updatePositions()
        scheduleNextUpdate() // Schedule next update
      }, getRandomInterval())
    }

    // Start the cycle
    scheduleNextUpdate()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [clientCompanies, generateRandomStartingPositions])

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
    
    // Safety timeout - force load after 10 seconds maximum
    const safetyTimeout = setTimeout(() => {
      console.log('Safety timeout triggered - forcing page load')
      setIsLoaded(true)
    }, 10000)
    
    return () => clearTimeout(safetyTimeout)
  }, [parentCompany])

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

  // Preload company logos when client companies data is available
  useEffect(() => {
    if (clientCompanies && clientCompanies.length > 0) {
      preloadCompanyLogos(clientCompanies)
    }
  }, [clientCompanies, preloadCompanyLogos])

  // Check if all assets are loaded whenever dependencies change
  useEffect(() => {
    checkAllAssetsLoaded()
  }, [checkAllAssetsLoaded])

  // Show loading screen until everything is ready
  if (!isLoaded) {
    return (
      <div className="relative min-h-screen bg-white overflow-hidden">

        {/* Loading Screen */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-gray-50 rounded-2xl px-8 py-6 border border-gray-200 shadow-lg">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              <div className="text-gray-800 text-lg font-medium">Đang tải trang...</div>
              <div className="text-gray-600 text-sm">
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
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Floating Client Company Logos with random movement - mờ hơn */}
      <div className="absolute inset-0" style={{ padding: '100px' }}>
        {clientCompanies && clientCompanies.length > 0 && logoPositions.length > 0 && clientCompanies.map((company, index) => {
          const position = logoPositions[index]
          if (!position) return null
          
          // Assign different float animations to each logo - only smooth floating
          const floatAnimations = [
            "animate-float-1", 
            "animate-float-2", 
            "animate-float-3", 
            "animate-float-4", 
            "animate-float-5",
            "animate-float-6",
            "animate-float-7",
            "animate-float-8"
          ]
          const animationClass = floatAnimations[index % floatAnimations.length]
          
          // Tạo delay khác nhau cho mỗi logo để không bị đồng bộ
          const animationDelay = `${(index * 0.8)}s`
          
          return (
            <div
              key={company.id}
              className={`absolute hover:opacity-70 hover:scale-110 cursor-pointer opacity-40 ${animationClass}`}
              style={{
                left: `${position.left}%`,
                top: `${position.top}%`,
                animationDelay: animationDelay,
                transition: 'left 3s cubic-bezier(0.4, 0, 0.6, 1), top 3s cubic-bezier(0.4, 0, 0.6, 1), opacity 0.5s ease, transform 0.5s ease',
              }}
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 filter drop-shadow-lg">
                {company.logo_url ? (
                  <Image
                    src={company.logo_url}
                    alt={`${company.name} logo`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 56px, (max-width: 768px) 64px, (max-width: 1024px) 80px, 96px"
                  />
                ) : (
                  <div className="w-full h-full bg-white/10 rounded-xl backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
                    <div className="text-white/60 text-xs font-medium text-center px-2">
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
                
                {/* Logo container - minimal styling */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 transition-all duration-500 hover:scale-105">
                  
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
          <div className="mb-16">
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-4 font-light leading-relaxed">
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
        
        @keyframes gentleFloat {
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
