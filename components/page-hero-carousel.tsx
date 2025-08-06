"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"

interface HeroSlide {
  title: string
  subtitle: string
  gradient: string
  backgroundImage: string
  heroImage: string
  primaryButton: {
    text: string
    href: string
    gradient: string
    hoverGradient: string
  }
  secondaryButton: {
    text: string
    href: string
    borderColor: string
    hoverBg: string
    hoverBorder: string
  }
}

interface PageHeroCarouselProps {
  slides: HeroSlide[]
  autoPlayInterval?: number
}

export default function PageHeroCarousel({ slides, autoPlayInterval = 5000 }: PageHeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlay || slides.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [isAutoPlay, slides.length, autoPlayInterval])

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  if (slides.length === 0) return null

  const currentSlideData = slides[currentSlide]

  return (
    <div className="w-full">
      {/* Background Image với overlay - CỐ ĐỊNH */}
      <div className="relative min-h-[500px] sm:min-h-[550px] md:min-h-[600px] lg:min-h-[650px] xl:min-h-[700px] overflow-hidden group">
        {/* Background Image - SỬ DỤNG SLIDE ĐẦU TIÊN CỐ ĐỊNH */}
        <div className="absolute inset-0">
          <Image
            src={slides[0].backgroundImage}
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
        </div>

        {/* Navigation Buttons - Only show if more than 1 slide */}
        {slides.length > 1 && (
          <>
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
          </>
        )}

        {/* Content Layout - RESPONSIVE MOBILE IMPROVED */}
        <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-center lg:justify-between px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-12 lg:py-20 xl:px-16">
          {/* Left Side - Content CỐ ĐỊNH - SỬ DỤNG SLIDE ĐẦU TIÊN */}
          <div className="flex-1 text-center lg:text-left animate-fade-in-up lg:pr-6 xl:pr-8 w-full max-w-2xl lg:max-w-none mx-auto lg:mx-0">
            <h1 className={`hero-title font-bold mb-4 sm:mb-5 md:mb-6 lg:mb-8 bg-gradient-to-r ${slides[0].gradient} bg-clip-text text-transparent animate-glow text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight`}>
              {slides[0].title}
            </h1>
            <p className="hero-subtitle text-white/90 mb-6 sm:mb-7 md:mb-8 lg:mb-10 max-w-xl lg:max-w-2xl mx-auto lg:mx-0 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl px-2 sm:px-0">
              {slides[0].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start max-w-sm sm:max-w-none mx-auto lg:mx-0">
              <Link href={slides[0].primaryButton.href}>
                <Button className={`w-full sm:w-auto bg-red-700 hover:bg-red-800 text-white border-0 text-sm sm:text-base md:text-lg px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl rounded-lg`}>
                  {slides[0].primaryButton.text}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link href={slides[0].secondaryButton.href}>
                <Button
                  variant="outline"
                  className={`w-full sm:w-auto bg-white/10 backdrop-blur-sm border border-gray-300 text-white hover:bg-white hover:text-black text-sm sm:text-base md:text-lg px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl rounded-lg`}
                >
                  {slides[0].secondaryButton.text}
                  <ExternalLink className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Hero Image - CHỈ SLIDE ẢNH, KHÔNG ANIMATION ĐUNG ĐƯA */}
          <div className="flex-1 mt-8 sm:mt-10 lg:mt-0 lg:pl-6 xl:pl-8 w-full">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] xl:max-w-[480px] mx-auto">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={currentSlideData.heroImage}
                  alt="Hero Image"
                  fill
                  className="object-cover transition-opacity duration-500 ease-in-out"
                  sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 380px, (max-width: 1280px) 420px, 480px"
                />
                {/* Subtle overlay for hero image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                {/* Simple border - no animation */}
                <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/30" />
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators - Only show if more than 1 slide */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {slides.map((_, index) => (
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
        )}

        {/* Slide counter - Only show if more than 1 slide */}
        {slides.length > 1 && (
          <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-white text-xs sm:text-sm">
            {currentSlide + 1} / {slides.length}
          </div>
        )}
      </div>
    </div>
  )
}