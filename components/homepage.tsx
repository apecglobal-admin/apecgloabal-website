"use client"

import { useState } from "react"
import Header from "@/components/header"
import InternalPortal from "@/components/cms-portal"
import PublicPortal from "@/components/public-portal"
import Footer from "@/components/footer"

export default function Homepage() {
  const [activeSection, setActiveSection] = useState<"internal" | "public">("public")

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <Header />

      {/* Zone Selector */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-2 border border-purple-500/30">
            <button
              onClick={() => setActiveSection("public")}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                activeSection === "public"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "text-white/70 hover:text-white"
              }`}
            >
              🌐 Cổng Thông Tin Công Cộng
            </button>
            <button
              onClick={() => setActiveSection("internal")}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                activeSection === "internal"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "text-white/70 hover:text-white"
              }`}
            >
              🔒 CMS
            </button>
          </div>
        </div>

        {/* Content Sections */}
        <div className="transition-all duration-500">
          {activeSection === "public" ? <PublicPortal /> : <InternalPortal />}
        </div>
      </div>

      <Footer />
    </div>
  )
}
