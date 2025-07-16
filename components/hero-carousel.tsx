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
      {/* Background Image với overlay */}
      <div className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px] overflow-hidden group">
        {/* Background Image với transition */}
        <div className="absolute inset-0">
          <Image
            src={currentSlideData.backgroundImage}
            alt="APEC Global Background"
            fill
            className="object-cover transition-all duration-1000 ease-in-out"
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

        {/* Content Layout */}
        <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-between p-4 sm:p-6 md:p-8 lg:p-16">
          {/* Left Side - Content */}
          <div className="flex-1 text-center lg:text-left animate-fade-in-up lg:pr-8 w-full">
            <h1 className={`hero-title font-bold mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r ${currentSlideData.gradient} bg-clip-text text-transparent animate-glow text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight`}>
              {currentSlideData.title}
            </h1>
            <p className="hero-subtitle text-white/90 mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl">
              {currentSlideData.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start max-w-md sm:max-w-none mx-auto lg:mx-0">
              <Link href={currentSlideData.primaryButton.href}>
                <Button className={`w-full sm:w-auto bg-gradient-to-r ${currentSlideData.primaryButton.gradient} hover:${currentSlideData.primaryButton.hoverGradient} text-white border-0 text-xs sm:text-sm md:text-base lg:text-lg px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl`}>
                  {currentSlideData.primaryButton.text}
                  <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
              <Link href={currentSlideData.secondaryButton.href}>
                <Button
                  variant="outline"
                  className={`w-full sm:w-auto bg-white/10 backdrop-blur-sm border-2 ${currentSlideData.secondaryButton.borderColor} text-white hover:${currentSlideData.secondaryButton.hoverBg} hover:${currentSlideData.secondaryButton.hoverBorder} hover:text-white text-xs sm:text-sm md:text-base lg:text-lg px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl`}
                >
                  {currentSlideData.secondaryButton.text}
                  <ExternalLink className="ml-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="flex-1 mt-6 sm:mt-8 lg:mt-0 lg:pl-8 w-full">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl animate-float">
                <Image
                  src={currentSlideData.heroImage}
                  alt="APEC Global Technology"
                  fill
                  className="object-cover transition-all duration-1000 ease-in-out hover:scale-105"
                />
                {/* Subtle overlay for hero image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/30 animate-pulse-glow" />
              </div>
              {/* Decorative elements - responsive sizes */}
              <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
              <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse delay-1000" />
              {/* Additional floating elements - hidden on very small screens */}
              <div className="hidden sm:block absolute top-1/4 -left-6 lg:-left-8 w-3 h-3 lg:w-4 lg:h-4 bg-purple-400/40 rounded-full animate-float-1" />
              <div className="hidden sm:block absolute top-3/4 -right-4 lg:-right-6 w-2 h-2 lg:w-3 lg:h-3 bg-blue-400/40 rounded-full animate-float-2" />
              <div className="hidden sm:block absolute bottom-1/4 -left-3 lg:-left-4 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-cyan-400/40 rounded-full animate-float-3" />
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