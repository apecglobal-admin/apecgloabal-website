export default function Footer() {
  return (
    <footer className="bg-black/80 border-t border-purple-500/30 mt-12 sm:mt-16">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="text-center sm:text-left">
            <h3 className="text-white font-bold text-lg mb-3 sm:mb-4">ApecGlobal Group</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Thống nhất hệ sinh thái công nghệ, tạo ra tương lai số cho Việt Nam và khu vực.
            </p>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-base">Công ty thành viên</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>ApecTech</li>
              <li>GuardCam</li>
              <li>EmoCommerce</li>
              <li>TimeLoop</li>
              <li>ApecNeuroOS</li>
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-base">Liên kết</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="/projects" className="hover:text-white transition-colors">
                  Dự án
                </a>
              </li>
              <li>
                <a href="/news" className="hover:text-white transition-colors">
                  Tin tức
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition-colors">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-base">Liên hệ</h4>
            <div className="space-y-2 text-white/60 text-sm">
              <p>Email: info@apecglobal.com</p>
              <p>Điện thoại: +84 123 456 789</p>
              <p>Địa chỉ: Hà Nội, Việt Nam</p>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-500/30 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-white/60 text-sm">© 2024 ApecGlobal Group. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
