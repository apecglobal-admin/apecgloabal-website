"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, ExternalLink, Volume2, VolumeX } from "lucide-react"

export default function HeroCarousel() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showIndicator, setShowIndicator] = useState(true)
  const [isMuted, setIsMuted] = useState(true)

  // Ẩn indicator sau 2s khi video bắt đầu play
  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => setShowIndicator(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isPlaying])

  const handleTogglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
      setShowIndicator(true)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
      setTimeout(() => setShowIndicator(false), 2000)
    }
  }

  const handleToggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setIsMuted(videoRef.current.muted)
  }

  const heroData = {
    title: "TẬP ĐOÀN KINH TẾ APEC GLOBAL",
    subtitle: "Thống nhất hệ sinh thái công nghệ, tạo ra tương lai số cho Việt Nam và khu vực",
    videoUrl: "/video/main.mp4",
    primaryButton: { text: "Khám Phá Ngay", href: "/about", gradient: "from-purple-600 to-blue-600", hoverGradient: "from-purple-700 to-blue-700" },
    secondaryButton: { text: "Cổng Nội Bộ", href: "/internal" }
  }

  return (
    <div className="w-full">
      <div className="relative min-h-[650px] overflow-hidden bg-white">
        <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 py-16 lg:px-12 lg:py-24">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left lg:pr-6 xl:pr-8 max-w-2xl mx-auto">
            <h1 className="font-bold mb-8 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent text-4xl lg:text-6xl leading-tight">
              {heroData.title}
            </h1>
            <p className="text-gray-700 mb-10 max-w-xl lg:max-w-2xl mx-auto lg:mx-0 text-lg lg:text-2xl">
              {heroData.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href={heroData.primaryButton.href}>
                <Button className={`w-full sm:w-auto bg-gradient-to-r ${heroData.primaryButton.gradient} hover:${heroData.primaryButton.hoverGradient} text-white`}>
                  {heroData.primaryButton.text}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href={heroData.secondaryButton.href}>
                <Button variant="outline" className="w-full sm:w-auto bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                  {heroData.secondaryButton.text}
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right - Video */}
          <div className="flex-1 mt-12 lg:mt-0 lg:pl-6 xl:pl-8 w-full">
            <div className="relative w-full max-w-[600px] mx-auto">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster="/images/hero/hero-tech-1.jpg"
                  controlsList="nodownload"
                  onClick={handleTogglePlay}
                >
                  <source src={heroData.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Play/Pause Indicator */}
                {showIndicator && (
                  <button
                    onClick={handleTogglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 transition"
                  >
                    {isPlaying ? (
                      <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center">
                        <div className="flex gap-2">
                          <div className="w-2 h-6 bg-red-600 rounded-sm"></div>
                          <div className="w-2 h-6 bg-red-600 rounded-sm"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[12px] border-b-[12px] border-l-[20px] border-l-red-600 ml-1"></div>
                      </div>
                    )}
                  </button>
                )}

                {/* Mute/Unmute Button (luôn hiện ở góc) */}
                <button
                  onClick={handleToggleMute}
                  className="absolute bottom-3 right-3 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
