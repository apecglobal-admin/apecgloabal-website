"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import SplashPage from "@/components/splash-page"

export default function Page() {
  const [showSplash, setShowSplash] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      router.push("/home")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  const handleEnterSite = () => {
    router.push("/home")
  }

  return (
    <div className="min-h-screen bg-black">
      <SplashPage onEnterSite={handleEnterSite} />
    </div>
  )
}
