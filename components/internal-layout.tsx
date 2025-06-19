"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
// Remove this import
// import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Home,
  Users,
  BarChart3,
  FileText,
  Briefcase,
  Settings,
  Bell,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react"

interface InternalLayoutProps {
  children: React.ReactNode
}

export default function InternalLayout({ children }: InternalLayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    {
      name: "Dashboard",
      href: "/internal/dashboard",
      icon: Home,
      color: "text-purple-400",
    },
    {
      name: "Nhân Viên",
      href: "/internal/employees",
      icon: Users,
      color: "text-blue-400",
    },
    {
      name: "Báo Cáo",
      href: "/internal/reports",
      icon: BarChart3,
      color: "text-green-400",
    },
    {
      name: "Tài Liệu",
      href: "/internal/documents",
      icon: FileText,
      color: "text-orange-400",
    },
    {
      name: "Dự Án",
      href: "/internal/projects",
      icon: Briefcase,
      color: "text-cyan-400",
    },
    {
      name: "Cài Đặt",
      href: "/internal/settings",
      icon: Settings,
      color: "text-gray-400",
    },
  ]

  useEffect(() => {
    const savedLoginStatus = localStorage.getItem("internal_logged_in")
    const savedUser = localStorage.getItem("internal_user")

    if (savedLoginStatus === "true" && savedUser) {
      setIsLoggedIn(true)
      setCurrentUser(savedUser)
    } else {
      router.push("/internal")
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = async () => {
    try {
      // Gọi API đăng xuất
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      // Xóa dữ liệu đăng nhập khỏi localStorage
      localStorage.removeItem("internal_logged_in")
      localStorage.removeItem("internal_user")
      setIsLoggedIn(false)
      
      // Chuyển hướng về trang chủ
      router.push("/internal")
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      {/* Remove this from the return statement
      // <Header /> */}

      {/* Internal Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-md border-b border-purple-500/30 z-40">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-4">
            <div className="lg:hidden">
              <Button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="bg-transparent border border-purple-500/30 text-white hover:bg-purple-500/20"
                size="sm"
              >
                {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-lg font-bold text-white">ApecGlobal Internal</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
              <Bell className="h-4 w-4 mr-2" />
              <Badge className="bg-red-600 text-white text-xs ml-1">5</Badge>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">
                  {currentUser === "admin" ? "AD" : currentUser.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-white text-sm hidden sm:block">
                {currentUser === "admin" ? "Administrator" : "User"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Update the mobile menu button position */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-black/50 border border-purple-500/30 text-white hover:bg-purple-500/20"
          size="sm"
        >
          {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-black/80 backdrop-blur-md border-r border-purple-500/30 transform transition-transform duration-300 z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6">
          {/* User Info */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {currentUser === "admin" ? "AD" : currentUser.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{currentUser === "admin" ? "Administrator" : "User"}</p>
                <Badge className="bg-green-600 text-white text-xs">Online</Badge>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full bg-transparent border-2 border-red-500/50 text-red-300 hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Đăng Xuất
            </Button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-4">Menu Chính</p>
            {menuItems.map((item) => {
              const IconComponent = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} onClick={() => setIsSidebarOpen(false)}>
                  <div
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? "bg-purple-500/20 border border-purple-500/50 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <IconComponent className={`h-5 w-5 ${isActive ? "text-purple-400" : item.color}`} />
                    <span className="font-medium">{item.name}</span>
                    {isActive && <ChevronRight className="h-4 w-4 ml-auto text-purple-400" />}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Quick Stats */}
          <div className="mt-8 p-4 bg-black/30 rounded-lg border border-purple-500/30">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Thống Kê</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Thông báo</span>
                <Badge className="bg-red-600 text-white text-xs">5</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Dự án</span>
                <Badge className="bg-blue-600 text-white text-xs">15</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Tài liệu</span>
                <Badge className="bg-green-600 text-white text-xs">234</Badge>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Thông Báo</p>
              <Bell className="h-4 w-4 text-purple-400" />
            </div>
            <div className="space-y-2">
              <div className="p-2 bg-black/30 rounded border-l-2 border-purple-500">
                <p className="text-white text-xs font-medium">Báo cáo Q4 cần duyệt</p>
                <p className="text-white/60 text-xs">2 giờ trước</p>
              </div>
              <div className="p-2 bg-black/30 rounded border-l-2 border-blue-500">
                <p className="text-white text-xs font-medium">Họp team 14:00</p>
                <p className="text-white/60 text-xs">Hôm nay</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen pt-16">
        <main>{children}</main>
      </div>

    </div>
  )
}
