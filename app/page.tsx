"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import SplashPage from "@/components/splash-page"

export default function Page() {
  const [showSplash, setShowSplash] = useState(true)
  const router = useRouter()

  // Removed auto-redirect - user must click button to enter

  const handleEnterSite = () => {
    router.push("/home")
  }

  return (
    <div className="min-h-screen bg-black">
      <SplashPage onEnterSite={handleEnterSite} />
    </div>
  )
}
