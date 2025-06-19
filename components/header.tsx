"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Globe } from "lucide-react"
import Link from "next/link"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [language, setLanguage] = useState("vi")
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleLanguage = () => {
    setLanguage(language === "vi" ? "en" : "vi")
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/90 backdrop-blur-md border-b border-purple-500/30"
          : "bg-black/80 backdrop-blur-sm border-b border-purple-500/20"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 z-50">
            <Link
              href="/home"
              className="flex items-center space-x-2 hover:scale-105 transform transition-all duration-200"
              onClick={closeMenu}
            >
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm lg:text-base">A</span>
              </div>
              <span className="text-lg lg:text-xl font-bold text-white">ApecGlobal</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link
              href="/about"
              className="text-white/80 hover:text-white transition-all duration-200 hover:scale-105 transform text-sm xl:text-base font-medium"
            >
              {language === "vi" ? "Giới Thiệu" : "About"}
            </Link>
            <Link
              href="/companies"
              className="text-white/80 hover:text-white transition-all duration-200 hover:scale-105 transform text-sm xl:text-base font-medium"
            >
              {language === "vi" ? "Công Ty" : "Companies"}
            </Link>
            <Link
              href="/projects"
              className="text-white/80 hover:text-white transition-all duration-200 hover:scale-105 transform text-sm xl:text-base font-medium"
            >
              {language === "vi" ? "Dự Án" : "Projects"}
            </Link>
            <Link
              href="/news"
              className="text-white/80 hover:text-white transition-all duration-200 hover:scale-105 transform text-sm xl:text-base font-medium"
            >
              {language === "vi" ? "Tin Tức" : "News"}
            </Link>
            <Link
              href="/services"
              className="text-white/80 hover:text-white transition-all duration-200 hover:scale-105 transform text-sm xl:text-base font-medium"
            >
              {language === "vi" ? "Dịch Vụ" : "Services"}
            </Link>
            <Link
              href="/careers"
              className="text-white/80 hover:text-white transition-all duration-200 hover:scale-105 transform text-sm xl:text-base font-medium"
            >
              {language === "vi" ? "Tuyển Dụng" : "Careers"}
            </Link>
            <Link
              href="/contact"
              className="text-white/80 hover:text-white transition-all duration-200 hover:scale-105 transform text-sm xl:text-base font-medium"
            >
              {language === "vi" ? "Liên Hệ" : "Contact"}
            </Link>
          </nav>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center space-x-3 lg:space-x-4 z-50">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-white/80 hover:text-white hover:bg-white/10 border border-white/20 px-3 py-1.5"
            >
              <Globe className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
              <span className="text-xs lg:text-sm font-medium">{language.toUpperCase()}</span>
            </Button>

            <button
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && <div className="fixed inset-0 bg-black/80 backdrop-blur-sm lg:hidden" onClick={closeMenu} />}

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed top-16 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-purple-500/30 transition-all duration-300 ${
            isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
          }`}
        >
          <nav className="container mx-auto px-4 py-6">
            <div className="flex flex-col space-y-4">
              <Link
                href="/about"
                className="text-white/80 hover:text-white transition-colors py-3 px-4 rounded-lg hover:bg-white/10 text-base font-medium"
                onClick={closeMenu}
              >
                {language === "vi" ? "Giới Thiệu" : "About"}
              </Link>
              <Link
                href="/companies"
                className="text-white/80 hover:text-white transition-colors py-3 px-4 rounded-lg hover:bg-white/10 text-base font-medium"
                onClick={closeMenu}
              >
                {language === "vi" ? "Công Ty" : "Companies"}
              </Link>
              <Link
                href="/projects"
                className="text-white/80 hover:text-white transition-colors py-3 px-4 rounded-lg hover:bg-white/10 text-base font-medium"
                onClick={closeMenu}
              >
                {language === "vi" ? "Dự Án" : "Projects"}
              </Link>
              <Link
                href="/news"
                className="text-white/80 hover:text-white transition-colors py-3 px-4 rounded-lg hover:bg-white/10 text-base font-medium"
                onClick={closeMenu}
              >
                {language === "vi" ? "Tin Tức" : "News"}
              </Link>
              <Link
                href="/services"
                className="text-white/80 hover:text-white transition-colors py-3 px-4 rounded-lg hover:bg-white/10 text-base font-medium"
                onClick={closeMenu}
              >
                {language === "vi" ? "Dịch Vụ" : "Services"}
              </Link>
              <Link
                href="/careers"
                className="text-white/80 hover:text-white transition-colors py-3 px-4 rounded-lg hover:bg-white/10 text-base font-medium"
                onClick={closeMenu}
              >
                {language === "vi" ? "Tuyển Dụng" : "Careers"}
              </Link>
              <Link
                href="/contact"
                className="text-white/80 hover:text-white transition-colors py-3 px-4 rounded-lg hover:bg-white/10 text-base font-medium"
                onClick={closeMenu}
              >
                {language === "vi" ? "Liên Hệ" : "Contact"}
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
