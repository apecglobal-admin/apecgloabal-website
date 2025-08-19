"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"

export default function HeroCarousel() {
  // Đã loại bỏ state và logic chuyển đổi slide vì chúng ta sẽ sử dụng video cố định
  
  const heroData = {
    title: "TẬP ĐOÀN KINH TẾ APEC GLOBAL",
    subtitle: "Thống nhất hệ sinh thái công nghệ, tạo ra tương lai số cho Việt Nam và khu vực",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // URL video mẫu từ nguồn đáng tin cậy
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
  }

  return (
    <div className="w-full">
      {/* Background trắng - CỐ ĐỊNH */}
      <div className="relative min-h-[550px] sm:min-h-[650px] md:min-h-[750px] lg:min-h-[800px] xl:min-h-[850px] overflow-hidden group bg-white" style={{backgroundColor: '#ffffff', backgroundImage: 'none'}}>
        {/* Background hoàn toàn trắng - không có image */}

        {/* Content Layout - RESPONSIVE MOBILE IMPROVED */}
        <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-center lg:justify-between px-4 py-10 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-12 lg:py-24 xl:px-16">
          {/* Left Side - Content */}
          <div className="flex-1 text-center lg:text-left animate-fade-in-up lg:pr-6 xl:pr-8 w-full max-w-2xl lg:max-w-none mx-auto lg:mx-0">
            <h1 className={`hero-title font-bold mb-5 sm:mb-6 md:mb-7 lg:mb-8 xl:mb-10 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-glow text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight`}>
              {heroData.title}
            </h1>
            <p className="hero-subtitle text-gray-700 mb-7 sm:mb-8 md:mb-9 lg:mb-10 xl:mb-12 max-w-xl lg:max-w-2xl mx-auto lg:mx-0 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl px-2 sm:px-0">
              {heroData.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center lg:justify-start max-w-sm sm:max-w-none mx-auto lg:mx-0">
              <Link href={heroData.primaryButton.href}>
                <Button className={`w-full sm:w-auto bg-gradient-to-r ${heroData.primaryButton.gradient} hover:${heroData.primaryButton.hoverGradient} text-white border-0 text-sm sm:text-base md:text-lg lg:text-xl px-6 sm:px-7 md:px-8 lg:px-10 py-3 sm:py-3.5 md:py-4 lg:py-5 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl rounded-lg`}>
                  {heroData.primaryButton.text}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </Button>
              </Link>
              <Link href={heroData.secondaryButton.href}>
                <Button
                  variant="outline"
                  className={`w-full sm:w-auto bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-sm sm:text-base md:text-lg lg:text-xl px-6 sm:px-7 md:px-8 lg:px-10 py-3 sm:py-3.5 md:py-4 lg:py-5 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl rounded-lg`}
                >
                  {heroData.secondaryButton.text}
                  <ExternalLink className="ml-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Hero Video */}
          <div className="flex-1 mt-10 sm:mt-12 lg:mt-0 lg:pl-6 xl:pl-8 w-full">
            <div className="relative w-full max-w-[350px] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[540px] xl:max-w-[600px] mx-auto">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                {/* Video element */}
                <video 
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster="/images/hero/hero-tech-1.jpg" // Sử dụng ảnh hero hiện có làm poster
                  controlsList="nodownload"
                >
                  {/* Video mẫu từ nguồn đáng tin cậy */}
                  <source src={heroData.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {/* Subtle overlay for video */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                {/* Simple border - no animation */}
                <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/30" />
                {/* Play indicator overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-600/80 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-t-transparent border-b-transparent border-l-[12px] border-l-white ml-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}