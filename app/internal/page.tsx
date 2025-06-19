"use client"
import Header from "@/components/header"
import Footer from "@/components/footer"
import InternalPortal from "@/components/internal-portal"

export default function InternalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      {/* <Header /> */}

      <div className="container mx-auto px-4 py-8">
        <InternalPortal />
      </div>

      {/* <Footer /> */}
    </div>
  )
}