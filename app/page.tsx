"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import SplashPage from "@/components/splash-page"

export default function Page() {
  const [showSplash, setShowSplash] = useState(true)
  const router = useRouter()

  // Removed auto-redirect - user must click button to enter

  const handleEnterSite = () => {
    console.log('🚀 handleEnterSite clicked - redirecting to /home')
    console.log('📍 Current pathname:', window.location.pathname)
    console.log('🛠️ Router object:', router)
    
    try {
      // Try Next.js router first
      console.log('🔄 Attempting router.push("/home")...')
      router.push("/home")
      console.log('✅ router.push("/home") executed successfully')
      
      // Add a timeout to check if navigation worked
      setTimeout(() => {
        console.log('⏰ Checking navigation after 1s...')
        console.log('📍 Current pathname after router.push:', window.location.pathname)
        if (window.location.pathname === '/') {
          console.log('⚠️ Router.push failed, using window.location.href fallback')
          window.location.href = '/home'
        }
      }, 1000)
      
    } catch (error) {
      console.error('❌ Error in router.push:', error)
      console.log('🔄 Fallback to window.location.href')
      window.location.href = '/home'
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <SplashPage onEnterSite={handleEnterSite} />
    </div>
  )
}
