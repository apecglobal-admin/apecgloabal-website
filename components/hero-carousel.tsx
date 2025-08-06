"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  const heroSlides = [
    {
      title: "TẬP ĐOÀN KINH TẾ APEC GLOBAL",
      subtitle: "Thống nhất hệ sinh thái công nghệ, tạo ra tương lai số cho Việt Nam và khu vực",
      gradient: "from-purple-400 via-white to-blue-400",
      backgroundImage: "https://images.pexels.com/photos/3184460/pexels-photo-3184460.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      heroImage: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      primaryButton: {
        text: "Khám Phá Ngay",
        href: "/about",
        gradient: "from-purple-600 to-blue-600",
        hoverGradient: "from-purple-700 to-blue-700"
      },
      secondaryButton: {
        text: "Cổng Nội Bộ",
        href: "/internal",
        borderColor: "border-purple-500/50",
        hoverBg: "bg-purple-500/20",
        hoverBorder: "border-purple-400"
      }
    },
    {
      title: "ĐỔI MỚI SÁNG TẠO",
      subtitle: "Phát triển các giải pháp công nghệ tiên tiến, định hình tương lai số hoá doanh nghiệp",
      gradient: "from-blue-400 via-white to-cyan-400",
      backgroundImage: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      heroImage: "https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      primaryButton: {
        text: "Dịch Vụ Của Chúng Tôi",
        href: "/services",
        gradient: "from-blue-600 to-cyan-600",
        hoverGradient: "from-blue-700 to-cyan-700"
      },
      secondaryButton: {
        text: "Xem Dự Án",
        href: "/projects",
        borderColor: "border-blue-500/50",
        hoverBg: "bg-blue-500/20",
        hoverBorder: "border-blue-400"
      }
    },
    {
      title: "HỆ SINH THÁI CÔNG NGHỆ",
      subtitle: "Kết nối 5+ công ty thành viên, tạo ra hệ sinh thái công nghệ mạnh mẽ và toàn diện",
      gradient: "from-green-400 via-white to-emerald-400",
      backgroundImage: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      heroImage: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      primaryButton: {
        text: "Khám Phá Hệ Sinh Thái",
        href: "/companies",
        gradient: "from-green-600 to-emerald-600",
        hoverGradient: "from-green-700 to-emerald-700"
      },
      secondaryButton: {
        text: "Tham Gia Với Chúng Tôi",
        href: "/careers",
        borderColor: "border-green-500/50",
        hoverBg: "bg-green-500/20",
        hoverBorder: "border-green-400"
      }
    }
  ]

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlay) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000) // 5 giây chuyển slide

    return () => clearInterval(interval)
  }, [isAutoPlay, heroSlides.length])

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const currentSlideData = heroSlides[currentSlide]

  return (
    <div className="w-full">
      {/* Background Image với overlay - CỐ ĐỊNH */}
      <div className="relative min-h-[550px] sm:min-h-[650px] md:min-h-[750px] lg:min-h-[800px] xl:min-h-[850px] overflow-hidden group">
        {/* Background Image - SỬ DỤNG SLIDE ĐẦU TIÊN CỐ ĐỊNH */}
        <div className="absolute inset-0">
          <Image
            src={heroSlides[0].backgroundImage}
            alt="APEC Global Background"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-2 sm:p-3 text-white transition-all duration-300 opacity-70 sm:opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>
        
        <button
          onClick={nextSlide}
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-2 sm:p-3 text-white transition-all duration-300 opacity-70 sm:opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>

        {/* Content Layout - RESPONSIVE MOBILE IMPROVED */}
        <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-center lg:justify-between px-4 py-10 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-12 lg:py-24 xl:px-16">
          {/* Left Side - Content CỐ ĐỊNH - SỬ DỤNG SLIDE ĐẦU TIÊN */}
          <div className="flex-1 text-center lg:text-left animate-fade-in-up lg:pr-6 xl:pr-8 w-full max-w-2xl lg:max-w-none mx-auto lg:mx-0">
            <h1 className={`hero-title font-bold mb-5 sm:mb-6 md:mb-7 lg:mb-8 xl:mb-10 bg-gradient-to-r ${heroSlides[0].gradient} bg-clip-text text-transparent animate-glow text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight`}>
              {heroSlides[0].title}
            </h1>
            <p className="hero-subtitle text-white/90 mb-7 sm:mb-8 md:mb-9 lg:mb-10 xl:mb-12 max-w-xl lg:max-w-2xl mx-auto lg:mx-0 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl px-2 sm:px-0">
              {heroSlides[0].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center lg:justify-start max-w-sm sm:max-w-none mx-auto lg:mx-0">
              <Link href={heroSlides[0].primaryButton.href}>
                <Button className={`w-full sm:w-auto bg-gradient-to-r ${heroSlides[0].primaryButton.gradient} hover:${heroSlides[0].primaryButton.hoverGradient} text-white border-0 text-sm sm:text-base md:text-lg lg:text-xl px-6 sm:px-7 md:px-8 lg:px-10 py-3 sm:py-3.5 md:py-4 lg:py-5 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl rounded-lg`}>
                  {heroSlides[0].primaryButton.text}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </Button>
              </Link>
              <Link href={heroSlides[0].secondaryButton.href}>
                <Button
                  variant="outline"
                  className={`w-full sm:w-auto bg-white/10 backdrop-blur-sm border-2 ${heroSlides[0].secondaryButton.borderColor} text-white hover:${heroSlides[0].secondaryButton.hoverBg} hover:${heroSlides[0].secondaryButton.hoverBorder} hover:text-white text-sm sm:text-base md:text-lg lg:text-xl px-6 sm:px-7 md:px-8 lg:px-10 py-3 sm:py-3.5 md:py-4 lg:py-5 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl rounded-lg`}
                >
                  {heroSlides[0].secondaryButton.text}
                  <ExternalLink className="ml-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Hero Image - CHỈ SLIDE ẢNH, KHÔNG ANIMATION ĐUNG ĐƯA */}
          <div className="flex-1 mt-10 sm:mt-12 lg:mt-0 lg:pl-6 xl:pl-8 w-full">
            <div className="relative w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px] xl:max-w-[500px] mx-auto">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={currentSlideData.heroImage}
                  alt="APEC Global Technology"
                  fill
                  className="object-cover transition-opacity duration-500 ease-in-out"
                  sizes="(max-width: 640px) 300px, (max-width: 768px) 350px, (max-width: 1024px) 400px, (max-width: 1280px) 450px, 500px"
                />
                {/* Subtle overlay for hero image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                {/* Simple border - no animation */}
                <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/30" />
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              onMouseEnter={() => setIsAutoPlay(false)}
              onMouseLeave={() => setIsAutoPlay(true)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white shadow-lg scale-125'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Slide counter */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-white text-xs sm:text-sm">
          {currentSlide + 1} / {heroSlides.length}
        </div>
      </div>
    </div>
  )
}