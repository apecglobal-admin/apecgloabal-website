"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, ExternalLink, Volume2, VolumeX, Play, Pause } from "lucide-react"

export default function HeroCarousel() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showIndicator, setShowIndicator] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)

  const heroData = {
    title: "TẬP ĐOÀN KINH TẾ APEC GLOBAL",
    subtitle: "Thống nhất hệ sinh thái công nghệ, tạo ra tương lai số cho Việt Nam và khu vực",
    videoUrl: "/video/main.mp4",
    primaryButton: {
      text: "Khám Phá Ngay",
      href: "/about",
      gradient: "from-purple-600 to-blue-600",
      hoverGradient: "from-purple-700 to-blue-700"
    },
    secondaryButton: {
      text: "Cổng Nội Bộ",
      href: "/cms"
    }
  }

  const handleTogglePlay = () => {
    if (!videoRef.current) return
    const video = videoRef.current
    if (video.paused) {
      video.play()
      setIsPlaying(true)
      setShowIndicator(false)
    } else {
      video.pause()
      setIsPlaying(false)
      setShowIndicator(true)
    }
  }

  const handleToggleMute = () => {
    const video = videoRef.current
    if (!video) return
    const nextMuted = !video.muted
    video.muted = nextMuted
    setIsMuted(nextMuted)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newTime = Number(e.target.value)
    video.currentTime = newTime
    setProgress(newTime) // reflect immediately in UI

    // Ensure playback continues smoothly after seek
    if (!video.paused) {
      // Some mobile browsers need an explicit play after programmatic seek
      const playPromise = video.play()
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.catch(() => {})
      }
    }
  }

  useEffect(() => {
    if (!videoRef.current) return

    const video = videoRef.current

    // Initialize states from video element
    setIsMuted(video.muted)
    setIsPlaying(!video.paused)

    const updateProgress = () => setProgress(video.currentTime)
    const setMeta = () => setDuration(video.duration)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    video.addEventListener("timeupdate", updateProgress)
    video.addEventListener("loadedmetadata", setMeta)
    video.addEventListener("play", onPlay)
    video.addEventListener("pause", onPause)

    const timer = setTimeout(() => setShowIndicator(false), 2000)

    return () => {
      video.removeEventListener("timeupdate", updateProgress)
      video.removeEventListener("loadedmetadata", setMeta)
      video.removeEventListener("play", onPlay)
      video.removeEventListener("pause", onPause)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="w-full bg-white">
      <div className="relative min-h-[550px] lg:min-h-[800px] overflow-hidden">
        <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-center lg:justify-between px-0 lg:px-12 py-0 lg:py-24 gap-0 lg:gap-8">
          
          {/* Left Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left lg:px-6 pt-8 pb-2 lg:py-16 lg:p-0 z-20">
            <h1 className="font-bold lg:mb-6 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent text-2xl sm:text-4xl lg:text-6xl leading-tight">
              {heroData.title}
            </h1>
            <p className="text-gray-700 mb-8 text-sm sm:text-lg hidden lg:block">
              {heroData.subtitle}
            </p>

            {/* Buttons desktop */}
            <div className="hidden lg:flex flex-row gap-4">
              <Link href={heroData.primaryButton.href}>
                <Button
                  className={`bg-gradient-to-r ${heroData.primaryButton.gradient} hover:${heroData.primaryButton.hoverGradient} text-white px-6 py-3 text-lg`}
                >
                  {heroData.primaryButton.text}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href={heroData.secondaryButton.href}>
                <Button
                  variant="outline"
                  className="bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 text-lg"
                >
                  {heroData.secondaryButton.text}
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Video */}
          {/* Right Video */}
<div className="w-full lg:w-1/2 mx-auto lg:mx-0">
  <div
    className="
      relative w-full h-[60vh]
      lg:relative lg:w-full lg:h-auto
      lg:aspect-square lg:rounded-2xl lg:overflow-hidden lg:shadow-2xl
      z-10
    "
  >
    <video
      ref={videoRef}
      className="w-full h-full object-cover"
      autoPlay
      muted={isMuted}
      loop
      playsInline
      preload="auto"
      poster="/images/hero/hero-tech-1.jpg"
      onClick={handleTogglePlay}
      onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
      onTimeUpdate={() => setProgress(videoRef.current?.currentTime || 0)}
    >
      <source src={heroData.videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    {/* Play Indicator */}
{showIndicator && (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <button
      onClick={handleTogglePlay}
      className="pointer-events-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
      aria-label="Play"
    >
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-600/80 flex items-center justify-center">
        <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-transparent border-l-[12px] border-l-white ml-1"></div>
      </div>
    </button>
  </div>
)}

{/* Controls: play/pause, progress, mute */}
<div
  className="
    absolute bottom-0 left-0 right-0 p-3 
    bg-gradient-to-t from-black/60 to-transparent 
    flex items-center gap-3 
    lg:rounded-b-2xl z-20
  "
>
  {/* Play/Pause */}
  <button
    onClick={handleTogglePlay}
    className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
    aria-label={isPlaying ? 'Pause' : 'Play'}
  >
    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
  </button>

  {/* Progress */}
  <input
    type="range"
    min={0}
    max={duration || 0}
    step="0.1"
    value={progress}
    onChange={handleSeek}
    className="flex-1 accent-red-600"
  />

  {/* Mute */}
  <button
    onClick={handleToggleMute}
    className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
    aria-label={isMuted ? 'Unmute' : 'Mute'}
  >
    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
  </button>
</div>


    {/* Buttons overlay mobile */}
    <div className="absolute top-4 left-0 right-0 block gap-4 lg:hidden">
      <p className="text-white text-center mb-2 sm:mb-4 px-4">
        {heroData.subtitle}
      </p>
      <div className="flex flex-row gap-3 justify-center px-3">
        <Link href={heroData.primaryButton.href} className="flex-1">
          <Button
            className={`w-full bg-gradient-to-r ${heroData.primaryButton.gradient} hover:${heroData.primaryButton.hoverGradient} text-white`}
          >
            {heroData.primaryButton.text}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        <Link href={heroData.secondaryButton.href} className="flex-1">
          <Button
            variant="outline"
            className="w-full bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {heroData.secondaryButton.text}
            <ExternalLink className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  </div>
</div>

        </div>
      </div>
    </div>
  )
}
