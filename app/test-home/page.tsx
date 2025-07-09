import { Building2, Target, History, Crown } from "lucide-react"

export default function TestHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Test Home Page
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-black/50 border border-purple-500/30 rounded-lg p-6 text-center">
            <Target className="h-12 w-12 mx-auto text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tầm Nhìn</h3>
            <p className="text-white/80 text-sm">
              Trở thành tập đoàn công nghệ hàng đầu
            </p>
          </div>
          
          <div className="bg-black/50 border border-purple-500/30 rounded-lg p-6 text-center">
            <Building2 className="h-12 w-12 mx-auto text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sứ Mệnh</h3>
            <p className="text-white/80 text-sm">
              Kết nối và thống nhất hệ sinh thái công nghệ
            </p>
          </div>
          
          <div className="bg-black/50 border border-purple-500/30 rounded-lg p-6 text-center">
            <History className="h-12 w-12 mx-auto text-green-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Lịch Sử</h3>
            <p className="text-white/80 text-sm">
              Thành lập 2020, phát triển mạnh mẽ
            </p>
          </div>
          
          <div className="bg-black/50 border border-purple-500/30 rounded-lg p-6 text-center">
            <Crown className="h-12 w-12 mx-auto text-yellow-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Lãnh Đạo</h3>
            <p className="text-white/80 text-sm">
              Đội ngũ lãnh đạo giàu kinh nghiệm
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-white/60">
            All icons are displaying correctly! ✅
          </p>
        </div>
      </div>
    </div>
  )
}