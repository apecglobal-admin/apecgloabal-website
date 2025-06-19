import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function NewsNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <Header />
      
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Không tìm thấy tin tức
          </h2>
          <p className="text-xl text-white/80 mb-12">
            Tin tức bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/news">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách tin tức
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-purple-500/30 text-white hover:bg-purple-500/20">
                Về trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}