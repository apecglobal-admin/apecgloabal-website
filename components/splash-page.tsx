"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

interface SplashPageProps {
  onEnterSite: () => void
}

export default function SplashPage({ onEnterSite }: SplashPageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const memberCompanies = ["ApecTech", "GuardCam", "EmoCommerce", "TimeLoop", "ApecNeuroOS"]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent animate-pulse"></div>

        {/* Floating Company Logos */}
        {memberCompanies.map((company, index) => (
          <div
            key={company}
            className={`absolute text-white/20 text-sm font-light animate-float-${index + 1}`}
            style={{
              left: `${20 + index * 15}%`,
              top: `${30 + index * 10}%`,
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${8 + index}s`,
            }}
          >
            {company}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div
          className={`text-center transition-all duration-2000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-white to-blue-400 bg-clip-text text-transparent animate-glow">
              ApecGlobal
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4 rounded-full animate-pulse"></div>
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-white/80 mb-12 font-light">
            Thống nhất hệ sinh thái công nghệ tương lai
          </p>

          {/* Enter Button */}
          <Button
            onClick={onEnterSite}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
          >
            Vào Trang Chính
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Particles Effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}
