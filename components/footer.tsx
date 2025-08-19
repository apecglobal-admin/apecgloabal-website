export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-12 sm:mt-16">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="text-center sm:text-left">
            <h3 className="text-black font-bold text-lg mb-3 sm:mb-4">ApecGlobal Group</h3>
            <p className="text-black/70 text-sm leading-relaxed">
              Thống nhất hệ sinh thái công nghệ, tạo ra <span className="text-red-700 font-semibold">tương lai số</span> cho Việt Nam và khu vực.
            </p>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="text-black font-semibold mb-3 sm:mb-4 text-base">Công ty thành viên</h4>
            <ul className="space-y-2 text-black/70 text-sm">
              <li className="hover:text-red-700 transition-colors cursor-pointer">ApecTech</li>
              <li className="hover:text-red-700 transition-colors cursor-pointer">GuardCam</li>
              <li className="hover:text-red-700 transition-colors cursor-pointer">EmoCommerce</li>
              <li className="hover:text-red-700 transition-colors cursor-pointer">TimeLoop</li>
              <li className="hover:text-red-700 transition-colors cursor-pointer">ApecNeuroOS</li>
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="text-black font-semibold mb-3 sm:mb-4 text-base">Liên kết</h4>
            <ul className="space-y-2 text-black/70 text-sm">
              <li>
                <a href="/about" className="hover:text-red-700 transition-colors">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="/projects" className="hover:text-red-700 transition-colors">
                  Dự án
                </a>
              </li>
              <li>
                <a href="/news" className="hover:text-red-700 transition-colors">
                  Tin tức
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-red-700 transition-colors">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="text-black font-semibold mb-3 sm:mb-4 text-base">Liên hệ</h4>
            <div className="space-y-2 text-black/70 text-sm">
              <p>Email: <span className="text-red-700 font-medium">info@apecglobal.com</span></p>
              <p>Điện thoại: <span className="text-red-700 font-medium">+84 123 456 789</span></p>
              <p>Địa chỉ: Hà Nội, Việt Nam</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-black/70 text-sm">© 2024 <span className="text-red-700 font-semibold">ApecGlobal Group</span>. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
